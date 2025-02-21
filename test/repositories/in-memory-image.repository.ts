import { UniqueEntityID } from '@root/core/domain/unique-entity-id'
import { AsyncMaybe } from '@root/core/logic/Maybe'
import {
  FindManyByUserIdProps,
  FindManyProps,
  ImageRepository,
} from '@root/domain/images/applications/repositories/image.repository'

import { ImageEntity } from '@domain/images/enterprise/entities/image.entity'

export class InMemoryImageRepository implements ImageRepository {
  public images: Array<ImageEntity> = []

  async register(data: ImageEntity): Promise<void> {
    this.images.push(data)

    return
  }

  async findMany(
    data: FindManyProps,
  ): Promise<{ results: Array<ImageEntity>; meta: { pageIndex: number; perPage: number; totalCount: number } }> {
    const { status, type, limit, pageIndex, pdvId } = data
    const startIndex = (pageIndex - 1) * limit
    const endIndex = startIndex + limit

    let results = this.images.filter((image) => image.status === status && image.type === type)

    results = pdvId ? results.filter((image) => image.pdvId.equals(pdvId)) : results

    const totalCount = results.length

    return {
      results: results.slice(startIndex, endIndex),
      meta: {
        pageIndex,
        perPage: limit,
        totalCount,
      },
    }
  }

  async findManyByUserId(
    data: FindManyByUserIdProps,
  ): Promise<{ results: Array<ImageEntity>; meta: { pageIndex: number; perPage: number; totalCount: number } }> {
    const { userId, status, type, limit, pageIndex, pdvId } = data
    const startIndex = (pageIndex - 1) * limit
    const endIndex = startIndex + limit

    let results = this.images.filter(
      (image) => image.userId.equals(userId) && image.status === status && image.type === type,
    )

    results = pdvId ? results.filter((image) => image.pdvId.equals(pdvId)) : results

    const totalCount = results.length

    return {
      results: results.slice(startIndex, endIndex),
      meta: {
        pageIndex,
        perPage: limit,
        totalCount,
      },
    }
  }

  async findMetricsImagesPosted(): Promise<{
    totalCount: number
    approvedCount: number
    pendingCount: number
    rejectedCount: number
  }> {
    const totalCount = this.images.length
    const approvedCount = this.images.filter((image) => image.status === 'APPROVED').length
    const pendingCount = this.images.filter((image) => image.status === 'PENDING').length
    const rejectedCount = this.images.filter((image) => image.status === 'REJECTED').length

    return {
      totalCount,
      approvedCount,
      pendingCount,
      rejectedCount,
    }
  }

  async findNextImagePending(): AsyncMaybe<ImageEntity> {
    const pendingImages = this.images.filter((image) => image.status === 'PENDING')
    if (pendingImages.length === 0) return null
  }

  async findById(id: UniqueEntityID): AsyncMaybe<ImageEntity> {
    const image = this.images.find((item) => item.id.equals(id))

    if (!image) return null

    return image
  }

  async save(data: ImageEntity): Promise<void> {
    const index = this.images.findIndex((image) => image.id.equals(data.id))

    this.images[index] = data

    return
  }
}
