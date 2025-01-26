import { PrismaClient } from '@prisma/client'

const PrismaClientSingleton = () => {
  return new PrismaClient()
}

declare const globalThis: {
  prisma: ReturnType<typeof PrismaClientSingleton>
} & typeof global

const db = globalThis.prisma ?? PrismaClientSingleton()

export default db

if (process.env.NODE_ENV !== 'production') globalThis.prisma = db
