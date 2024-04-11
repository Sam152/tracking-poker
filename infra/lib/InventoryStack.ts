import { Stack, StackProps, Tags } from "aws-cdk-lib";
import { Construct } from "constructs";
import { CommandBusAware } from "./CommandBusStack";
import * as dynamo from "aws-cdk-lib/aws-dynamodb";
import { AttributeType, BillingMode, ProjectionType } from "aws-cdk-lib/aws-dynamodb";
import { DeploymentEnvironmentAware } from "./utility/deployment-environment";
import { Attribute } from "aws-cdk-lib/aws-dynamodb/lib/shared";

type InventoryStackProps = StackProps & DeploymentEnvironmentAware & CommandBusAware;

export class InventoryStack extends Stack {
    private props: InventoryStackProps;

    constructor(scope: Construct, id: string, props: InventoryStackProps) {
        super(scope, id, props);
        this.props = props;

        this.createDynamoTable();

        Tags.of(this).add("ServiceName", "Inventory");
    }

    createDynamoTable() {
        const table = new dynamo.Table(this, `tracking-poker-inventory-${this.props.deploymentEnvironment}`, {
            tableName: this.tableName(),
            partitionKey: this.stringAttribute("pk"),
            sortKey: this.stringAttribute("sk"),
            billingMode: BillingMode.PAY_PER_REQUEST,
        });

        table.addGlobalSecondaryIndex({
            indexName: "gsi1",
            projectionType: ProjectionType.ALL,
            partitionKey: this.stringAttribute("gsi1pk"),
            sortKey: this.stringAttribute("gsi1sk"),
        });

        table.addGlobalSecondaryIndex({
            indexName: "gsi2",
            projectionType: ProjectionType.ALL,
            partitionKey: this.stringAttribute("gsi2pk"),
            sortKey: this.stringAttribute("gsi2sk"),
        });
    }

    stringAttribute(value: string): Attribute {
        return {
            type: AttributeType.STRING,
            name: value,
        };
    }

    tableName(): string {
        return `tracking-poker-inventory-${this.props.deploymentEnvironment}`;
    }
}
