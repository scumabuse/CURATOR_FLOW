import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { taskId, studentId, screenshotUrl } = body

    // Check existing
    const existing = await prisma.taskSubmission.findFirst({ where: { taskId, studentId } })
    if (existing) {
      const updated = await prisma.taskSubmission.update({
        where: { id: existing.id },
        data: { screenshotUrl, status: 'PENDING', aiResult: null }
      })
      return NextResponse.json(updated)
    }

    const submission = await prisma.taskSubmission.create({
      data: { taskId, studentId, screenshotUrl, status: 'PENDING' }
    })
    return NextResponse.json(submission)
  } catch (e) {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const { id, status, aiResult } = await req.json()
  const submission = await prisma.taskSubmission.update({
    where: { id },
    data: { status, aiResult }
  })
  return NextResponse.json(submission)
}
