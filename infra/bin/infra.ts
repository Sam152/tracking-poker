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
    apiDomain: string;
    domainZoneId: string;
    domainZoneName: string;
};
const envStackProps: { [key in DeploymentEnvironment]: DefaultStackProps } = {
    [DeploymentEnvironment.Staging]: {
        deploymentEnvironment: DeploymentEnvironment.Staging,
        clientDomain: "",
        apiDomain: "",
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
        apiDomain: "poker-api.sam152.com",
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
