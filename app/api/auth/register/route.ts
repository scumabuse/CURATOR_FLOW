import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Заполните все поля' }, { status: 400 })
    }

    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) return NextResponse.json({ error: 'Email уже используется' }, { status: 400 })

    const hash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { name, email, password: hash, role: role || 'STUDENT' }
    })

    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role, groupId: user.groupId }
    })
  } catch (e: any) {
    console.error('[register] Error:', e?.message || e)
    return NextResponse.json({
      error: e?.message?.includes('SQLITE') || e?.message?.includes('database')
        ? 'Ошибка БД — SQLite не поддерживается на Vercel. Нужна PostgreSQL.'
        : 'Ошибка сервера: ' + (e?.message || 'unknown')
    }, { status: 500 })
  }
}
