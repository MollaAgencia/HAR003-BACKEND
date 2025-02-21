import { isCuid } from '@paralleldrive/cuid2'
import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
  ValidationArguments,
} from 'class-validator'

@ValidatorConstraint({ name: 'isCuid2', async: false })
export class IsCuid2Constraint implements ValidatorConstraintInterface {
  validate(token: string) {
    if (!token) return false
    return isCuid(token)
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be a valid cuid`
  }
}

export function IsCuid2(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCuid2Constraint,
    })
  }
}
