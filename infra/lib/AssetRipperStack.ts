import { Stack, StackProps, Tags } from "aws-cdk-lib";
import { Construct } from "constructs";
import { DockerImageCode, DockerImageFunction, Tracing } from "aws-cdk-lib/aws-lambda";
import { Platform } from "aws-cdk-lib/aws-ecr-assets";
import * as path from "path";
import { Duration, Size } from "aws-cdk-lib/core";
import { s3CreateSimpleBucket, s3WriteObjectsToWholeBucketPolicy } from "./utility/s3";
import { DeploymentEnvironmentAware } from "./utility/deployment-environment";
import { CommandBusAware } from "./CommandBusStack";
import { addPutEventsPolicies, invokeLambdaOnEventDetail } from "./utility/eventBridge";
import { EventBusAware } from "./EventBusStack";
import { allowTraces } from "./utility/xray";

type AssetRipperStackProps = StackProps & DeploymentEnvironmentAware & CommandBusAware & EventBusAware;

export class AssetRipperStack extends Stack {
    private props: AssetRipperStackProps;

    constructor(scope: Construct, id: string, props: AssetRipperStackProps) {
        super(scope, id, props);
        this.props = props;

        this.createLambda();
        s3CreateSimpleBucket(this, this.getBucketName());

        Tags.of(this).add("ServiceName", "AssetRipper");
    }

    createLambda() {
        // Create a lambda from a custom docker container, because it needs to ship with
        // youtube-dl and ffmpeg.
        const lambda = new DockerImageFunction(this, "asset-ripper-lambda", {
            ephemeralStorageSize: Size.mebibytes(10240),
            timeout: Duration.minutes(15),
            memorySize: 3008,
            tracing: Tracing.ACTIVE,
            environment: {
                BUCKET_NAME: this.getBucketName(),
                COMMAND_BUS_ARN: this.props.commandBusStack.bus.eventBusArn,
                EVENT_BUS_BUS_ARN: this.props.eventBusStack.bus.eventBusArn,
            },
            code: DockerImageCode.fromImageAsset(path.join(__dirname, "../../"), {
                file: "asset-ripper/Dockerfile",
                cmd: ["index.handler"],
                entrypoint: ["/lambda-entrypoint.sh"],
                platform: Platform.LINUX_AMD64,
            }),
        });
        allowTraces(lambda);

        const lambdaRole = lambda.role!;

        // Allow the lambda to write to S3.
        lambdaRole.attachInlinePolicy(
            s3WriteObjectsToWholeBucketPolicy(this, `asset-ripper-lambda-write-bucket`, this.getBucketName()),
        );

        // Allow the lambda to push events to the buses.
        addPutEventsPolicies(this, "asset-ripper", lambdaRole, this.props.eventBusStack.bus, this.props.commandBusStack.bus);

        // Invoke the lambda from the command bus.
        invokeLambdaOnEventDetail(this, `asset-ripper-command-rule`, this.props.commandBusStack.bus, lambda, [
            "StartAssetRipByVideoId",
            "StartAssetRipByVideoUrl",
        ]);
    }

    getBucketName(): string {
        return `tracking-poker-asset-ripper-assets-${this.props.deploymentEnvironment}`;
    }
}
