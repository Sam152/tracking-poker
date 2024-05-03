import { Stack, Tags } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dynamo from "aws-cdk-lib/aws-dynamodb";
import { AttributeType, BillingMode, ProjectionType } from "aws-cdk-lib/aws-dynamodb";
import { Attribute } from "aws-cdk-lib/aws-dynamodb/lib/shared";
import * as path from "path";
import { EventBusAware } from "./EventBusStack";
import { createProjectionHandlerLambda } from "./utility/projection";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { InstanceClass, InstanceSize, InstanceType } from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ecs_patterns from "aws-cdk-lib/aws-ecs-patterns";
import { DockerImageAsset, Platform } from "aws-cdk-lib/aws-ecr-assets";
import { ApplicationProtocol } from "aws-cdk-lib/aws-elasticloadbalancingv2";
import { HostedZone } from "aws-cdk-lib/aws-route53";
import { Certificate, CertificateValidation } from "aws-cdk-lib/aws-certificatemanager";
import { ManagedPolicy } from "aws-cdk-lib/aws-iam";
import { DefaultStackProps } from "../bin/infra";

type InventoryStackProps = DefaultStackProps & EventBusAware;

export class InventoryStack extends Stack {
    private props: InventoryStackProps;
    private readonly resolveService: (input: string) => string;

    constructor(scope: Construct, id: string, props: InventoryStackProps) {
        super(scope, id, props);
        this.props = props;

        this.resolveService = (input: string) => path.resolve(__dirname, "../../inventory", input);

        this.createDynamoTable();
        this.createProjectionHandlerLambda();
        this.createApiEndpoint();

        Tags.of(this).add("ServiceName", "Inventory");
    }

    createApiEndpoint() {
        const vpc = new ec2.Vpc(this, "MyVpc", {
            maxAzs: 3,
        });
        const cluster = new ecs.Cluster(this, "MyCluster", {
            vpc: vpc,
        });
        cluster.addCapacity("cluster-capacity", {
            instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.MICRO),
        });

        const image = new DockerImageAsset(this, "inventory-image", {
            directory: path.resolve(__dirname, "../../"),
            file: "inventory/Dockerfile",
            platform: Platform.LINUX_AMD64,
        });
        const zone = HostedZone.fromHostedZoneAttributes(this, "tp-zone", {
            hostedZoneId: this.props.domainZoneId,
            zoneName: this.props.domainZoneName,
        });
        const service = new ecs_patterns.ApplicationLoadBalancedEc2Service(this, "inventory-api-service", {
            cluster: cluster,
            desiredCount: 1,
            protocol: ApplicationProtocol.HTTPS,
            domainName: this.props.apiDomain,
            domainZone: zone,
            // A pre-created certificate for prod, since CDK does not support creating one in a region not matching
            // the region of a given stack: https://github.com/aws/aws-cdk/issues/9274
            certificate: new Certificate(this, "inventory-api-service-cert", {
                domainName: this.props.apiDomain,
                validation: CertificateValidation.fromDns(zone),
            }),
            taskImageOptions: {
                image: ecs.ContainerImage.fromDockerImageAsset(image),
                environment: {
                    AWS_REGION: this.props.env?.region || "ap-southeast-2",
                    DYNAMO_TABLE_REGION: this.props.env?.region || "ap-southeast-2",
                },
            },
            cpu: 256,
            memoryLimitMiB: 500,
            publicLoadBalancer: true,
        });
        service.taskDefinition.taskRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName("AmazonDynamoDBFullAccess"));
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
