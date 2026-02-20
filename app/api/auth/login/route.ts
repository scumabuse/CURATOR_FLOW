import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({
      error: 'ПИЗДЕЦ: Vercel в упор не видит DATABASE_URL. Переменной не существует на сервере!'
    }, { status: 500 })
  }

  try {
    const { email, password } = await req.json()
    const user = await prisma.user.findUnique({ where: { email } })

  } catch (e: any) {
    return NextResponse.json({ error: 'Ошибка сервера: ' + (e?.message || 'unknown') }, { status: 500 })
  }
}