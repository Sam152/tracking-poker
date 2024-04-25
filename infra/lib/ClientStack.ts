import { aws_s3_deployment, BundlingOptions, DockerImage, RemovalPolicy, Stack, Tags } from "aws-cdk-lib";
import { Construct } from "constructs";
import { DeploymentEnvironment } from "./utility/deployment-environment";
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
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { DefaultStackProps } from "../bin/infra";

export class ClientStack extends Stack {
    private props: DefaultStackProps;
    private readonly resolveService: (input: string) => string;
    private bucket: Bucket;

    constructor(scope: Construct, id: string, props: DefaultStackProps) {
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
                                spawnSync(`npm install && NEXT_PUBLIC_INVENTORY_API=https://${stack.props.apiDomain}/ npm run build`, {
                                    shell: true,
                                    cwd: stack.resolveService(""),
                                });
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
        new Distribution(this, `${this.getBucketName()}-distribution`, {
            domainNames: [this.props.clientDomain],
            certificate:
                this.props.deploymentEnvironment === DeploymentEnvironment.Prod
                    ? // A pre-created certificate for prod, since CDK does not support creating one in the right
                      // region: https://github.com/aws/aws-cdk/issues/9274
                      Certificate.fromCertificateArn(
                          this,
                          "tp-prod-cert",
                          "arn:aws:acm:us-east-1:851725576490:certificate/8ae21894-da44-4ad1-bd76-c992ea81422c",
                      )
                    : undefined,
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
