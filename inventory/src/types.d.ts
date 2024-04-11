declare global {
    namespace NodeJS {
        interface ProcessEnv {
            TABLE_NAME: string;
        }
    }
}

export {};
