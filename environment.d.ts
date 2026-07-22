declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DATABASE_URL: string;
            API_KEY: string;
            TEST_EMAIL: string;
            TEST_PASS: string;
        }
    }
}

export{};