import { aws_s3_deployment, BundlingOptions, DockerImage, RemovalPolicy, Stack, StackProps, Tags } from "aws-cdk-lib";
import { Construct } from "constructs";
import { DeploymentEnvironmentAware } from "./utility/deployment-environment";
import { Bucket, BucketEncryption, ObjectOwnership } from "aws-cdk-lib/aws-s3";
import { spawnSync } from "child_process";
import * as path from "path";
import {
    CachePolicy,
    CacheQueryStringBehavior,
    Distribution,
    ResponseHeadersPolicy,
    ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront";
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import { Duration } from "aws-cdk-lib/core";

type ClientStackProps = StackProps & DeploymentEnvironmentAware;

export class ClientStack extends Stack {
    private props: ClientStackProps;
    private readonly resolveService: (input: string) => string;
    private bucket: Bucket;

    constructor(scope: Construct, id: string, props: ClientStackProps) {
        super(scope, id, props);
        this.props = props;

        this.resolveService = (input: string) => path.resolve(__dirname, "../../client", input);
        this.bucket = this.deployFrontEndToBucket();
        this.addCloudfrontDistribution();

        Tags.of(this).add("ServiceName", "Client");
    }

    deployFrontEndToBucket() {
        const bucket = new Bucket(this, this.getBucketName(), {
            versioned: false,
            bucketName: this.getBucketName(),
            encryption: BucketEncryption.S3_MANAGED,
            removalPolicy: RemovalPolicy.DESTROY,
            // This can be switched off, in cases where we only want access via the CF distribution, by configuring
            // an additional access relationship between CF and S3, however this also works fine.
            publicReadAccess: true,
            objectOwnership: ObjectOwnership.OBJECT_WRITER,
            blockPublicAccess: {
                blockPublicAcls: false,
                blockPublicPolicy: false,
                ignorePublicAcls: false,
                restrictPublicBuckets: false,
            },
            websiteIndexDocument: "index.html",
            websiteErrorDocument: "404.html",
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
                                spawnSync(`npm install && npm run build`, { shell: true, cwd: stack.resolveService("") });
                                spawnSync(`mv out/* ${outputDir} && rm -rf out`, { shell: true, cwd: stack.resolveService("") });
                                return true;
                            },
                        },
                    },
                }),
            ],
        });
        return bucket;
    }

    addCloudfrontDistribution() {
        const distribution = new Distribution(this, `${this.getBucketName()}-distribution`, {
            defaultBehavior: {
                origin: new S3Origin(this.bucket),
                viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                responseHeadersPolicy: new ResponseHeadersPolicy(this, `${this.getBucketName()}-response-header-policy`, {
                    customHeadersBehavior: {
                        customHeaders: [
                            {
                                header: "Cache-Control",
                                override: false,
                                value: "max-age=60",
                            },
                        ],
                    },
                }),
                cachePolicy: new CachePolicy(this, `${this.getBucketName()}-cache-policy`, {
                    maxTtl: Duration.minutes(1),
                    defaultTtl: Duration.minutes(1),
                    queryStringBehavior: CacheQueryStringBehavior.all(),
                }),
            },
            errorResponses: [
                {
                    // Required, because dynamic routes will come back from S3 as a 404, we then use the 404 document
                    // to internally route to the correct place.
                    httpStatus: 404,
                    responseHttpStatus: 200,
                    responsePagePath: "/404.html",
                },
            ],
            // In the future, add additional behaviour that caches hashed assets for longer.
            additionalBehaviors: {},
        });
    }

    getBucketName(): string {
        return `tracking-poker-client-${this.props.deploymentEnvironment}`;
    }
}
