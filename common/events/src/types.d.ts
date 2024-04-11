declare global {
    namespace NodeJS {
        interface ProcessEnv {
            COMMAND_BUS_ARN: string;
            EVENT_BUS_BUS_ARN: string;
        }
    }
}

export {};
