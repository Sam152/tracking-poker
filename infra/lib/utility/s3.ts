import * as iam from "aws-cdk-lib/aws-iam";
import { RemovalPolicy, Stack } from "aws-cdk-lib";
import {
    BlockPublicAccess,
    Bucket,
    BucketEncryption,
} from "aws-cdk-lib/aws-s3";

export function s3WriteObjectsToWholeBucketPolicy(
    stack: Stack,
    name: string,
    bucketName: string,
): iam.Policy {
    return new iam.Policy(stack, name, {
        policyName: name,
        document: new iam.PolicyDocument({
            statements: [
                new iam.PolicyStatement({
                    effect: iam.Effect.ALLOW,
                    actions: ["s3:PutObject"],
                    resources: [`arn:aws:s3:::${bucketName}/*`],
                }),
            ],
        }),
    });
}

export function s3ReadObjectsFromWholeBucketPolicy(
    stack: Stack,
    name: string,
    bucketName: string,
): iam.Policy {
    return new iam.Policy(stack, name, {
        policyName: name,
        document: new iam.PolicyDocument({
            statements: [
                new iam.PolicyStatement({
                    effect: iam.Effect.ALLOW,
                    actions: ["s3:GetObject"],
                    resources: [`arn:aws:s3:::${bucketName}/*`],
                }),
            ],
        }),
    });
}

export function s3CreateSimpleBucket(stack: Stack, name: string): Bucket {
    return new Bucket(stack, name, {
        versioned: false,
        bucketName: name,
        encryption: BucketEncryption.KMS_MANAGED,
        publicReadAccess: false,
        blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
        removalPolicy: RemovalPolicy.DESTROY,
        eventBridgeEnabled: true,
        cors: [],
    });
}
