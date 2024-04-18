import * as cdk from "aws-cdk-lib";
import { aws_s3_deployment, BundlingOptions, DockerImage, Stack, StackProps, Tags } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dynamo from "aws-cdk-lib/aws-dynamodb";
import { AttributeType, BillingMode, ProjectionType } from "aws-cdk-lib/aws-dynamodb";
import * as bs from "aws-cdk-lib/aws-elasticbeanstalk";
import { Attribute } from "aws-cdk-lib/aws-dynamodb/lib/shared";
import * as path from "path";
import { EventBusAware } from "./EventBusStack";
import { createProjectionHandlerLambda } from "./utility/projection";
import { DeploymentEnvironmentAware } from "./utility/deployment-environment";
import * as iam from "aws-cdk-lib/aws-iam";
import { ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { s3CreateSimpleBucket } from "./utility/s3";
import { spawnSync } from "child_process";
import * as fs from "fs";

type InventoryStackProps = StackProps & EventBusAware & DeploymentEnvironmentAware;

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

    createApiEndpoint() {
        const appName = "InventoryApi";

        const api = new bs.CfnApplication(this, "inventory-api", { applicationName: appName });

        const deploymentBucket = s3CreateSimpleBucket(
            this,
            `elasticbeanstalk-inventoryapi-assets-${this.props.deploymentEnvironment}`,
        );
        const stack = this;
        const source = new aws_s3_deployment.BucketDeployment(this, "inventory-api-bucket-deployment", {
            destinationBucket: deploymentBucket,
            extract: false,
            sources: [
                aws_s3_deployment.Source.asset(this.resolveService(""), {
                    bundling: {
                        image: DockerImage.fromRegistry("node:20"),
                        local: {
                            tryBundle(outputDir: string, options: BundlingOptions): boolean {
                                spawnSync(`npm install && npm run build-cdk`, { shell: true, cwd: stack.resolveService("") });
                                fs.copyFileSync(stack.resolveService("build/build.zip"), `${outputDir}/build.zip`);
                                return true;
                            },
                        },
                    },
                }),
            ],
        });

        const version = new bs.CfnApplicationVersion(this, "inventory-app-version", {
            applicationName: api.applicationName || appName,
            sourceBundle: {
                s3Bucket: deploymentBucket.bucketName,
                s3Key: cdk.Fn.select(0, source.objectKeys),
            },
        });
        version.addDependency(api);

        const instanceProfile = this.createEc2InstanceProfile();
        const environment = new bs.CfnEnvironment(this, "inventory-app-environment", {
            applicationName: api.applicationName || appName,
            cnamePrefix: `tracking-poker-api-${this.props.deploymentEnvironment}`,
            solutionStackName: "64bit Amazon Linux 2023 v6.1.2 running Node.js 20",
            versionLabel: version.ref,
            optionSettings: [
                {
                    namespace: "aws:autoscaling:launchconfiguration",
                    optionName: "IamInstanceProfile",
                    value: instanceProfile.instanceProfileName,
                },
                {
                    // Required for beanstalk to be able to reach any other AWS services inside the EC2 instance.
                    namespace: "aws:autoscaling:launchconfiguration",
                    optionName: "DisableIMDSv1",
                    value: "false",
                },
                {
                    namespace: "aws:elasticbeanstalk:xray",
                    optionName: "XRayEnabled",
                    value: "true",
                },
                {
                    namespace: "aws:elasticbeanstalk:application:environment",
                    optionName: "DYNAMO_TABLE_REGION",
                    value: this.region,
                },
                {
                    namespace: "aws:autoscaling:asg",
                    optionName: "MinSize",
                    value: "1",
                },
                {
                    namespace: "aws:autoscaling:asg",
                    optionName: "MaxSize",
                    value: "1",
                },
                {
                    namespace: "aws:ec2:instances",
                    optionName: "InstanceTypes",
                    value: "t2.micro",
                },
                {
                    namespace: "aws:elasticbeanstalk:application",
                    optionName: "Application Healthcheck URL",
                    value: "/healthz",
                },
            ],
        });
        environment.addDependency(instanceProfile);
    }

    createEc2InstanceProfile() {
        const role = new iam.Role(this, `inventory-app-instance-profile-role`, {
            assumedBy: new ServicePrincipal("ec2.amazonaws.com"),
        });
        role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName("AWSElasticBeanstalkWebTier"));
        role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonDynamoDBFullAccess"));

        return new iam.CfnInstanceProfile(this, `inventory-app-cfn-instance-profile`, {
            instanceProfileName: `inventory-app-cfn-instance-profile`,
            roles: [role.roleName],
        });
    }

    stringAttribute(value: string): Attribute {
        return {
            type: AttributeType.STRING,
            name: value,
        };
    }
}
