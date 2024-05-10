declare global {
    namespace NodeJS {
        interface ProcessEnv {
            ANALYSIS_BLOCKS_BUCKET_NAME: string;
        }
    }
}

export {};
