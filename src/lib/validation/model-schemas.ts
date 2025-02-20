import { z } from 'zod'

// Supported model categories
export const ModelCategories = [
  'general',
  'chat',
  'completion',
  'embedding',
  'function',
  'image',
  'audio',
  'video',
  'multimodal',
] as const

// API Input/Output parameter schema
export const ApiParameterSchema = z.object({
  type: z.enum(['string', 'number', 'boolean', 'object', 'array']),
  description: z.string().optional(),
  required: z.boolean().optional().default(false),
  format: z.string().optional(),
  enum: z.array(z.string()).optional(),
  items: z.lazy(() => ApiParameterSchema).optional(), // For array types
  properties: z.record(z.lazy(() => ApiParameterSchema)).optional(), // For object types
}).strict()

// API Specification schema
export const ApiSpecSchema = z.object({
  input: z.object({
    type: z.enum(['string', 'number', 'boolean', 'object', 'array']),
    description: z.string().optional(),
    parameters: z.record(ApiParameterSchema).optional(),
  }).strict(),
  output: z.object({
    type: z.enum(['string', 'number', 'boolean', 'object', 'array']),
    description: z.string().optional(),
    parameters: z.record(ApiParameterSchema).optional(),
  }).strict(),
  examples: z.array(z.object({
    input: z.unknown(),
    output: z.unknown(),
    description: z.string().optional(),
  })).optional(),
}).strict()

// Model pricing schema
export const PricingSchema = z.object({
  type: z.enum(['free', 'paid', 'usage']),
  amount: z.number().optional(),
  currency: z.string().optional(),
  period: z.enum(['request', 'daily', 'monthly', 'yearly']).optional(),
  details: z.string().optional(),
})

// Model statistics schema
export const StatsSchema = z.object({
  rating: z.number().min(0).max(5),
  reviews: z.number().min(0),
  deployments: z.number().min(0),
  lastUpdated: z.string().datetime().optional(),
  customMetrics: z.record(z.number()).optional(),
})

// Complete model schema
export const ModelSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  version: z.string().regex(/^\d+\.\d+\.\d+$/), // Semantic versioning
  category: z.enum(ModelCategories),
  capabilities: z.array(z.string()).min(1),
  apiSpec: ApiSpecSchema,
  pricing: PricingSchema,
  stats: StatsSchema,
})

// Model update schema (all fields optional)
export const ModelUpdateSchema = ModelSchema.partial()

// Types
export type ModelCategory = typeof ModelCategories[number]
export type ApiParameter = z.infer<typeof ApiParameterSchema>
export type ApiSpec = z.infer<typeof ApiSpecSchema>
export type ModelPricing = z.infer<typeof PricingSchema>
export type ModelStats = z.infer<typeof StatsSchema>
export type Model = z.infer<typeof ModelSchema>
export type ModelUpdate = z.infer<typeof ModelUpdateSchema> 