'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'

interface User { id: string; name: string; role: string; groupId?: string }
interface Task {
  id: string; title: string; description: string; link?: string; deadline: string
  submissions: { id: string; status: string; aiResult?: string; screenshotUrl?: string }[]
}

export default function StudentDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [groupCode, setGroupCode] = useState('')
  const [joining, setJoining] = useState(false)
  const [joinError, setJoinError] = useState('')
  const [uploadingTaskId, setUploadingTaskId] = useState<string | null>(null)
  const [aiChecking, setAiChecking] = useState<string | null>(null)
  const fileRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (!stored) { router.push('/auth/login'); return }
    const u = JSON.parse(stored)
    if (u.role !== 'STUDENT') { router.push('/curator'); return }
    setUser(u)
    if (u.groupId) loadTasks(u.id)
    else setLoading(false)
  }, [])

  async function loadTasks(id: string) {
    setLoading(true)
    const res = await fetch(`/api/tasks?studentId=${id}`)
    setTasks(await res.json())
    setLoading(false)
  }

  async function joinGroup(e: React.FormEvent) {
    e.preventDefault(); setJoining(true); setJoinError('')
    try {
      const res = await fetch('/api/groups/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: user!.id, groupId: groupCode })
      })
      const data = await res.json()
      if (!res.ok) { setJoinError(data.error || 'Группа не найдена'); return }
      const updated = { ...user!, groupId: groupCode }
      setUser(updated)
      localStorage.setItem('user', JSON.stringify(updated))
      await loadTasks(user!.id)
    } catch { setJoinError('Ошибка соединения') }
    finally { setJoining(false) }
  }

  async function submitTask(task: Task, file: File) {
    if (!user) return
    setUploadingTaskId(task.id); setAiChecking(task.id)

    const base64 = await new Promise<string>((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve((reader.result as string).split(',')[1])
      reader.readAsDataURL(file)
    })

    const subRes = await fetch('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId: task.id, studentId: user.id, screenshotUrl: `data:image/jpeg;base64,${base64.slice(0, 50)}...` })
    })
    const sub = await subRes.json()

    try {
      const aiRes = await fetch('/api/vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ screenshotBase64: base64, studentName: user.name, taskTitle: task.title })
      })
      const aiData = await aiRes.json()

      const newStatus = aiData.approved ? 'AI_APPROVED' : 'PENDING'
      await fetch('/api/submissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: sub.id, status: newStatus, aiResult: JSON.stringify(aiData) })
      })
    } catch (e) { /* AI failed, keep PENDING */ }

    setUploadingTaskId(null); setAiChecking(null)
    await loadTasks(user.id)
  }

  const getStatus = (task: Task) => task.submissions[0]?.status || 'NOT_SUBMITTED'
  const isOverdue = (deadline: string) => new Date(deadline) < new Date()
  const timeLeft = (deadline: string) => {
    const diff = new Date(deadline).getTime() - Date.now()
    if (diff < 0) return 'Просрочено'
    const h = Math.floor(diff / 3600000)
    const d = Math.floor(h / 24)
    if (d > 0) return `${d}д ${h % 24}ч`
    return `${h}ч ${Math.floor((diff % 3600000) / 60000)}м`
  }

  const statusInfo = (s: string) => ({
    NOT_SUBMITTED: { label: 'Не сдано', cls: 'badge-pending' },
    PENDING: { label: 'На проверке', cls: 'badge-pending' },
    AI_APPROVED: { label: 'AI принял', cls: 'badge-ai' },
    VERIFIED: { label: 'Принято', cls: 'badge-verified' },
    REJECTED: { label: 'Отклонено', cls: 'badge-rejected' },
  }[s] || { label: s, cls: '' })

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#030712' }}><div className="pulse" style={{ color: '#64748b' }}>Загрузка...</div></div>
  if (!user) return null

  const pending = tasks.filter(t => getStatus(t) === 'NOT_SUBMITTED' && !isOverdue(t.deadline))
  const done = tasks.filter(t => ['VERIFIED', 'AI_APPROVED'].includes(getStatus(t)))

  return (
    <div style={{ display: 'flex', background: '#030712', minHeight: '100vh' }}>
      <Sidebar role="STUDENT" userName={user.name} />
      <main className="main-content">
        <div className="animate-in">
          <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 28, fontWeight: 700, marginBottom: 6, color: '#f1f5f9' }}>
            Привет, {user.name.split(' ')[0]}
          </h1>
          <p style={{ color: '#64748b', fontSize: 14, marginBottom: 32 }}>Твои задания и прогресс</p>

          {!user.groupId ? (
            <div className="card" style={{ maxWidth: 480, textAlign: 'center', padding: '52px 40px' }}>
              <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 22, fontWeight: 700, marginBottom: 10, color: '#f1f5f9' }}>Вступи в группу</h3>
              <p style={{ color: '#64748b', fontSize: 14, marginBottom: 28 }}>Попроси у куратора код группы и введи его ниже</p>
              <form onSubmit={joinGroup} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <input placeholder="Код группы (напр. cm123abc)" value={groupCode}
                  onChange={e => setGroupCode(e.target.value)} required />
                {joinError && <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', padding: '10px 14px', borderRadius: 10, fontSize: 13 }}>{joinError}</div>}
                <button className="btn-primary" type="submit" disabled={joining} style={{ padding: '13px' }}>
                  {joining ? 'Вступление...' : 'Вступить в группу'}
                </button>
              </form>
            </div>
          ) : (
            <>
              {/* Stats */}
              <div className="stats-grid-3">
                {[
                  { label: 'Всего заданий', val: tasks.length, gradient: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(99,102,241,0.06))', color: '#a78bfa' },
                  { label: 'Выполнено', val: done.length, gradient: 'linear-gradient(135deg, rgba(34,197,94,0.12), rgba(16,185,129,0.06))', color: '#4ade80' },
                  { label: 'Ожидают сдачи', val: pending.length, gradient: 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(251,191,36,0.06))', color: '#fbbf24' },
                ].map((s, i) => (
                  <div key={i} className="stat-card animate-in" style={{ animationDelay: `${i * 0.08}s`, background: s.gradient, border: 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
                        <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 34, fontWeight: 700, color: s.color }}>{s.val}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="card" style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: 14, fontWeight: 500, color: '#cbd5e1' }}>Общий прогресс</span>
                  <span style={{ fontSize: 14, fontWeight: 600 }} className="gradient-text">
                    {tasks.length > 0 ? Math.round((done.length / tasks.length) * 100) : 0}%
                  </span>
                </div>
                <div className="progress-bar" style={{ height: 10 }}>
                  <div className="progress-fill" style={{ width: tasks.length > 0 ? `${(done.length / tasks.length) * 100}%` : '0%' }}></div>
                </div>
              </div>

              {/* Tasks list */}
              {tasks.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '60px 0' }}>
                  <p style={{ color: '#64748b', fontSize: 15 }}>Заданий пока нет</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: 14 }}>
                  {tasks.map(task => {
                    const status = getStatus(task)
                    const si = statusInfo(status)
                    const overdue = isOverdue(task.deadline)
                    const sub = task.submissions[0]
                    const aiResult = sub?.aiResult ? JSON.parse(sub.aiResult) : null
                    const isUploading = uploadingTaskId === task.id

                    const borderColor = overdue && status === 'NOT_SUBMITTED'
                      ? 'rgba(239,68,68,0.4)'
                      : status === 'VERIFIED' || status === 'AI_APPROVED'
                        ? 'rgba(34,197,94,0.4)'
                        : 'rgba(139,92,246,0.3)'

                    return (
                      <div key={task.id} className="card animate-in" style={{
                        borderLeft: `3px solid ${borderColor}`,
                        opacity: isUploading ? 0.7 : 1,
                      }}>
                        <div className="task-top-row">
                          <div style={{ flex: 1 }}>
                            <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 15, fontWeight: 600, color: '#f1f5f9' }}>{task.title}</h3>
                            {task.description && <p style={{ fontSize: 13, color: '#64748b', marginTop: 5 }}>{task.description}</p>}
                            {task.link && (
                              <a href={task.link} target="_blank" rel="noopener noreferrer"
                                style={{
                                  display: 'inline-flex', alignItems: 'center', gap: 6,
                                  marginTop: 12, padding: '9px 18px',
                                  background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                                  color: 'white', borderRadius: 50, fontSize: 13,
                                  fontWeight: 500, textDecoration: 'none', transition: 'all 0.2s',
                                  boxShadow: '0 0 20px rgba(139,92,246,0.2)',
                                }}>
                                Перейти →
                              </a>
                            )}
                          </div>
                          <span className={`badge ${si.cls}`} style={{ whiteSpace: 'nowrap' }}>{si.label}</span>
                        </div>

                        <div className="task-bottom-row">
                          <div style={{
                            fontSize: 13,
                            color: overdue ? '#f87171' : '#64748b',
                            display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
                          }}>
                            {overdue ? 'Просрочено' : `Осталось: ${timeLeft(task.deadline)}`}
                            <span style={{ opacity: 0.5 }}>{new Date(task.deadline).toLocaleDateString('ru-RU')}</span>
                          </div>

                          {(status === 'NOT_SUBMITTED' || status === 'REJECTED') && (
                            <>
                              <input ref={el => { fileRefs.current[task.id] = el }} type="file" accept="image/*"
                                style={{ display: 'none' }}
                                onChange={async e => { if (e.target.files?.[0]) await submitTask(task, e.target.files[0]) }} />
                              <button className="btn-primary" disabled={isUploading}
                                onClick={() => fileRefs.current[task.id]?.click()}
                                style={{ padding: '9px 18px', fontSize: 13, whiteSpace: 'nowrap' }}>
                                {isUploading ? (aiChecking === task.id ? 'AI проверяет...' : 'Загрузка...') : 'Сдать задание'}
                              </button>
                            </>
                          )}
                        </div>

                        {aiResult && (
                          <div style={{
                            marginTop: 14, padding: '12px 16px',
                            background: aiResult.approved ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                            border: `1px solid ${aiResult.approved ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
                            borderRadius: 12, fontSize: 13, color: '#cbd5e1',
                          }}>
                            <strong style={{ color: aiResult.approved ? '#4ade80' : '#f87171' }}>Vision AI:</strong>{' '}
                            {aiResult.reason}
                            {aiResult.confidence && <span style={{ marginLeft: 8, opacity: 0.6 }}>({aiResult.confidence}% уверенность)</span>}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}
