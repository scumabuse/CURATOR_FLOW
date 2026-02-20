import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  const { studentId, groupId } = await req.json()

  // Ищем группу по полному ID или по первым 8 символам
  const group = await prisma.group.findFirst({
    where: {
      OR: [
        { id: groupId },
        { id: { startsWith: groupId } }
      ]
    }
  })

  if (!group) return NextResponse.json({ error: 'Группа не найдена' }, { status: 404 })

  await prisma.user.update({ where: { id: studentId }, data: { groupId: group.id } })
  return NextResponse.json({ success: true, groupName: group.name })
}