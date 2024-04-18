#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
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

// Identify the environment for each stack, for services that cannot have duplicate names across
// accounts (ie, s3 buckets).
const defaultStackProps = {
    deploymentEnvironment: app.node.tryGetContext("deploymentEnvironment") ?? DeploymentEnvironment.Staging,
    env: { account: "390772177583", region: "us-east-2" },
};

const commandBusStack = new CommandBusStack(app, "CommandBusStack", defaultStackProps);
const eventBusStack = new EventBusStack(app, "EventBusStack", defaultStackProps);

new PipelineStack(app, "PipelineStack", {
    ...defaultStackProps,
    commandBusStack,
});
new IngestStack(app, "IngestStack", {
    ...defaultStackProps,
    commandBusStack,
    eventBusStack,
});
new AssetRipperStack(app, "AssetRipperStack", {
    ...defaultStackProps,
    commandBusStack,
    eventBusStack,
});
new FrameAnalysisStack(app, "FrameAnalysisStack", {
    ...defaultStackProps,
    commandBusStack,
    eventBusStack,
});
new InventoryStack(app, "InventoryStack", {
    ...defaultStackProps,
    eventBusStack,
});
new ClientStack(app, "ClientStack", {
    ...defaultStackProps,
});
