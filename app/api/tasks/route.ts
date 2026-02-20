import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  const groupId = req.nextUrl.searchParams.get('groupId')
  const studentId = req.nextUrl.searchParams.get('studentId')

  if (groupId) {
    const tasks = await prisma.task.findMany({
      where: { groupId },
      include: { submissions: { include: { student: { select: { id: true, name: true } } } } },
      orderBy: { deadline: 'asc' }
    })
    return NextResponse.json(tasks)
  }

  if (studentId) {
    const user = await prisma.user.findUnique({ where: { id: studentId } })
    if (!user?.groupId) return NextResponse.json([])
    const tasks = await prisma.task.findMany({
      where: { groupId: user.groupId },
      include: { submissions: { where: { studentId } } },
      orderBy: { deadline: 'asc' }
    })
    return NextResponse.json(tasks)
  }

  return NextResponse.json([])
}

export async function POST(req: NextRequest) {
  const { title, description, link, deadline, groupId } = await req.json()
  const task = await prisma.task.create({
    data: { title, description, link: link || null, deadline: new Date(deadline), groupId }
  })
  return NextResponse.json(task)
}

export async function PATCH(req: NextRequest) {
  const { id, title, description, link, deadline } = await req.json()
  if (!id) return NextResponse.json({ error: 'ID обязателен' }, { status: 400 })

  const data: any = {}
  if (title !== undefined) data.title = title
  if (description !== undefined) data.description = description
  if (link !== undefined) data.link = link || null
  if (deadline !== undefined) data.deadline = new Date(deadline)

  const task = await prisma.task.update({ where: { id }, data })
  return NextResponse.json(task)
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'ID обязателен' }, { status: 400 })

  // Сначала удалить все submissions
  await prisma.taskSubmission.deleteMany({ where: { taskId: id } })
  await prisma.task.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
