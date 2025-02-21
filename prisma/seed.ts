import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

import { UniqueEntityID } from '../src/core/domain/unique-entity-id'
import { salesChannel, userRole } from '../src/domain/authorization/enterprise/interfaces/user'

const prisma = new PrismaClient()

const users = {
  masters: [
    {
      name: 'Master',
      document: '41569832453428075',
      email: 'master@haribo.com.br',
      role: userRole.MASTER,
      distributorId: '250779',
      salesChannel: salesChannel.SM,
    },
  ],
  admins: [
    {
      name: 'Admin',
      document: '41565242362328075',
      email: 'admin@haribo.com.br',
      role: userRole.ADMIN,
      distributorId: '250779',
      salesChannel: salesChannel.SM,
    },
  ],
}

async function main() {
  const password = '123456789'
  const passwordHashed = await hash(password, 8)

  await prisma.distributor.upsert({
    where: { id: '123e4567-e89b-12d3-a456-426614174000' },
    update: {},
    create: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'AGÊNCIA MOLLA',
      externalId: '1234',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  })

  await prisma.user.createMany({
    data: users.masters.map((user) => ({
      id: new UniqueEntityID().toValue(),
      name: user.name,
      document: user.document,
      email: user.email,
      password: passwordHashed,
      distributorId: '123e4567-e89b-12d3-a456-426614174000',
      role: user.role,
      salesChannel: user.salesChannel,
      telephone: '99 9 9999-9999',
      emailVerified: new Date(),
    })),
  })

  await prisma.user.createMany({
    data: users.admins.map((user) => ({
      id: new UniqueEntityID().toValue(),
      name: user.name,
      document: user.document,
      email: user.email,
      distributorId: '123e4567-e89b-12d3-a456-426614174000',
      password: passwordHashed,
      role: user.role,
      salesChannel: user.salesChannel,
      telephone: '99 9 9999-9999',
      emailVerified: new Date(),
    })),
  })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
