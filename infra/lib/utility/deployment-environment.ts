export enum DeploymentEnvironment {
    Prod = "prod",
    Staging = "staging",
}

export type DeploymentEnvironmentAware = {
    deploymentEnvironment: DeploymentEnvironment;
};
