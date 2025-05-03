import { PrismaClient } from '@prisma/client'

const client1 = new PrismaClient({ datasources: { db: { url: 'file:///dev.db' }} })
const client2 = new PrismaClient({ datasources: { db: { url: 'postgres://localhost/db2' }} })

async function migrate() {
  const users = await client1.user.findMany();
  console.log(users);
}

migrate();