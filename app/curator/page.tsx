'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import ScrollReveal from '@/components/ScrollReveal'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface User { id: string; name: string; role: string }
interface Group { id: string; name: string; students: any[]; tasks: any[] }

export default function CuratorDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (!stored) { router.push('/auth/login'); return }
    const u = JSON.parse(stored)
    if (u.role !== 'CURATOR') { router.push('/student'); return }
    setUser(u)
    fetch(`/api/groups?curatorId=${u.id}`)
      .then(r => r.json()).then(setGroups).finally(() => setLoading(false))
  }, [])

  const totalStudents = groups.reduce((a, g) => a + g.students.length, 0)
  const totalTasks = groups.reduce((a, g) => a + g.tasks.length, 0)

  const chartData = groups.map(g => ({ name: g.name, студентов: g.students.length, заданий: g.tasks.length }))
  const pieData = [
    { name: 'Выполнено', value: 65, color: '#22c55e' },
    { name: 'В процессе', value: 25, color: '#8b5cf6' },
    { name: 'Просрочено', value: 10, color: '#ef4444' },
  ]

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#030712' }}><div className="pulse" style={{ color: '#64748b' }}>Загрузка...</div></div>
  if (!user) return null

  return (
    <div style={{ display: 'flex', background: '#030712', minHeight: '100vh' }}>
      <Sidebar role="CURATOR" userName={user.name} />
      <main className="main-content">
        <div className="animate-in">
          <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 28, fontWeight: 700, marginBottom: 6, color: '#f1f5f9' }}>
            Добро пожаловать, {user.name.split(' ')[0]}
          </h1>
          <p style={{ color: '#64748b', marginBottom: 32, fontSize: 14 }}>Обзор активности ваших групп</p>

          {/* Stats */}
          <div className="stats-grid-4">
            {[
              { label: 'Групп', val: groups.length, gradient: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(99,102,241,0.06))', color: '#a78bfa' },
              { label: 'Студентов', val: totalStudents, gradient: 'linear-gradient(135deg, rgba(34,197,94,0.12), rgba(16,185,129,0.06))', color: '#4ade80' },
              { label: 'Заданий', val: totalTasks, gradient: 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(251,191,36,0.06))', color: '#fbbf24' },
              { label: 'Сэкономлено ч/нед', val: '5+', gradient: 'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(244,63,94,0.06))', color: '#f87171' },
            ].map((s, i) => (
              <ScrollReveal key={i} direction="up" delay={i * 0.08} duration={0.5}>
                <div className="stat-card" style={{ background: s.gradient }}>
                  <div>
                    <div style={{ fontSize: 12, color: '#64748b', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
                    <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 30, fontWeight: 700, color: s.color }}>{s.val}</div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Charts */}
          {groups.length > 0 && (
            <div className="charts-grid">
              <ScrollReveal direction="left" delay={0.1}>
                <div className="card">
                  <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 15, fontWeight: 600, marginBottom: 20, color: '#f1f5f9' }}>Активность по группам</h3>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={chartData}>
                      <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} />
                      <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} />
                      <Tooltip contentStyle={{ background: 'rgba(10,15,30,0.95)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 12, color: '#f1f5f9' }} />
                      <Bar dataKey="студентов" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="заданий" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="right" delay={0.2}>
                <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 15, fontWeight: 600, marginBottom: 20, alignSelf: 'flex-start', color: '#f1f5f9' }}>Статус выполнения</h3>
                  <PieChart width={180} height={180}>
                    <Pie data={pieData} cx={85} cy={85} outerRadius={70} dataKey="value" strokeWidth={0}>
                      {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: 'rgba(10,15,30,0.95)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 12, color: '#f1f5f9' }} />
                  </PieChart>
                  <div style={{ display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
                    {pieData.map((d, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#94a3b8' }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: d.color, display: 'inline-block', boxShadow: `0 0 8px ${d.color}40` }}></span>
                        {d.name}
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </div>
          )}

          {/* Groups list */}
          <div className="card">
            <div className="page-header" style={{ marginBottom: 20 }}>
              <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 600, color: '#f1f5f9' }}>Мои группы</h3>
              <button className="btn-primary" onClick={() => router.push('/curator/groups')} style={{ padding: '9px 18px', fontSize: 13 }}>+ Создать группу</button>
            </div>
            {groups.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
                <p style={{ fontSize: 15, marginBottom: 16 }}>У вас ещё нет групп</p>
                <button className="btn-primary" onClick={() => router.push('/curator/groups')}>Создать первую группу</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
                {groups.map(g => (
                  <div key={g.id} style={{
                    background: 'rgba(15, 20, 40, 0.5)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: 14, padding: 18, cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                    onClick={() => router.push('/curator/groups')}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(139,92,246,0.2)';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(139,92,246,0.06)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.05)';
                      (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 8, color: '#f1f5f9' }}>{g.name}</div>
                    <div style={{ fontSize: 13, color: '#64748b' }}>{g.students.length} студентов · {g.tasks.length} заданий</div>
                    <div className="progress-bar" style={{ marginTop: 12 }}>
                      <div className="progress-fill" style={{ width: `${Math.min(g.students.length * 10, 100)}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
