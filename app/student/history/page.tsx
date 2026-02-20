'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'

interface User { id: string; name: string; role: string }
interface Task {
  id: string; title: string; deadline: string
  submissions: { id: string; status: string; submittedAt: string; aiResult?: string }[]
}

export default function HistoryPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (!stored) { router.push('/auth/login'); return }
    const u = JSON.parse(stored)
    if (u.role !== 'STUDENT') { router.push('/curator'); return }
    setUser(u)
    fetch(`/api/tasks?studentId=${u.id}`).then(r => r.json()).then(setTasks)
  }, [])

  const submitted = tasks.filter(t => t.submissions.length > 0)

  const statusInfo = (s: string) => ({
    PENDING: { label: 'На проверке', cls: 'badge-pending' },
    AI_APPROVED: { label: 'AI принял', cls: 'badge-ai' },
    VERIFIED: { label: 'Принято', cls: 'badge-verified' },
    REJECTED: { label: 'Отклонено', cls: 'badge-rejected' },
  }[s] || { label: s, cls: '' })

  if (!user) return null

  return (
    <div style={{ display: 'flex', background: '#030712', minHeight: '100vh' }}>
      <Sidebar role="STUDENT" userName={user.name} />
      <main className="main-content">
        <div className="animate-in">
          <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 28, fontWeight: 700, marginBottom: 6, color: '#f1f5f9' }}>История сдач</h1>
          <p style={{ color: '#64748b', fontSize: 14, marginBottom: 32 }}>Все твои отправленные задания</p>

          {submitted.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '60px 0' }}>
              <p style={{ color: '#64748b', fontSize: 15 }}>Ты ещё ничего не сдавал</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              {submitted.map(task => {
                const sub = task.submissions[0]
                const si = statusInfo(sub.status)
                const aiResult = sub.aiResult ? JSON.parse(sub.aiResult) : null
                return (
                  <div key={task.id} className="card animate-in history-card">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 15, fontWeight: 600, color: '#f1f5f9', marginBottom: 6 }}>{task.title}</h3>
                      <div style={{ fontSize: 12, color: '#64748b' }}>
                        Сдано: {new Date(sub.submittedAt).toLocaleString('ru-RU')}
                      </div>
                      {aiResult && (
                        <div style={{
                          marginTop: 10, fontSize: 13, color: '#94a3b8',
                          background: 'rgba(15, 20, 40, 0.5)',
                          border: '1px solid rgba(255,255,255,0.04)',
                          padding: '8px 12px', borderRadius: 10,
                        }}>
                          AI: {aiResult.reason}
                        </div>
                      )}
                    </div>
                    <span className={`badge ${si.cls}`} style={{ whiteSpace: 'nowrap' }}>{si.label}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
