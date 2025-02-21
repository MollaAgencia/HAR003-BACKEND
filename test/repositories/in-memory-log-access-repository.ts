import { UniqueEntityID } from '@root/core/domain/unique-entity-id'
import { LogAccessRepository } from '@root/domain/log-access/applications/repositories/log-access.repository'
import { LogAccess } from '@root/domain/log-access/enterprise/entities/log-access.entity'

export class InMemoryLogAccesRepository implements LogAccessRepository {
  public logAccess: LogAccess[] = []

  async create(logAccess: LogAccess): Promise<void> {
    this.logAccess.push(logAccess)
    return
  }

  async findAccess({ page, userId }: { userId: UniqueEntityID; page: string }): Promise<LogAccess> {
    const startOfDay = new Date(new Date().setHours(0, 0, 0, 0))
    const endOfDay = new Date(new Date().setHours(23, 59, 59, 999))

    const userAlreadyAccessedToday = this.logAccess.find((log) => {
      const createdAt = new Date(log.createdAt)
      return createdAt >= startOfDay && createdAt < endOfDay && log.userId.equals(userId) && page === log.page
    })

    if (!userAlreadyAccessedToday) {
      return null
    }

    return userAlreadyAccessedToday
  }
}
