import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hash = await bcrypt.hash('123456', 10)

  const curator = await prisma.user.upsert({
    where: { email: 'curator@demo.com' },
    update: {},
    create: { email: 'curator@demo.com', name: 'Анна Петрова', password: hash, role: 'CURATOR' }
  })

  const student = await prisma.user.upsert({
    where: { email: 'student@demo.com' },
    update: {},
    create: { email: 'student@demo.com', name: 'Иван Иванов', password: hash, role: 'STUDENT' }
  })

  const group = await prisma.group.upsert({
    where: { id: 'demo-group-1' },
    update: {},
    create: { id: 'demo-group-1', name: 'ИТ-21', curatorId: curator.id }
  })

  await prisma.user.update({ where: { id: student.id }, data: { groupId: group.id } })

  const now = new Date()
  await prisma.task.upsert({
    where: { id: 'task-1' },
    update: {},
    create: {
      id: 'task-1', title: 'Тест по JavaScript основам', groupId: group.id,
      description: 'Пройдите тест и сдайте скриншот результата',
      deadline: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    }
  })

  await prisma.task.upsert({
    where: { id: 'task-2' },
    update: {},
    create: {
      id: 'task-2', title: 'Практическая работа №3', groupId: group.id,
      description: 'Создать простой веб-сайт',
      deadline: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000)
    }
  })

  console.log('✅ Demo data seeded!')
  console.log('  curator@demo.com / 123456')
  console.log('  student@demo.com / 123456')
}

main().finally(() => prisma.$disconnect())
