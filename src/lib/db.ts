import { PrismaClient } from '@prisma/client'

const PrismaClientSingleton = () => {
  return new PrismaClient()
}

declare global {
  /* eslint no-var: */
  var prisma: undefined | ReturnType<typeof PrismaClientSingleton>
}

const db = globalThis.prisma ?? PrismaClientSingleton()

export default db

if (process.env.NODE_ENV !== 'production') globalThis.prisma = db
