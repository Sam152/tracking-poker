import { Stack, StackProps, Tags } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Duration, Size } from "aws-cdk-lib/core";
import { s3ReadObjectsFromWholeBucketPolicy } from "./utility/s3";
import { DeploymentEnvironmentAware } from "./utility/deployment-environment";
import { CommandBusAware } from "./CommandBusStack";
import { addPutEventsPolicies, invokeLambdaOnEventDetail } from "./utility/eventBridge";
import * as lambdaNodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Architecture } from "aws-cdk-lib/aws-lambda";
import * as path from "path";
import * as iam from "aws-cdk-lib/aws-iam";
import { EventBusAware } from "./EventBusStack";

type FrameAnalysisStackProps = StackProps & DeploymentEnvironmentAware & CommandBusAware & EventBusAware;

export class FrameAnalysisStack extends Stack {
    private props: FrameAnalysisStackProps;
    private readonly resolveService: (input: string) => string;

    constructor(scope: Construct, id: string, props: FrameAnalysisStackProps) {
        super(scope, id, props);
        this.props = props;

        this.resolveService = (input: string) => path.resolve(__dirname, "../../frame-analysis", input);

        this.createLambda();
        Tags.of(this).add("ServiceName", "FrameAnalysis");
    }

    createLambda() {
        const frameAnalysis = new lambdaNodejs.NodejsFunction(this, "frame-analysis-lambda", {
            runtime: lambda.Runtime.NODEJS_20_X,
            architecture: Architecture.ARM_64,
            ephemeralStorageSize: Size.mebibytes(512),
            timeout: Duration.minutes(2),
            memorySize: 3008,
            environment: {
                COMMAND_BUS_ARN: this.props.commandBusStack.bus.eventBusArn,
                EVENT_BUS_BUS_ARN: this.props.eventBusStack.bus.eventBusArn,
            },
            entry: this.resolveService("src/index.ts"),
            depsLockFilePath: this.resolveService("package-lock.json"),
            projectRoot: this.resolveService(""),
            bundling: {
                volumes: [
                    {
                        // The common directory must be mounted, to be discoverable by npm inside the container.
                        hostPath: path.resolve(__dirname, "../../common"),
                        containerPath: "/common",
                    },
                ],
                forceDockerBundling: true,
                // Install these dependencies because:
                //  - tesseract requires a worker script in the package.
                //  - sharp has platform specific deps, that should be installed in docker.
                nodeModules: ["tesseract.js", "sharp"],
                commandHooks: {
                    beforeBundling: (inputDir: string, outputDir: string) => [
                        // Add the model weights, so they do not need to be downloaded on demand.
                        `cp -a ${inputDir}/bin/ ${outputDir}`,
                    ],
                    beforeInstall: (inputDir: string, outputDir: string) => [],
                    afterBundling: (inputDir: string, outputDir: string) => [],
                },
            },
        });

        const lambdaRole = frameAnalysis.role!;

        lambdaRole.attachInlinePolicy(
            s3ReadObjectsFromWholeBucketPolicy(this, `frame-analysis-lambda-read-bucket`, this.getBucketName()),
        );

        lambdaRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonTextractFullAccess"));
        addPutEventsPolicies(this, "frame-analysis", lambdaRole, this.props.eventBusStack.bus, this.props.commandBusStack.bus);

        // Invoke the lambda from the command bus.
        invokeLambdaOnEventDetail(this, `frame-analysis-command-rule`, this.props.commandBusStack.bus, frameAnalysis, [
            "StartAnalysisOfFrame",
        ]);
    }

    getBucketName(): string {
        return `tracking-poker-asset-ripper-assets-${this.props.deploymentEnvironment}`;
    }
}
