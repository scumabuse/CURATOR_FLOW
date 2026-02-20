'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'

interface User { id: string; name: string; role: string }
interface Group { id: string; name: string }
interface Task { id: string; title: string; description: string; link?: string; deadline: string; groupId: string; submissions: any[] }

export default function TasksPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [groups, setGroups] = useState<Group[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedGroup, setSelectedGroup] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', link: '', deadline: '', groupId: '' })
  const [loading, setLoading] = useState(false)

  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [editForm, setEditForm] = useState({ title: '', description: '', link: '', deadline: '' })
  const [editLoading, setEditLoading] = useState(false)

  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (!stored) { router.push('/auth/login'); return }
    const u = JSON.parse(stored)
    if (u.role !== 'CURATOR') { router.push('/student'); return }
    setUser(u)
    fetch(`/api/groups?curatorId=${u.id}`).then(r => r.json()).then(g => { setGroups(g); if (g[0]) { setSelectedGroup(g[0].id); setForm(f => ({ ...f, groupId: g[0].id })) } })
  }, [])

  useEffect(() => {
    if (selectedGroup) fetchTasks()
  }, [selectedGroup])

  async function fetchTasks() {
    const res = await fetch(`/api/tasks?groupId=${selectedGroup}`)
    setTasks(await res.json())
  }

  async function createTask(e: React.FormEvent) {
    e.preventDefault(); setLoading(true)
    await fetch('/api/tasks', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    setShowForm(false); setForm(f => ({ ...f, title: '', description: '', link: '', deadline: '' }))
    await fetchTasks()
    setLoading(false)
  }

  function startEdit(task: Task) {
    setEditingTask(task)
    setEditForm({
      title: task.title,
      description: task.description,
      link: task.link || '',
      deadline: task.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : '',
    })
  }

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault()
    if (!editingTask) return
    setEditLoading(true)
    await fetch('/api/tasks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editingTask.id, ...editForm })
    })
    setEditingTask(null)
    await fetchTasks()
    setEditLoading(false)
  }

  async function deleteTask(id: string) {
    await fetch(`/api/tasks?id=${id}`, { method: 'DELETE' })
    setDeletingId(null)
    await fetchTasks()
  }

  async function verifySubmission(subId: string, status: string) {
    await fetch('/api/submissions', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: subId, status }) })
    await fetchTasks()
  }

  const statusLabel = (s: string) => ({ PENDING: 'Ожидает', VERIFIED: 'Принято', REJECTED: 'Отклонено', AI_APPROVED: 'AI принял' }[s] || s)
  const statusClass = (s: string) => ({ PENDING: 'badge-pending', VERIFIED: 'badge-verified', REJECTED: 'badge-rejected', AI_APPROVED: 'badge-ai' }[s] || '')

  if (!user) return null

  return (
    <div style={{ display: 'flex', background: '#030712', minHeight: '100vh' }}>
      <Sidebar role="CURATOR" userName={user.name} />
      <main className="main-content">
        <div className="animate-in">
          <div className="page-header" style={{ marginBottom: 24 }}>
            <div>
              <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 28, fontWeight: 700, marginBottom: 6, color: '#f1f5f9' }}>Задания</h1>
              <p style={{ color: '#64748b', fontSize: 14 }}>Создание и проверка заданий</p>
            </div>
            <button className="btn-primary" onClick={() => { setShowForm(!showForm); setEditingTask(null) }}>+ Новое задание</button>
          </div>

          {groups.length > 1 && (
            <div className="group-tabs">
              {groups.map(g => (
                <button key={g.id} onClick={() => setSelectedGroup(g.id)}
                  style={{
                    padding: '9px 18px', borderRadius: 50, border: 'none', cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 500,
                    transition: 'all 0.3s',
                    background: selectedGroup === g.id ? 'linear-gradient(135deg, #8b5cf6, #6366f1)' : 'rgba(15, 20, 40, 0.6)',
                    color: selectedGroup === g.id ? 'white' : '#64748b',
                    boxShadow: selectedGroup === g.id ? '0 0 20px rgba(139,92,246,0.3)' : 'none',
                  }}>{g.name}</button>
              ))}
            </div>
          )}

          {showForm && (
            <div className="card animate-in" style={{ marginBottom: 24, borderTop: '2px solid rgba(139,92,246,0.4)' }}>
              <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 600, marginBottom: 18, color: '#f1f5f9' }}>Создать задание</h3>
              <form onSubmit={createTask} style={{ display: 'grid', gap: 16 }}>
                <div className="form-2col">
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 8, color: '#94a3b8' }}>Название</label>
                    <input placeholder="Тест по теме..." value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 8, color: '#94a3b8' }}>Дедлайн</label>
                    <input type="datetime-local" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} required />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 8, color: '#94a3b8' }}>Ссылка на тест / задание</label>
                  <input placeholder="https://example.com/test/123" value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} />
                </div>
                {groups.length > 1 && (
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 8, color: '#94a3b8' }}>Группа</label>
                    <select value={form.groupId} onChange={e => setForm({ ...form, groupId: e.target.value })}>
                      {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                    </select>
                  </div>
                )}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 8, color: '#94a3b8' }}>Описание</label>
                  <textarea placeholder="Подробное описание задания..." value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })} rows={3} />
                </div>
                <div className="flex-row-wrap">
                  <button className="btn-primary" type="submit" disabled={loading}>{loading ? 'Создание...' : 'Создать задание'}</button>
                  <button className="btn-secondary" type="button" onClick={() => setShowForm(false)}>Отмена</button>
                </div>
              </form>
            </div>
          )}

          {editingTask && (
            <div className="card animate-in" style={{ marginBottom: 24, borderTop: '2px solid rgba(245,158,11,0.4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 600, color: '#f1f5f9' }}>Редактировать задание</h3>
                <button onClick={() => setEditingTask(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#64748b', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.target as HTMLElement).style.color = '#f87171'}
                  onMouseLeave={e => (e.target as HTMLElement).style.color = '#64748b'}
                >×</button>
              </div>
              <form onSubmit={saveEdit} style={{ display: 'grid', gap: 16 }}>
                <div className="form-2col">
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 8, color: '#94a3b8' }}>Название</label>
                    <input value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} required />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 8, color: '#94a3b8' }}>Дедлайн</label>
                    <input type="datetime-local" value={editForm.deadline} onChange={e => setEditForm({ ...editForm, deadline: e.target.value })} required />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 8, color: '#94a3b8' }}>Ссылка на тест / задание</label>
                  <input placeholder="https://example.com/test/123" value={editForm.link} onChange={e => setEditForm({ ...editForm, link: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 8, color: '#94a3b8' }}>Описание</label>
                  <textarea value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} rows={3} />
                </div>
                <div className="flex-row-wrap">
                  <button className="btn-primary" type="submit" disabled={editLoading}>{editLoading ? 'Сохранение...' : 'Сохранить'}</button>
                  <button className="btn-secondary" type="button" onClick={() => setEditingTask(null)}>Отмена</button>
                </div>
              </form>
            </div>
          )}

          {deletingId && (
            <div className="card animate-in" style={{ marginBottom: 24, borderTop: '2px solid rgba(239,68,68,0.4)', textAlign: 'center', padding: '36px 24px' }}>
              <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 17, fontWeight: 600, marginBottom: 10, color: '#f1f5f9' }}>Удалить задание?</h3>
              <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>Все сданные работы по этому заданию тоже будут удалены. Это действие нельзя отменить.</p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={() => deleteTask(deletingId)} style={{
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: 'white',
                  border: 'none', borderRadius: 50, padding: '11px 28px', fontSize: 14,
                  fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                  boxShadow: '0 0 20px rgba(239,68,68,0.3)',
                }}>Да, удалить</button>
                <button className="btn-secondary" onClick={() => setDeletingId(null)}>Отмена</button>
              </div>
            </div>
          )}

          {groups.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '60px 0' }}>
              <p style={{ color: '#64748b', fontSize: 15, marginBottom: 16 }}>Сначала создайте группу</p>
              <button className="btn-primary" onClick={() => router.push('/curator/groups')}>Создать группу</button>
            </div>
          ) : tasks.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '60px 0' }}>
              <p style={{ color: '#64748b', fontSize: 15 }}>В этой группе нет заданий</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 16 }}>
              {tasks.map(task => (
                <div key={task.id} className="card animate-in">
                  <div className="task-top-row" style={{ marginBottom: 14 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 600, color: '#f1f5f9' }}>{task.title}</h3>
                      {task.description && <p style={{ fontSize: 13, color: '#64748b', marginTop: 6 }}>{task.description}</p>}
                      {task.link && (
                        <a href={task.link} target="_blank" rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 10,
                            padding: '6px 14px', background: 'rgba(139,92,246,0.1)',
                            border: '1px solid rgba(139,92,246,0.2)', color: '#a78bfa',
                            borderRadius: 50, fontSize: 12, fontWeight: 500, textDecoration: 'none',
                            transition: 'all 0.2s',
                          }}>
                          Перейти →
                        </a>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, flexShrink: 0 }}>
                      <div style={{ fontSize: 12, color: '#64748b', whiteSpace: 'nowrap', marginTop: 4 }}>
                        {new Date(task.deadline).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                    <button onClick={() => startEdit(task)} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.15)',
                      color: '#a78bfa', borderRadius: 50, padding: '7px 16px', fontSize: 12,
                      fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                      transition: 'all 0.2s',
                    }}>
                      Редактировать
                    </button>
                    <button onClick={() => setDeletingId(task.id)} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)',
                      color: '#f87171', borderRadius: 50, padding: '7px 16px', fontSize: 12,
                      fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                      transition: 'all 0.2s',
                    }}>
                      Удалить
                    </button>
                    {task.link && (
                      <a href={task.link} target="_blank" rel="noopener noreferrer" style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)',
                        color: '#4ade80', borderRadius: 50, padding: '7px 16px', fontSize: 12,
                        fontWeight: 500, textDecoration: 'none', fontFamily: 'Inter, sans-serif',
                        transition: 'all 0.2s',
                      }}>
                        Перейти →
                      </a>
                    )}
                  </div>

                  {task.submissions.length > 0 ? (
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 500, color: '#64748b', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Сдали: {task.submissions.length}
                      </p>
                      <div style={{ display: 'grid', gap: 8 }}>
                        {task.submissions.map((sub: any) => (
                          <div key={sub.id} className="submission-row">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                              <div style={{
                                width: 32, height: 32,
                                background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                                borderRadius: '50%', display: 'flex', alignItems: 'center',
                                justifyContent: 'center', color: 'white', fontSize: 12,
                                fontWeight: 700, flexShrink: 0,
                              }}>
                                {sub.student?.name?.charAt(0) || '?'}
                              </div>
                              <div style={{ minWidth: 0 }}>
                                <div style={{ fontSize: 13, fontWeight: 500, color: '#f1f5f9' }}>{sub.student?.name}</div>
                                {sub.aiResult && <div style={{ fontSize: 11, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis' }}>AI: {JSON.parse(sub.aiResult || '{}').reason}</div>}
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                              <span className={`badge ${statusClass(sub.status)}`}>{statusLabel(sub.status)}</span>
                              {sub.status === 'PENDING' && (
                                <>
                                  <button onClick={() => verifySubmission(sub.id, 'VERIFIED')} style={{
                                    background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.2)',
                                    color: '#4ade80', borderRadius: 50, padding: '5px 12px', fontSize: 12,
                                    cursor: 'pointer', fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap',
                                  }}>Принять</button>
                                  <button onClick={() => verifySubmission(sub.id, 'REJECTED')} style={{
                                    background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.2)',
                                    color: '#f87171', borderRadius: 50, padding: '5px 12px', fontSize: 12,
                                    cursor: 'pointer', fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap',
                                  }}>Отклонить</button>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div style={{ fontSize: 13, color: '#475569' }}>Никто ещё не сдал</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
