import type { PrismaClient } from '@prisma/client'

export type Agent = PrismaClient['agent']['fields']
export type Model = PrismaClient['model']['fields']
export type User = PrismaClient['user']['fields']
export type AgentStatus = PrismaClient['agent']['fields']['status'] 