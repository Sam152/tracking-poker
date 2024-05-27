const region = "ap-southeast-2";
const base = `https://${region}.console.aws.amazon.com`;

export const debugLinks = {
    logGroup: (logGroup: string, filterParam: string) =>
        `${base}/cloudwatch/home?region=${region}#logsV2:log-groups/log-group/${logGroup}/log-events$3FfilterPattern$3D$2522${filterParam}$2522$26start$3D-31104000000`,
    bucket: (bucketName: string, prefix: string) =>
        `${base}/s3/buckets/${bucketName}?region=${region}&bucketType=general&prefix=${prefix}`,
    lambdaTest: (lambda: string) => `${base}/lambda/home?region=${region}#/functions/${lambda}?tab=testing`,

    assetRipperLogs: (showId: string) =>
        debugLinks.logGroup("$252Faws$252Flambda$252FAssetRipperStack-assetripperlambda2C29A89F-2MzaI1K2mnlE", showId),
    assetRipperAssets: (showId: string) => debugLinks.bucket("tracking-poker-asset-ripper-assets-prod", `${showId}/`),

    frameAnalysis: (showId: string) =>
        debugLinks.logGroup("$252Faws$252Flambda$252FFrameAnalysisStack-frameanalysislambda9DEEB2CB-ilY4OGVRXPZL", showId),
    frameAnalysisAssets: (showId: string) => debugLinks.bucket("tracking-poker-frame-analysis-blocks-prod", `${showId}/`),

    pipelineLambda: () => debugLinks.lambdaTest("PipelineStack-pipelinelambdaA37730B9-QheTIKH2YNV5"),
    traceMap: () =>
        `${base}/cloudwatch/home?region=ap-southeast-2#xray:service-map/map?~(query~()~context~(timeRange~(delta~21600000)))`,
    costReport: () =>
        `${base}/costmanagement/home?region=us-east-1#/cost-explorer?reportId=41fe4dc4-d934-4ed3-be6d-d57045eb1e59&reportName=Last%207%20days&isDefault=false&chartStyle=STACK&historicalRelativeRange=LAST_7_DAYS&futureRelativeRange=CUSTOM&granularity=Daily&groupBy=%5B%22Service%22%5D&filter=%5B%5D&costAggregate=unBlendedCost&showOnlyUntagged=false&showOnlyUncategorized=false&useNormalizedUnits=false`,
};
