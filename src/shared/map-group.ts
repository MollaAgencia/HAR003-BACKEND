import { SalesChannel, salesChannel as salesChannelTypes } from '@root/domain/authorization/enterprise/interfaces/user'
import { group, Group } from '@root/domain/performance/enterprise/value-objects/bimonthly-performance-details'

type InputProps = {
  value: number
  sallesChannel: SalesChannel
}

export const mapGroup = (data: InputProps): Group => {
  const { value: goal, sallesChannel } = data

  if (goal < 0) {
    throw new Error('Goal não pode ser negativo.')
  }

  if (sallesChannel === salesChannelTypes.RETAIL) {
    switch (true) {
      case goal >= 1500 && goal < 3000:
        return group.BRONZE
      case goal >= 3000 && goal < 6000:
        return group.SILVER
      case goal >= 6000 && goal < 12000:
        return group.GOLD
      case goal >= 12000:
        return group.PLATINUM
      default:
        throw new Error('Valor do goal inválido para o canal SM.')
    }
  } else if (sallesChannel === salesChannelTypes.SM) {
    switch (true) {
      case goal >= 3 && goal < 10:
        return group.BRONZE
      case goal >= 10 && goal < 20:
        return group.SILVER
      case goal >= 20 && goal < 40:
        return group.GOLD
      case goal >= 40:
        return group.PLATINUM
      default:
        throw new Error('Valor do goal inválido para o canal SM.')
    }
  } else {
    throw new Error(`SalesChannel inválido: ${sallesChannel}`)
  }
}
