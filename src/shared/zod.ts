import { ZodEnum, ZodString } from 'zod'

export const convertNumber = (value: ZodString) =>
  value.default('0').transform((value) => parseFloat(value.replace(',', '.')))

export const convertPercentage = (value: ZodString) =>
  value
    .min(1)
    .transform((value) => value.replace('%', ''))
    .transform((value) => parseFloat(value.replace(',', '.')))
    .transform((value) => value / 100)
