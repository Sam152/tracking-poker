#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { StackProps } from "aws-cdk-lib";
import { DeploymentEnvironment } from "../lib/utility/deployment-environment";
import { AssetRipperStack } from "../lib/AssetRipperStack";
import { CommandBusStack } from "../lib/CommandBusStack";
import { FrameAnalysisStack } from "../lib/FrameAnalysisStack";
import { InventoryStack } from "../lib/InventoryStack";
import { EventBusStack } from "../lib/EventBusStack";
import { PipelineStack } from "../lib/PipelineStack";
import { IngestStack } from "../lib/IngestStack";
import { ClientStack } from "../lib/ClientStack";

const app = new cdk.App();

const env: DeploymentEnvironment = app.node.tryGetContext("env") ?? DeploymentEnvironment.Prod;

export type DefaultStackProps = StackProps & {
    deploymentEnvironment: DeploymentEnvironment;
    clientDomain: string;
    clientDomainCertArn: string;
    apiDomainCertArn: string;
    apiDomain: string;
    domainZoneId: string;
    domainZoneName: string;
    env: {
        account: string;
        region: string;
    };
};
const envStackProps: { [key in DeploymentEnvironment]: DefaultStackProps } = {
    [DeploymentEnvironment.Staging]: {
        deploymentEnvironment: DeploymentEnvironment.Staging,
        clientDomain: "",
        clientDomainCertArn: "",
        apiDomain: "",
        apiDomainCertArn: "",
        domainZoneId: "",
        domainZoneName: "",
        env: {
            account: "390772177583",
            region: "us-east-2",
        },
    },
    [DeploymentEnvironment.Prod]: {
        deploymentEnvironment: DeploymentEnvironment.Prod,
        clientDomain: "poker.sam152.com",
        // Click-ops ARN, because this cert must be in us-east-1.
        clientDomainCertArn: "arn:aws:acm:us-east-1:851725576490:certificate/8ae21894-da44-4ad1-bd76-c992ea81422c",
        apiDomain: "poker-api.sam152.com",
        apiDomainCertArn: "arn:aws:acm:us-east-1:851725576490:certificate/6eaca751-a39d-4be6-9cb6-fa5a953ab0c9",
        domainZoneId: "Z057246516CAPUIS5POOU",
        domainZoneName: "sam152.com",
        env: {
            account: "851725576490",
            region: "ap-southeast-2",
        },
    },
} as const;

const commandBusStack = new CommandBusStack(app, "CommandBusStack", envStackProps[env]);
const eventBusStack = new EventBusStack(app, "EventBusStack", envStackProps[env]);

new PipelineStack(app, "PipelineStack", {
    ...envStackProps[env],
    commandBusStack,
});
new IngestStack(app, "IngestStack", {
    ...envStackProps[env],
    commandBusStack,
    eventBusStack,
});
new AssetRipperStack(app, "AssetRipperStack", {
    ...envStackProps[env],
    commandBusStack,
    eventBusStack,
});
new FrameAnalysisStack(app, "FrameAnalysisStack", {
    ...envStackProps[env],
    commandBusStack,
    eventBusStack,
});
new InventoryStack(app, "InventoryStack", {
    ...envStackProps[env],
    eventBusStack,
});
new ClientStack(app, "ClientStack", {
    ...envStackProps[env],
});
