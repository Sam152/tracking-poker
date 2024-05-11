import { Construct } from "constructs";
import { BlockPublicAccess, Bucket, BucketEncryption } from "aws-cdk-lib/aws-s3";
import { RemovalPolicy } from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";

type SimpleBucketProps = {
    bucketName: string;
};

export class SimpleBucket extends Construct {
    public bucket: Bucket;
    constructor(scope: Construct, id: string, props: SimpleBucketProps) {
        super(scope, id);
        this.bucket = new Bucket(this, `bucket`, {
            versioned: false,
            bucketName: props.bucketName,
            encryption: BucketEncryption.KMS_MANAGED,
            bucketKeyEnabled: true,
            publicReadAccess: false,
            blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
            removalPolicy: RemovalPolicy.DESTROY,
            eventBridgeEnabled: false,
            cors: [],
        });
    }

    public getWritePolicy(): iam.Policy {
        return new iam.Policy(this, "bucket-write-policy", {
            policyName: `${this.bucket.bucketName}-write-policy`,
            document: new iam.PolicyDocument({
                statements: [
                    new iam.PolicyStatement({
                        effect: iam.Effect.ALLOW,
                        actions: ["s3:PutObject"],
                        resources: [`arn:aws:s3:::${this.bucket.bucketName}/*`],
                    }),
                ],
            }),
        });
    }

    public getReadPolicy(): iam.Policy {
        return new iam.Policy(this, "bucket-read-policy", {
            policyName: `${this.bucket.bucketName}-read-policy`,
            document: new iam.PolicyDocument({
                statements: [
                    new iam.PolicyStatement({
                        effect: iam.Effect.ALLOW,
                        actions: ["s3:GetObject"],
                        resources: [`arn:aws:s3:::${this.bucket.bucketName}/*`],
                    }),
                ],
            }),
        });
    }
}
