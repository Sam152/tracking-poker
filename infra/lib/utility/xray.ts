import * as iam from "aws-cdk-lib/aws-iam";
import { Function } from "aws-cdk-lib/aws-lambda/lib/function";

export function allowTraces(lambda: Function) {
    lambda.role?.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName("AWSXRayDaemonWriteAccess"));
}
