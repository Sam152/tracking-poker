declare global {
    namespace NodeJS {
        interface ProcessEnv {
            BUCKET_NAME: string;
        }
    }
}

export {};
