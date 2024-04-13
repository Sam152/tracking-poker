import { Attribute } from "aws-cdk-lib/aws-dynamodb/lib/shared";
import { AttributeType } from "aws-cdk-lib/aws-dynamodb";

export function stringAttribute(value: string): Attribute {
    return {
        type: AttributeType.STRING,
        name: value,
    };
}
