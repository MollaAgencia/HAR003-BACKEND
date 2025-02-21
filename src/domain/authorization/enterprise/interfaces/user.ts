import { UniqueEntityID } from '@root/core/domain/unique-entity-id'

export const userRole = {
  MASTER: 'MASTER',
  ADMIN: 'ADMIN',
  DISTRIBUTOR: 'DISTRIBUTOR',
  MANAGER: 'MANAGER',
  SUPERVISOR: 'SUPERVISOR',
  SELLER: 'SELLER',
} as const

export type UserRole = (typeof userRole)[keyof typeof userRole]

export const salesChannel = {
  SM: 'SM',
  RETAIL: 'RETAIL',
} as const

export type SalesChannel = (typeof salesChannel)[keyof typeof salesChannel]

export const region = {
  N: 'NORTE',
  S: 'SUL',
  L: 'LESTE',
  O: 'OESTE',
  NE: 'NORDESTE',
  SE: 'SUDESTE',
  SO: 'SUDOESTE',
  NO: 'NOROESTE',
  CO: 'CENTRO_OESTE',
} as const

export type Region = (typeof region)[keyof typeof region]

export type UserProps = {
  name: string
  email: string
  document?: string
  distributorId: UniqueEntityID
  salesChannel: SalesChannel
  emailVerified: Date | null
  telephone?: string
  role: UserRole
  region: Region
  password?: string
  disabled: Date | null
  createdAt: Date
  updatedAt?: Date
}
