import { Injectable } from '@nestjs/common'
import { PaginatedResult } from '@root/core/dto/paginated-result'
import { PaginationProps } from '@root/core/dto/pagination-props'

import { UniqueEntityID } from '@core/domain/unique-entity-id'
import { DomainEvents } from '@core/events/domain-events'
import { AsyncMaybe } from '@core/logic/Maybe'

import { FindUserProps, UsersRepository } from '@domain/authorization/applications/repositories/users.repository'
import { User } from '@domain/authorization/enterprise/entities/user.entity'
import { UserRole } from '@domain/authorization/enterprise/interfaces/user'

import { UserMappers } from '../mappers/users.mappers'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private readonly db: PrismaService) {}

  async register(user: User): Promise<void> {
    const raw = UserMappers.toPersistence(user)
    await this.db.user.create({ data: raw })
    DomainEvents.dispatchEventsForAggregate(user.id)
  }

  async create(user: User): Promise<void> {
    const raw = UserMappers.toPersistence(user)

    await this.db.$transaction(async (prisma) => {
      await prisma.user.create({
        data: raw,
      })
    })
    DomainEvents.dispatchEventsForAggregate(user.id)
  }

  async update(user: User): Promise<void> {
    const raw = UserMappers.toPersistence(user)

    try {
      await this.db.user.update({
        where: {
          id: user.id.toValue(),
        },
        data: raw,
      })
    } catch (error) {
      throw new Error('Falha ao atualizar o usuário.')
    }
  }

  async toggleStatus(user: User): Promise<void> {
    try {
      const newStatus = user.disabled ? null : new Date()

      await this.db.user.update({
        where: { id: user.id.toValue() },
        data: { disabled: newStatus },
      })
    } catch (error) {
      throw new Error('Falha ao alterar o status do usuário.')
    }
  }

  async findById(id: UniqueEntityID): AsyncMaybe<User> {
    const user = await this.db.user.findUnique({
      where: { id: id.toValue() },
    })

    if (!user) return null

    return UserMappers.toDomain(user)
  }

  async findByDocument(document: string): AsyncMaybe<User> {
    const user = await this.db.user.findUnique({
      where: { document: document },
    })

    if (!user) return null

    return UserMappers.toDomain(user)
  }

  async findByEmail(email: string): AsyncMaybe<User> {
    const user = await this.db.user.findFirst({
      where: { email: email, disabled: null },
    })

    if (!user) return null

    return UserMappers.toDomain(user)
  }

  async findManyByIncorporate(
    roles: Array<UserRole>,
  ): Promise<Array<{ id: UniqueEntityID; name: string; role: UserRole }>> {
    const users = await this.db.user.findMany({
      where: {
        role: {
          in: roles,
        },
      },
      select: {
        id: true,
        name: true,
        role: true,
      },
    })

    return users.map((user) => ({
      id: new UniqueEntityID(user.id),
      name: user.name,
      role: user.role as UserRole,
    }))
  }

  async findManyForManagement(
    paginationProps: PaginationProps,
    findUserProps: FindUserProps,
  ): Promise<PaginatedResult<User[]>> {
    const { pageIndex, limit } = paginationProps
    const { name, status, document } = findUserProps

    const offset = (pageIndex - 1) * limit
    const [users, totalCount] = await Promise.all([
      this.db.user.findMany({
        where: {
          AND: [
            name ? { name: { contains: name } } : {},
            document ? { document: { contains: document } } : {},
            status ? { disabled: status == 'ACTIVE' ? null : { not: null } } : {},
          ],
        },
        orderBy: {
          name: 'asc',
        },
        skip: offset,
        take: limit,
      }),
      this.db.user.count({
        where: {
          AND: [
            name ? { name: { contains: name } } : {},
            document ? { document: { contains: document } } : {},
            status ? { disabled: status == 'ACTIVE' ? null : { not: null } } : {},
          ],
        },
      }),
    ])
    const mappedUsers = users.map((user) => UserMappers.toDomain(user))

    return {
      results: mappedUsers,
      meta: {
        totalCount: totalCount,
        pageIndex: pageIndex,
        perPage: limit,
      },
    }
  }

  async save(user: User): Promise<void> {
    const raw = UserMappers.toPersistence(user)
    await this.db.user.update({
      where: { id: user.id.toValue() },
      data: raw,
    })
    DomainEvents.dispatchEventsForAggregate(user.id)
  }
}
