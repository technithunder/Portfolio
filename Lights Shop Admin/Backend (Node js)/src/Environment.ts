export class Environment {
    public static isDev(): boolean {
        return Environment.getStage() === 'development'
    }
    public static isProd(): boolean {
        return Environment.getStage() === 'prod'
    }

    public static getStage(): string {
        return process.env.STAGE || 'development'
    }

    public static getPort(): number {
        return (process.env.PORT as any) || 4000
    }
}
