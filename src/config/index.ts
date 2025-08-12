

const config = {
    env: {
        databaseUrl: process.env.DATABASE_URL || '',
        jwtPrivateSecret: process.env.JWT_PRIVATE_SECRET || '',
        jwtPublicSecret: process.env.JWT_PUBLIC_SECRET || ''
    }
}

export default config;