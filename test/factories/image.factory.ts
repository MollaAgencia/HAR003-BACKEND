import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@root/core/domain/unique-entity-id'
import { Optional } from '@root/core/logic/Optional'

import {
  ImageEntity,
  ImageFeedback,
  ImageProps,
  ImageStatus,
  ImageType,
} from '@domain/images/enterprise/entities/image.entity'

type Overrides = Partial<ImageProps>

export function makeFakeImage(data = {} as Overrides) {
  const userId = new UniqueEntityID()
  const pdvId = new UniqueEntityID()
  const url = faker.image.url()
  const blurHash = faker.string.alphanumeric(20)
  const type = faker.helpers.arrayElement([ImageType['type-1'], ImageType['type-2'], ImageType['type-3']])
  const status = faker.helpers.arrayElement([ImageStatus.APPROVED, ImageStatus.PENDING, ImageStatus.REJECTED])
  const feedback = faker.helpers.arrayElement([ImageFeedback.BAD, ImageFeedback.GOOD, ImageFeedback.PENDENT])
  const points = faker.number.int({ min: 0, max: 100 })
  const createdAt = faker.date.past()
  const updatedAt = faker.date.recent()

  const props: Optional<ImageProps, 'updatedAt'> = {
    userId: data.userId || userId,
    pdvId: data.pdvId || pdvId,
    url: data.url || url,
    blurHash: data.blurHash || blurHash,
    type: data.type || type,
    status: data.status || status,
    feedback: data.feedback || feedback,
    points: data.points || points,
    createdAt: data.createdAt || createdAt,
    updatedAt: data.updatedAt || updatedAt,
  }

  const image = ImageEntity.create(props)

  return image
}
