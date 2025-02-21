import { PaginatedResult } from '@root/core/dto/paginated-result'
import { PaginationProps } from '@root/core/dto/pagination-props'

import { UniqueEntityID } from '@core/domain/unique-entity-id'
import { AsyncMaybe } from '@core/logic/Maybe'

import { User } from '@domain/authorization/enterprise/entities/user.entity'
import { UserRole } from '@domain/authorization/enterprise/interfaces/user'

export type FindUserProps = {
  status?: string
  name?: string
  document?: string
}

export abstract class UsersRepository {
  abstract register(user: User): Promise<void>
  abstract create(user: User): Promise<void>
  abstract update(user: User): Promise<void>
  abstract toggleStatus(user: User): Promise<void>
  abstract findById(id: UniqueEntityID): AsyncMaybe<User>
  abstract findByEmail(email: string): AsyncMaybe<User>
  abstract findByDocument(document: string): AsyncMaybe<User>
  abstract findManyByIncorporate(roles: Array<UserRole>): Promise<
    Array<{
      id: UniqueEntityID
      name: string
      role: UserRole
    }>
  >
  abstract save(user: User): Promise<void>
  abstract findManyForManagement(props: PaginationProps, findUserProps: FindUserProps): Promise<PaginatedResult<User[]>>
}
