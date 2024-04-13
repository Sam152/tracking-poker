import { Stack, StackProps, Tags } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dynamo from "aws-cdk-lib/aws-dynamodb";
import { AttributeType, BillingMode, ProjectionType } from "aws-cdk-lib/aws-dynamodb";
import { Attribute } from "aws-cdk-lib/aws-dynamodb/lib/shared";
import * as path from "path";
import { EventBusAware } from "./EventBusStack";
import { createProjectionHandlerLambda } from "./utility/projection";

type InventoryStackProps = StackProps & EventBusAware;

export class InventoryStack extends Stack {
    private props: InventoryStackProps;
    private readonly resolveService: (input: string) => string;

    constructor(scope: Construct, id: string, props: InventoryStackProps) {
        super(scope, id, props);
        this.props = props;

        this.resolveService = (input: string) => path.resolve(__dirname, "../../inventory", input);

        this.createDynamoTable();
        this.createProjectionHandlerLambda();

        Tags.of(this).add("ServiceName", "Inventory");
    }

    createProjectionHandlerLambda() {
        createProjectionHandlerLambda(
            this,
            "inventory",
            this.resolveService("src/projection/index.ts"),
            this.resolveService("package-lock.json"),
            this.resolveService(""),
            this.props.eventBusStack.bus,
        );
    }

    createDynamoTable() {
        const table = new dynamo.Table(this, `inventory`, {
            tableName: "inventory",
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
}
