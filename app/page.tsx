import Link from 'next/link'

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', background: '#030712', position: 'relative', overflow: 'hidden' }}>
      {/* Grid background */}
      <div className="grid-bg" />

      {/* Glow orbs */}
      <div className="glow-orb" style={{ width: 600, height: 600, background: 'radial-gradient(circle, rgba(139,92,246,0.15), transparent 70%)', top: -200, left: '50%', transform: 'translateX(-50%)' }} />
      <div className="glow-orb" style={{ width: 400, height: 400, background: 'radial-gradient(circle, rgba(99,102,241,0.1), transparent 70%)', top: 400, right: -100 }} />
      <div className="glow-orb" style={{ width: 500, height: 500, background: 'radial-gradient(circle, rgba(139,92,246,0.08), transparent 70%)', bottom: -100, left: -100 }} />

      <div className="landing-container">
        {/* Navigation */}
        <nav className="landing-nav">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 38, height: 38,
              background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 18, color: '#f1f5f9' }}>CuratorFlow AI</span>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Link href="/auth/login" style={{ textDecoration: 'none' }}>
              <button className="btn-secondary" style={{ padding: '9px 22px', fontSize: 14 }}>Войти</button>
            </Link>
            <Link href="/auth/register" style={{ textDecoration: 'none' }}>
              <button className="btn-primary" style={{ padding: '9px 22px', fontSize: 14 }}>Начать</button>
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="hero-grid" style={{ paddingTop: 100, paddingBottom: 100 }}>
          <div className="hero-content animate-in">
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              color: '#a78bfa', padding: '7px 16px', borderRadius: 50,
              fontSize: 13, fontWeight: 500, marginBottom: 28
            }}>
              <span className="pulse" style={{ width: 7, height: 7, background: '#8b5cf6', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 8px rgba(139,92,246,0.6)' }}></span>
              Платформа для колледжей
            </div>

            <h1 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, lineHeight: 1.08, marginBottom: 24 }}>
              <span style={{ color: '#f1f5f9' }}>Автоматизация{' '}</span>
              <br />
              <span style={{ color: '#f1f5f9' }}>работы </span>
              <span className="gradient-text-animated">куратора</span>
            </h1>

            <p style={{ fontSize: 17, color: '#94a3b8', lineHeight: 1.7, marginBottom: 40, maxWidth: 480 }}>
              CuratorFlow AI уменьшает административную нагрузку, повышает прозрачность отчётности студентов и гарантирует подлинность выполненных заданий.
            </p>

            <div className="hero-buttons">
              <Link href="/auth/register" style={{ textDecoration: 'none' }}>
                <button className="btn-primary" style={{ padding: '14px 32px', fontSize: 15, fontWeight: 600 }}>
                  Начать бесплатно
                  <span style={{ marginLeft: 8, display: 'inline-block', transition: 'transform 0.3s' }}>→</span>
                </button>
              </Link>
              <Link href="/auth/login" style={{ textDecoration: 'none' }}>
                <button className="btn-secondary" style={{ padding: '14px 32px', fontSize: 15, fontWeight: 500 }}>
                  Войти в систему
                </button>
              </Link>
            </div>
          </div>

          {/* Right side — stat cards */}
          <div className="hero-stats-grid">
            {[
              { val: '5+ ч', label: 'Экономия в неделю', gradient: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(99,102,241,0.08))' },
              { val: '−60%', label: 'Снижение фейков', gradient: 'linear-gradient(135deg, rgba(34,197,94,0.12), rgba(16,185,129,0.06))' },
              { val: '+30%', label: 'Рост дисциплины', gradient: 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(251,191,36,0.06))' },
              { val: 'Vision AI', label: 'Проверка скриншотов', gradient: 'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(244,63,94,0.06))' },
            ].map((s, i) => (
              <div key={i} className="card animate-in" style={{
                animationDelay: `${i * 0.12}s`,
                textAlign: 'center',
                background: s.gradient,
                border: '1px solid rgba(255,255,255,0.06)',
                padding: '28px 20px',
              }}>
                <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 26, fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.02em' }}>{s.val}</div>
                <div style={{ fontSize: 13, color: '#64748b', marginTop: 6 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Problems Section */}
        <section style={{ paddingBottom: 80, position: 'relative' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Проблемы</p>
            <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 36, fontWeight: 700, color: '#f1f5f9', lineHeight: 1.2, marginBottom: 12, letterSpacing: '-0.02em' }}>
              Реальная «боль» кураторов
            </h2>
            <p style={{ fontSize: 16, color: '#64748b', maxWidth: 500, margin: '0 auto' }}>
              Проблемы, которые CuratorFlow AI решает каждый день
            </p>
          </div>

          <div className="problems-grid">
            {[
              {
                title: 'Ручной сбор отчётов',
                desc: 'Кураторы тратят часы на агрегирование ссылок, файлов и скриншотов из мессенджеров — процесс медленный и ненадёжный.',
                glowColor: 'rgba(139, 92, 246, 0.08)'
              },
              {
                title: 'Потеря ссылок в чатах',
                desc: 'Важные материалы и доказательства выполнения заданий теряются в длинных чатах — проверка становится невозможной.',
                glowColor: 'rgba(99, 102, 241, 0.08)'
              },
              {
                title: 'Невозможность проверить тесты',
                desc: 'Фейковые отчёты и неподтверждённые скриншоты делают оценку недостоверной — куратор не уверен в реальном прогрессе.',
                glowColor: 'rgba(168, 85, 247, 0.08)'
              },
            ].map((p, i) => (
              <div key={i} className="card animate-in" style={{
                animationDelay: `${i * 0.1}s`,
                background: `linear-gradient(135deg, ${p.glowColor}, rgba(15, 20, 40, 0.7))`,
                borderTop: '1px solid rgba(139, 92, 246, 0.2)',
                padding: '32px 28px',
              }}>
                <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 17, fontWeight: 600, marginBottom: 12, color: '#f1f5f9' }}>{p.title}</h3>
                <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section style={{ paddingBottom: 80 }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Возможности</p>
            <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 36, fontWeight: 700, color: '#f1f5f9', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
              Мы защищаем, вы управляете
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {[
              { title: 'Vision AI', desc: 'Полная проверка скриншотов с помощью ИИ — автоматическая верификация результатов.' },
              { title: 'Кросс-платформа', desc: 'Работает на мобильных, веб и через API — единая экосистема.' },
              { title: 'Plug and Play', desc: 'Используйте с любым количеством групп, студентов и заданий.' },
              { title: 'Масштабируемость', desc: 'Каждый компонент автоматически масштабируется без потери производительности.' },
            ].map((f, i) => (
              <div key={i} className="card animate-in" style={{
                animationDelay: `${i * 0.08}s`,
                textAlign: 'center',
                padding: '32px 20px',
              }}>
                <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 15, fontWeight: 600, color: '#f1f5f9', marginBottom: 10 }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section style={{
          textAlign: 'center',
          padding: '80px 0',
          borderTop: '1px solid rgba(255,255,255,0.04)',
          position: 'relative',
        }}>
          <div className="glow-orb" style={{
            width: 500, height: 500,
            background: 'radial-gradient(circle, rgba(139,92,246,0.12), transparent 70%)',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
          }} />

          <p style={{ fontSize: 13, fontWeight: 500, color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16, position: 'relative' }}>Начните сейчас</p>
          <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 40, fontWeight: 800, marginBottom: 16, position: 'relative', letterSpacing: '-0.02em' }}>
            <span className="gradient-text">Готовы начать?</span>
          </h2>
          <p style={{ color: '#64748b', marginBottom: 36, fontSize: 17, position: 'relative' }}>
            Присоединяйтесь как куратор или студент
          </p>
          <div className="cta-buttons" style={{ position: 'relative' }}>
            <Link href="/auth/register?role=CURATOR" style={{ textDecoration: 'none' }}>
              <button className="btn-primary" style={{ padding: '14px 36px', fontSize: 15, fontWeight: 600 }}>
                Я куратор →
              </button>
            </Link>
            <Link href="/auth/register?role=STUDENT" style={{ textDecoration: 'none' }}>
              <button className="btn-secondary" style={{ padding: '14px 36px', fontSize: 15 }}>
                Я студент
              </button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer style={{
          borderTop: '1px solid rgba(255,255,255,0.04)',
          padding: '32px 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 28, height: 28,
              background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
              borderRadius: 7,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 600, fontSize: 14, color: '#64748b' }}>CuratorFlow AI</span>
          </div>
          <span style={{ fontSize: 13, color: '#475569' }}>© 2026 CuratorFlow. Все права защищены.</span>
        </footer>
      </div>
    </main>
  )
}
