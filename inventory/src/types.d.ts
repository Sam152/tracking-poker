declare global {
    namespace NodeJS {
        interface ProcessEnv {
            API_SERVER_PORT: string;
        }
    }
}

export {};
