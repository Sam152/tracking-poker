
export enum DeploymentEnvironment {
    Production = "production",
    Staging = "staging",
}

export type DeploymentEnvironmentAware ={
    deploymentEnvironment: DeploymentEnvironment;
}
