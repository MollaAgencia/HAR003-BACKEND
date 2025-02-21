import { randomInt } from 'node:crypto'

export class UniqueTwoFactorTokenId {
  private value: string

  toValue() {
    return this.value
  }

  constructor(value?: string) {
    this.value = value ?? randomInt(100_000, 999_999).toString()
  }

  public equals(id: UniqueTwoFactorTokenId) {
    return id.toValue() === this.value
  }

  public validate() {
    return /^\d{6}$/.test(this.value)
  }
}
