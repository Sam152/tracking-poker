#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import {DeploymentEnvironment} from "../lib/utility/deployment-environment";
import {AssetRipperStack} from "../lib/AssetRipperStack";
import {CommandBusStack} from "../lib/CommandBusStack";
import {FrameAnalysisStack} from "../lib/FrameAnalysisStack";

const app = new cdk.App();

// Identify the environment for each stack, for services that cannot have duplicate names across
// accounts (ie, s3 buckets).
const defaultStackProps = {
    deploymentEnvironment: app.node.tryGetContext('deploymentEnvironment') ?? DeploymentEnvironment.Staging,
    env: {account: "390772177583", region: "us-east-2"},
};

// Create stacks for each service.
const commandBusStack = new CommandBusStack(app, 'CommandBusStack', defaultStackProps);
new AssetRipperStack(app, 'AssetRipperStack', {...defaultStackProps, commandBusStack});
new FrameAnalysisStack(app, 'FrameAnalysisStack', {...defaultStackProps, commandBusStack});
