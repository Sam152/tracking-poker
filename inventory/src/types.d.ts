declare global {
    namespace NodeJS {
        interface ProcessEnv {
            API_SERVER_PORT: string;
            DYNAMO_TABLE_REGION: string | undefined;
        }
    }
}

export {};
