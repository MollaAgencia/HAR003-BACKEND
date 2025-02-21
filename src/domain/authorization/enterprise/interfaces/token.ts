import { UniqueEntityID } from '@core/domain/unique-entity-id'

const tokenTypes = {
  EMAIL_VERIFICATION: 'EMAIL_VERIFICATION',
  PASSWORD_RESET: 'PASSWORD_RESET',
} as const

export type TokenType = (typeof tokenTypes)[keyof typeof tokenTypes]

export type TokenProps = {
  userId: UniqueEntityID
  type: TokenType
  createdAt: Date
}
