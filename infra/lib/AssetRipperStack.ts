import { Stack, Tags } from "aws-cdk-lib";
import { Construct } from "constructs";
import { DockerImageCode, DockerImageFunction, Tracing } from "aws-cdk-lib/aws-lambda";
import { Platform } from "aws-cdk-lib/aws-ecr-assets";
import * as path from "path";
import { Duration, Size } from "aws-cdk-lib/core";
import { CommandBusAware } from "./CommandBusStack";
import { addPutEventsPolicies, invokeLambdaOnEventDetail } from "./utility/eventBridge";
import { EventBusAware } from "./EventBusStack";
import { allowTraces } from "./utility/xray";
import { DefaultStackProps } from "../bin/infra";
import { SimpleBucket } from "./construct/SimpleBucket";

type AssetRipperStackProps = DefaultStackProps & CommandBusAware & EventBusAware;

export class AssetRipperStack extends Stack {
    private props: AssetRipperStackProps;
    private bucket: SimpleBucket;

    constructor(scope: Construct, id: string, props: AssetRipperStackProps) {
        super(scope, id, props);
        this.props = props;

        this.bucket = new SimpleBucket(this, `tp-asset-ripper-bucket`, {
            bucketName: `tracking-poker-asset-ripper-assets-${this.props.deploymentEnvironment}`,
        });
        this.createLambda();

        Tags.of(this).add("ServiceName", "AssetRipper");
    }

    createLambda() {
        // Create a lambda from a custom docker container, because it needs to ship with
        // youtube-dl and ffmpeg.
        const lambda = new DockerImageFunction(this, "asset-ripper-lambda", {
            ephemeralStorageSize: Size.mebibytes(10240),
            timeout: Duration.minutes(15),
            memorySize: 10_000,
            tracing: Tracing.ACTIVE,
            environment: {
                BUCKET_NAME: this.bucket.bucket.bucketName,
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
        lambdaRole.attachInlinePolicy(this.bucket.getWritePolicy());
        lambdaRole.attachInlinePolicy(this.bucket.getReadPolicy());

        // Allow the lambda to push events to the buses.
        addPutEventsPolicies(this, "asset-ripper", lambdaRole, this.props.eventBusStack.bus, this.props.commandBusStack.bus);

        // Invoke the lambda from the command bus.
        invokeLambdaOnEventDetail(this, `asset-ripper-command-rule`, this.props.commandBusStack.bus, lambda, [
            "StartAssetRipByVideoId",
            "StartAssetRipByVideoUrl",
        ]);
    }
}
