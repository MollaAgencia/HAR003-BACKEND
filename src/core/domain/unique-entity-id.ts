import { createId } from '@paralleldrive/cuid2'

export class UniqueEntityID {
  private value: string

  toValue() {
    return this.value
  }

  toString() {
    return this.value
  }

  constructor(value?: string) {
    this.value = value ?? createId()
  }
  public equals(id: UniqueEntityID) {
    return id.toValue() === this.value
  }
}
