'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'

interface User { id: string; name: string; role: string }
interface Group { id: string; name: string; students: { id: string; name: string; email: string }[]; tasks: any[] }

export default function GroupsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [groups, setGroups] = useState<Group[]>([])
  const [newGroupName, setNewGroupName] = useState('')
  const [creating, setCreating] = useState(false)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (!stored) { router.push('/auth/login'); return }
    const u = JSON.parse(stored)
    if (u.role !== 'CURATOR') { router.push('/student'); return }
    setUser(u)
    loadGroups(u.id)
  }, [])

  async function loadGroups(id: string) {
    const res = await fetch(`/api/groups?curatorId=${id}`)
    setGroups(await res.json())
  }

  async function createGroup(e: React.FormEvent) {
    e.preventDefault()
    if (!user || !newGroupName.trim()) return
    setCreating(true)
    await fetch('/api/groups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newGroupName, curatorId: user.id })
    })
    setNewGroupName(''); setShowForm(false)
    await loadGroups(user.id)
    setCreating(false)
  }

  if (!user) return null

  return (
    <div style={{ display: 'flex', background: '#030712', minHeight: '100vh' }}>
      <Sidebar role="CURATOR" userName={user.name} />
      <main className="main-content">
        <div className="animate-in">
          <div className="page-header">
            <div>
              <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 28, fontWeight: 700, marginBottom: 6, color: '#f1f5f9' }}>Группы</h1>
              <p style={{ color: '#64748b', fontSize: 14 }}>Управление учебными группами</p>
            </div>
            <button className="btn-primary" onClick={() => setShowForm(!showForm)}>+ Новая группа</button>
          </div>

          {showForm && (
            <div className="card animate-in" style={{ marginBottom: 24, borderTop: '2px solid rgba(139,92,246,0.4)' }}>
              <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 600, marginBottom: 18, color: '#f1f5f9' }}>Создать группу</h3>
              <form onSubmit={createGroup} className="create-group-form">
                <input placeholder="Название группы (напр. ИТ-21)" value={newGroupName}
                  onChange={e => setNewGroupName(e.target.value)} required style={{ flex: 1 }} />
                <button className="btn-primary" type="submit" disabled={creating}>{creating ? 'Создание...' : 'Создать'}</button>
                <button className="btn-secondary" type="button" onClick={() => setShowForm(false)}>Отмена</button>
              </form>
            </div>
          )}

          {groups.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '60px 0' }}>
              <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 18, marginBottom: 10, color: '#f1f5f9' }}>Нет групп</h3>
              <p style={{ color: '#64748b', fontSize: 14 }}>Создайте первую группу и поделитесь кодом со студентами</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 16 }}>
              {groups.map(g => (
                <div key={g.id} className="card animate-in">
                  <div className="page-header" style={{ marginBottom: 18 }}>
                    <div>
                      <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 18, fontWeight: 600, color: '#f1f5f9' }}>{g.name}</h3>
                      <p style={{ color: '#64748b', fontSize: 13, marginTop: 5 }}>
                        {g.students.length} студентов · {g.tasks.length} заданий
                      </p>
                    </div>
                    <div style={{
                      background: 'rgba(139,92,246,0.1)',
                      border: '1px solid rgba(139,92,246,0.2)',
                      color: '#a78bfa',
                      padding: '7px 16px',
                      borderRadius: 50,
                      fontSize: 12,
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                    }}>
                      ID: <code style={{ fontSize: 13, fontWeight: 700 }}>{g.id.slice(0, 8)}</code>
                    </div>
                  </div>

                  {g.students.length > 0 ? (
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 500, color: '#64748b', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Студенты:</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {g.students.map(s => (
                          <div key={s.id} style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            background: 'rgba(15, 20, 40, 0.6)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            padding: '7px 14px', borderRadius: 50, fontSize: 13, color: '#cbd5e1',
                          }}>
                            <div style={{
                              width: 24, height: 24,
                              background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                              borderRadius: '50%', display: 'flex', alignItems: 'center',
                              justifyContent: 'center', color: 'white', fontSize: 10, fontWeight: 700,
                            }}>
                              {s.name.charAt(0)}
                            </div>
                            {s.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div style={{
                      background: 'rgba(139,92,246,0.06)',
                      border: '1px solid rgba(139,92,246,0.1)',
                      borderRadius: 12, padding: '14px 18px',
                      fontSize: 13, color: '#64748b',
                    }}>
                      Поделитесь кодом группы со студентами: <strong style={{ color: '#a78bfa' }}>{g.id.slice(0, 8)}</strong>
                    </div>
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
