'use client'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

function RegisterForm() {
  const router = useRouter()
  const params = useSearchParams()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: params.get('role') || 'STUDENT' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Ошибка регистрации'); return }
      localStorage.setItem('user', JSON.stringify(data.user))
      router.push(data.user.role === 'CURATOR' ? '/curator' : '/student')
    } catch { setError('Ошибка соединения') }
    finally { setLoading(false) }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#030712',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background effects */}
      <div className="grid-bg" />
      <div className="glow-orb" style={{ width: 500, height: 500, background: 'radial-gradient(circle, rgba(139,92,246,0.12), transparent 70%)', top: -100, left: '50%', transform: 'translateX(-50%)' }} />
      <div className="glow-orb" style={{ width: 400, height: 400, background: 'radial-gradient(circle, rgba(99,102,241,0.08), transparent 70%)', bottom: -100, left: -50 }} />

      {/* Logo — link to home */}
      <Link href="/" style={{
        position: 'absolute', top: 20, left: 24, zIndex: 10,
        display: 'flex', alignItems: 'center', gap: 10,
        textDecoration: 'none',
      }}>
        <div style={{
          width: 36, height: 36,
          background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
          borderRadius: 9,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 16, color: '#f1f5f9' }}>CuratorFlow AI</span>
      </Link>

      <div className="card animate-in auth-card" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 52, height: 52,
            background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
            borderRadius: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 0 30px rgba(139, 92, 246, 0.3)',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 24, fontWeight: 700, color: '#f1f5f9' }}>Создать аккаунт</h1>
          <p style={{ color: '#64748b', fontSize: 14, marginTop: 8 }}>CuratorFlow AI</p>
        </div>

        {/* Role toggle */}
        <div style={{
          display: 'flex',
          background: 'rgba(15, 20, 40, 0.8)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 14,
          padding: 4,
          marginBottom: 28,
        }}>
          {['CURATOR', 'STUDENT'].map(r => (
            <button key={r} type="button"
              onClick={() => setForm({ ...form, role: r })}
              style={{
                flex: 1, padding: '10px', borderRadius: 10, border: 'none',
                fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 500,
                cursor: 'pointer', transition: 'all 0.3s',
                background: form.role === r ? 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(99,102,241,0.15))' : 'transparent',
                color: form.role === r ? '#a78bfa' : '#64748b',
                boxShadow: form.role === r ? '0 0 20px rgba(139,92,246,0.1)' : 'none',
              }}>
              {r === 'CURATOR' ? '👨‍🏫 Куратор' : '🎓 Студент'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 8, color: '#94a3b8' }}>Имя</label>
            <input placeholder="Иван Иванов" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 8, color: '#94a3b8' }}>Email</label>
            <input type="email" placeholder="your@email.com" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 8, color: '#94a3b8' }}>Пароль</label>
            <input type="password" placeholder="Минимум 6 символов" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
          </div>
          {error && <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', padding: '10px 14px', borderRadius: 10, fontSize: 13 }}>{error}</div>}
          <button className="btn-primary" type="submit" disabled={loading} style={{ padding: '14px', fontSize: 15, marginTop: 4 }}>
            {loading ? 'Создание...' : 'Зарегистрироваться'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#64748b' }}>
          Уже есть аккаунт?{' '}
          <Link href="/auth/login" style={{ color: '#a78bfa', textDecoration: 'none', fontWeight: 500 }}>Войти</Link>
        </p>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return <Suspense><RegisterForm /></Suspense>
}
