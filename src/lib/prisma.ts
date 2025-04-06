import { PrismaClient } from '@prisma/client'

// Create a new PrismaClient instance
const prismaClient = new PrismaClient()

// Export the PrismaClient instance
export const prisma = prismaClient 