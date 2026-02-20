import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  const curatorId = req.nextUrl.searchParams.get('curatorId')
  if (!curatorId) return NextResponse.json({ error: 'curatorId required' }, { status: 400 })
  const groups = await prisma.group.findMany({
    where: { curatorId },
    include: { students: { select: { id: true, name: true, email: true } }, tasks: true }
  })
  return NextResponse.json(groups)
}

export async function POST(req: NextRequest) {
  const { name, curatorId } = await req.json()
  const group = await prisma.group.create({ data: { name, curatorId } })
  return NextResponse.json(group)
}
