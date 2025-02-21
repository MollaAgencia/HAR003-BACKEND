import { z } from 'zod'

export const envSchema = z.object({
  SERVICE: z.string(),
  VERSION: z.string().default('1.0.0'),
  PORT: z.string().default('3333'),

  DATABASE_URL: z.string().min(1),

  // Auth
  JWT_SECRET_KEY: z.string().min(1),
  JWT_PUBLIC_KEY: z.string().min(1),

  // Mailer
  SENDGRID_API_KEY: z.string().min(1),

  // AWS
  AWS_ACCESS_KEY_ID: z.string().min(1),
  AWS_SECRET_ACCESS_KEY: z.string().min(1),
  AWS_BUCKET_NAME: z.string().min(1),
  AWS_REGION: z.string().min(1),
  AWS_BUCKET_URL: z.string().min(1),

  //   App
  APP_URL_DASHBOARD: z.string().min(1),

  NODE_ENV: z.string().min(1).default('production'),
})

export type Env = z.infer<typeof envSchema>
