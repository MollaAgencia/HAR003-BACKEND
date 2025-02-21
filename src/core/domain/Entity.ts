import { UniqueEntityID } from './unique-entity-id'

export abstract class Entity<T> {
  protected _id: UniqueEntityID
  public props: T

  public get id() {
    return this._id
  }

  protected constructor(props: T, id?: UniqueEntityID) {
    this.props = props
    this._id = id ?? new UniqueEntityID()
  }

  public equals(object?: Entity<T>): boolean {
    if (object === null || object === undefined) {
      return false
    }

    if (this === object) {
      return true
    }

    if (!(object instanceof Entity)) {
      return false
    }

    return this._id === object._id
  }
}
