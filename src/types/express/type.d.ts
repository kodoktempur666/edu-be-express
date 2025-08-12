export {}

declare global {
    namespace Express {
        export interface Request {
            id?: string
            cleanBody?: any
            role: string
            bank: string
            bankAccountNumber: string
            teacherType: string
        }
    }
}