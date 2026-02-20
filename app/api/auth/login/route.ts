import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return NextResponse.json({ error: 'Пользователь не найден' }, { status: 401 })
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return NextResponse.json({ error: 'Неверный пароль' }, { status: 401 })
    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role, groupId: user.groupId } })
  } catch (e: any) {
    console.error('[login] Error:', e?.message || e)
    return NextResponse.json({
      error: e?.message?.includes('SQLITE') || e?.message?.includes('database')
        ? 'Ошибка БД — SQLite не поддерживается на Vercel. Нужна PostgreSQL.'
        : 'Ошибка сервера: ' + (e?.message || 'unknown')
    }, { status: 500 })
  }
}
