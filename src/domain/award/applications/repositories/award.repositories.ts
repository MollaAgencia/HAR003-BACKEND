import { UniqueEntityID } from '@core/domain/unique-entity-id'

export type GetAwardAccumulatedProps = {
  userId: UniqueEntityID
}

export abstract class AwardRepository {
  abstract getAccumulatedAward(data: GetAwardAccumulatedProps): Promise<number>
}
