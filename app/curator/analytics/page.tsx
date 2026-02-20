'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts'

interface User { id: string; name: string; role: string }

const mockWeekly = [
  { day: 'Пн', сдано: 4, просрочено: 1 }, { day: 'Вт', сдано: 7, просрочено: 0 },
  { day: 'Ср', сдано: 3, просрочено: 2 }, { day: 'Чт', сдано: 9, просрочено: 0 },
  { day: 'Пт', сдано: 6, просрочено: 1 }, { day: 'Сб', сдано: 2, просрочено: 0 },
  { day: 'Вс', сдано: 1, просрочено: 0 },
]

export default function AnalyticsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [groups, setGroups] = useState<any[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (!stored) { router.push('/auth/login'); return }
    const u = JSON.parse(stored)
    if (u.role !== 'CURATOR') { router.push('/student'); return }
    setUser(u)
    fetch(`/api/groups?curatorId=${u.id}`).then(r => r.json()).then(setGroups)
  }, [])

  if (!user) return null

  return (
    <div style={{ display: 'flex', background: '#030712', minHeight: '100vh' }}>
      <Sidebar role="CURATOR" userName={user.name} />
      <main className="main-content">
        <div className="animate-in">
          <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 28, fontWeight: 700, marginBottom: 6, color: '#f1f5f9' }}>Аналитика</h1>
          <p style={{ color: '#64748b', fontSize: 14, marginBottom: 32 }}>Статистика успеваемости и дисциплины</p>

          <div className="stats-grid-3">
            {[
              { label: 'Сэкономлено часов / нед', val: '5.2', gradient: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(99,102,241,0.06))', color: '#a78bfa' },
              { label: 'Снижение фейков', val: '−60%', gradient: 'linear-gradient(135deg, rgba(34,197,94,0.12), rgba(16,185,129,0.06))', color: '#4ade80' },
              { label: 'Рост своевременных сдач', val: '+30%', gradient: 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(251,191,36,0.06))', color: '#fbbf24' },
            ].map((s, i) => (
              <div key={i} className="stat-card animate-in" style={{ animationDelay: `${i * 0.1}s`, background: s.gradient, border: 'none' }}>
                <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 34, fontWeight: 700, color: s.color, marginBottom: 6 }}>{s.val}</div>
                <div style={{ fontSize: 13, color: '#64748b' }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div className="charts-grid" style={{ marginBottom: 20 }}>
            <div className="card">
              <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 15, fontWeight: 600, marginBottom: 20, color: '#f1f5f9' }}>Активность за неделю</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={mockWeekly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} />
                  <Tooltip contentStyle={{ background: 'rgba(10,15,30,0.95)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 12, color: '#f1f5f9' }} />
                  <Line type="monotone" dataKey="сдано" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6', r: 4, strokeWidth: 0 }} />
                  <Line type="monotone" dataKey="просрочено" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444', r: 4, strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 15, fontWeight: 600, marginBottom: 20, color: '#f1f5f9' }}>Группы по размеру</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={groups.map(g => ({ name: g.name, студентов: g.students?.length || 0 }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} />
                  <Tooltip contentStyle={{ background: 'rgba(10,15,30,0.95)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 12, color: '#f1f5f9' }} />
                  <Bar dataKey="студентов" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card" style={{ marginTop: 20 }}>
            <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 600, marginBottom: 20, color: '#f1f5f9' }}>Vision AI — статистика проверок</h3>
            <div className="ai-stats-grid">
              {[
                { label: 'Автопроверено', val: '87%', color: '#a78bfa' },
                { label: 'Требует ревью', val: '8%', color: '#fbbf24' },
                { label: 'Фейков отклонено', val: '5%', color: '#f87171' },
                { label: 'Среднее время', val: '2.1с', color: '#4ade80' },
              ].map((s, i) => (
                <div key={i} style={{
                  textAlign: 'center', padding: '20px',
                  background: 'rgba(15, 20, 40, 0.5)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: 14,
                  transition: 'all 0.3s ease',
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(139,92,246,0.15)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(139,92,246,0.06)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.05)';
                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  }}
                >
                  <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 24, fontWeight: 700, color: s.color, marginBottom: 6 }}>{s.val}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
