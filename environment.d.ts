declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DATABASE_URL: string;
            API_KEY: string;
        }
    }
}

export{};