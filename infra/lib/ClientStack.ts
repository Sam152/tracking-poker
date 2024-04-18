import { aws_s3_deployment, BundlingOptions, DockerImage, RemovalPolicy, Stack, StackProps, Tags } from "aws-cdk-lib";
import { Construct } from "constructs";
import { DeploymentEnvironmentAware } from "./utility/deployment-environment";
import { Bucket, BucketEncryption } from "aws-cdk-lib/aws-s3";
import { spawnSync } from "child_process";
import * as path from "path";

type AssetRipperStackProps = StackProps & DeploymentEnvironmentAware;

export class ClientStack extends Stack {
    private props: AssetRipperStackProps;
    private readonly resolveService: (input: string) => string;

    constructor(scope: Construct, id: string, props: AssetRipperStackProps) {
        super(scope, id, props);
        this.props = props;

        this.resolveService = (input: string) => path.resolve(__dirname, "../../client", input);
        this.deployFrontEndToBucket();

        Tags.of(this).add("ServiceName", "Client");
    }

    deployFrontEndToBucket() {
        const bucket = new Bucket(this, this.getBucketName(), {
            versioned: false,
            bucketName: this.getBucketName(),
            encryption: BucketEncryption.KMS_MANAGED,
            removalPolicy: RemovalPolicy.DESTROY,
            publicReadAccess: true,
            websiteIndexDocument: "index.html",
            eventBridgeEnabled: false,
            cors: [],
        });

        const stack = this;
        new aws_s3_deployment.BucketDeployment(this, "client-bucket-deployment", {
            destinationBucket: bucket,
            extract: true,
            sources: [
                aws_s3_deployment.Source.asset(this.resolveService(""), {
                    bundling: {
                        image: DockerImage.fromRegistry("node:20"),
                        local: {
                            tryBundle(outputDir: string, options: BundlingOptions): boolean {
                                spawnSync(`npm install && npm run build`, {
                                    shell: true,
                                    cwd: stack.resolveService(""),
                                });
                                spawnSync(`mv out/* ${outputDir}`, {
                                    shell: true,
                                    cwd: stack.resolveService(""),
                                });
                                return true;
                            },
                        },
                    },
                }),
            ],
        });
    }

    getBucketName(): string {
        return `tracking-poker-client-${this.props.deploymentEnvironment}`;
    }
}
