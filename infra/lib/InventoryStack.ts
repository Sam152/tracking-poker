import { CfnOutput, Stack, Tags } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dynamo from "aws-cdk-lib/aws-dynamodb";
import { AttributeType, BillingMode, ProjectionType } from "aws-cdk-lib/aws-dynamodb";
import { Attribute } from "aws-cdk-lib/aws-dynamodb/lib/shared";
import * as path from "path";
import { EventBusAware } from "./EventBusStack";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import {
    AmazonLinux2023ImageSsmParameter,
    InstanceClass,
    InstanceSize,
    InstanceType,
    KeyPair,
    Peer,
    Port,
    SecurityGroup,
    SubnetType,
    UserData,
    Vpc,
} from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ecs_patterns from "aws-cdk-lib/aws-ecs-patterns";
import { DockerImageAsset, Platform } from "aws-cdk-lib/aws-ecr-assets";
import { ApplicationProtocol } from "aws-cdk-lib/aws-elasticloadbalancingv2";
import { HostedZone } from "aws-cdk-lib/aws-route53";
import { Certificate, CertificateValidation } from "aws-cdk-lib/aws-certificatemanager";
import { ManagedPolicy, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { DefaultStackProps } from "../bin/infra";
import { Distribution, OriginProtocolPolicy, ViewerProtocolPolicy } from "aws-cdk-lib/aws-cloudfront";
import { HttpOrigin } from "aws-cdk-lib/aws-cloudfront-origins";
import { ProjectionHandler } from "./construct/ProjectionHandler";

type InventoryStackProps = DefaultStackProps & EventBusAware;

export class InventoryStack extends Stack {
    private props: InventoryStackProps;
    private readonly resolveService: (input: string) => string;
    private image: DockerImageAsset;

    constructor(scope: Construct, id: string, props: InventoryStackProps) {
        super(scope, id, props);
        this.props = props;

        this.resolveService = (input: string) => path.resolve(__dirname, "../../inventory", input);

        this.createDynamoTable();
        this.createProjectionHandlerLambda();
        this.createInventoryAppImage();
        // this.createInventoryApiOnEcs();
        this.createInventoryApiOnEc2();

        Tags.of(this).add("ServiceName", "Inventory");
    }

    createInventoryAppImage() {
        this.image = new DockerImageAsset(this, "inventory-image", {
            directory: path.resolve(__dirname, "../../"),
            file: "inventory/Dockerfile",
            platform: Platform.LINUX_AMD64,
        });
    }

    createInventoryApiOnEc2() {
        const vpc = Vpc.fromLookup(this, "default-vpc", { isDefault: true });
        const securityGroup = new SecurityGroup(this, "inventory-security-group", {
            vpc: vpc,
        });
        securityGroup.addIngressRule(Peer.anyIpv4(), Port.allTraffic());
        securityGroup.addEgressRule(Peer.anyIpv4(), Port.allTraffic());

        const instanceRole = new Role(this, "inventory-instance-role", {
            assumedBy: new ServicePrincipal("ec2.amazonaws.com"),
        });
        instanceRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName("AmazonDynamoDBFullAccess"));
        instanceRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName("AmazonEC2ContainerRegistryReadOnly"));

        const instance = new ec2.Instance(this, "inventory-instance", {
            keyPair: KeyPair.fromKeyPairName(this, "tp-prod-keypair", this.props.apiKeypairName),
            instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.NANO),
            vpc: vpc,
            machineImage: new AmazonLinux2023ImageSsmParameter(),
            securityGroup: securityGroup,
            vpcSubnets: {
                subnetType: SubnetType.PUBLIC,
            },
            userData: this.buildInstanceUserData(),
            role: instanceRole,
            blockDevices: [
                {
                    deviceName: "/dev/xvda",
                    volume: ec2.BlockDeviceVolume.ebs(8),
                },
            ],
        });

        new Distribution(this, `inventory-api-distribution`, {
            domainNames: [this.props.apiDomain],
            certificate: Certificate.fromCertificateArn(this, "tp-api-cert", this.props.apiDomainCertArn),
            defaultBehavior: {
                origin: new HttpOrigin(instance.instancePublicDnsName, {
                    protocolPolicy: OriginProtocolPolicy.HTTP_ONLY,
                }),
                viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            },
        });

        new CfnOutput(this, "inventory-kick-script", {
            value: `ssh -i ~/.ssh/tp-prod.pem ec2-user@${instance.instancePublicDnsName} sudo /var/lib/cloud/instance/scripts/part-001`,
        });
    }

    /**
     * Create a script to run on start-up to launch the service.
     */
    buildInstanceUserData(): UserData {
        const data = ec2.UserData.forLinux();
        data.addCommands(
            `yum install -y docker`,
            `systemctl start docker`,
            `aws ecr get-login-password --region ${this.props.env.region} | docker login --username AWS --password-stdin ${this.props.env.account}.dkr.ecr.${this.props.env.region}.amazonaws.com`,
            `docker system prune -a -f`,
            `docker pull ${this.image.imageUri}`,
            `docker container run -d -e DYNAMO_TABLE_REGION='ap-southeast-2' --publish 80:80 ${this.image.imageUri}`,
        );
        return data;
    }

    /**
     * ECS is useful, but creates a lot of costly resources (notably NAT gateways) in order
     * to expose tasks to the public internet. Using this construct seems overkill when we'd
     * like to stand up a single nano sized EC2 instance.
     */
    createInventoryApiOnEcs() {
        const vpc = new ec2.Vpc(this, "tp-ecs-vpc", {
            maxAzs: 2,
            natGateways: 1,
        });
        const cluster = new ecs.Cluster(this, "tp-ecs-cluster", {
            vpc: vpc,
        });
        cluster.addCapacity("cluster-capacity", {
            instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.NANO),
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
                image: ecs.ContainerImage.fromDockerImageAsset(this.image),
                environment: {
                    AWS_REGION: this.props.env.region,
                    DYNAMO_TABLE_REGION: this.props.env.region,
                },
            },
            cpu: 256,
            memoryLimitMiB: 128,
            publicLoadBalancer: true,

            // Remove existing deployments before adding new ones, to allow keeping lowest resources possible
            // on the EC2 instances.
            minHealthyPercent: 0,
            maxHealthyPercent: 100,
        });
        service.taskDefinition.taskRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName("AmazonDynamoDBFullAccess"));
    }

    createProjectionHandlerLambda() {
        new ProjectionHandler(this, "inventory-projection-handler", {
            projectRoot: this.resolveService(""),
            entry: this.resolveService("src/projection/index.ts"),
            depsLockFilePath: this.resolveService("package-lock.json"),
            eventBus: this.props.eventBusStack.bus,
        });
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
