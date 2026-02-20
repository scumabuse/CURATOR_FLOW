'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

interface SidebarProps {
  role: 'CURATOR' | 'STUDENT'
  userName: string
}

const curatorLinks = [
  {
    href: '/curator', label: 'Дашборд', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
    )
  },
  {
    href: '/curator/groups', label: 'Группы', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
    )
  },
  {
    href: '/curator/tasks', label: 'Задания', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
    )
  },
  {
    href: '/curator/analytics', label: 'Аналитика', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
    )
  },
]

const studentLinks = [
  {
    href: '/student', label: 'Мои задания', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
    )
  },
  {
    href: '/student/history', label: 'История сдач', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
    )
  },
]

export default function Sidebar({ role, userName }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const links = role === 'CURATOR' ? curatorLinks : studentLinks
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  function logout() {
    localStorage.removeItem('user')
    router.push('/auth/login')
  }

  return (
    <>
      <button className="burger-btn" onClick={() => setOpen(!open)} aria-label="Меню">
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        )}
      </button>

      <div
        className={`sidebar-overlay ${open ? 'visible' : ''}`}
        onClick={() => setOpen(false)}
      />

      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 14px', marginBottom: 28 }}>
          <div style={{
            width: 34, height: 34,
            background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
            borderRadius: 9,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 16px rgba(139, 92, 246, 0.3)',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 16, color: '#f1f5f9' }}>CuratorFlow</span>
        </div>

        <div style={{
          padding: '12px 16px',
          background: 'rgba(139, 92, 246, 0.06)',
          border: '1px solid rgba(139, 92, 246, 0.1)',
          borderRadius: 12,
          marginBottom: 24,
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>{userName}</div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 3 }}>
            {role === 'CURATOR' ? 'Куратор' : 'Студент'}
          </div>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {links.map(link => (
            <Link key={link.href} href={link.href}
              className={`sidebar-link ${pathname === link.href ? 'active' : ''}`}>
              <span style={{ display: 'flex', alignItems: 'center' }}>{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>

        <button onClick={logout} style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '11px 16px', borderRadius: 12, border: 'none',
          background: 'none', cursor: 'pointer',
          color: '#64748b', fontSize: 14, fontWeight: 500,
          width: '100%', fontFamily: 'Inter, sans-serif',
          transition: 'all 0.2s',
        }}
          onMouseEnter={e => {
            (e.target as HTMLElement).style.color = '#f87171';
            (e.target as HTMLElement).style.background = 'rgba(239,68,68,0.06)';
          }}
          onMouseLeave={e => {
            (e.target as HTMLElement).style.color = '#64748b';
            (e.target as HTMLElement).style.background = 'none';
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Выйти
        </button>
      </aside>
    </>
  )
}
