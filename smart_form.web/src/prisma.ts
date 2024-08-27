import { PrismaClient } from "@prisma/client"

//Set up the Prisma instance to ensure only one instance is created throughout the project.
 
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
 
export const prisma = globalForPrisma.prisma || new PrismaClient()
 
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma