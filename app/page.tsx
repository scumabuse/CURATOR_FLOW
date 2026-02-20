'use client'
import Link from 'next/link'
import ScrollReveal from '@/components/ScrollReveal'

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', background: '#030712', position: 'relative', overflow: 'hidden' }}>
      <div className="grid-bg" />

      <div className="glow-orb" style={{ width: 600, height: 600, background: 'radial-gradient(circle, rgba(139,92,246,0.15), transparent 70%)', top: -200, left: '50%', transform: 'translateX(-50%)' }} />
      <div className="glow-orb" style={{ width: 400, height: 400, background: 'radial-gradient(circle, rgba(99,102,241,0.1), transparent 70%)', top: 400, right: -100 }} />

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
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <Link href="/auth/login" style={{ textDecoration: 'none' }}>
              <button className="btn-secondary">Войти</button>
            </Link>
            <Link href="/auth/register" style={{ textDecoration: 'none' }}>
              <button className="btn-primary">Начать</button>
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="hero-grid" style={{ paddingTop: 80, paddingBottom: 80 }}>
          <div className="hero-content">
            <ScrollReveal direction="up" duration={0.7}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                color: '#a78bfa', padding: '7px 16px', borderRadius: 50,
                fontSize: 13, fontWeight: 500, marginBottom: 24
              }}>
                <span className="pulse" style={{ width: 7, height: 7, background: '#8b5cf6', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 8px rgba(139,92,246,0.6)' }}></span>
                Платформа для колледжей
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.1} duration={0.8}>
              <h1 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, lineHeight: 1.08, marginBottom: 20 }}>
                <span style={{ color: '#f1f5f9' }}>Автоматизация </span>
                <span style={{ color: '#f1f5f9' }}>работы </span>
                <span className="gradient-text-animated">куратора</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.2} duration={0.8}>
              <p className="hero-desc" style={{ fontSize: 16, color: '#94a3b8', lineHeight: 1.65, marginBottom: 32 }}>
                CuratorFlow AI снижает нагрузку на куратора, повышает прозрачность и проверяет подлинность заданий.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.3}>
              <div className="hero-buttons">
                <Link href="/auth/register" style={{ textDecoration: 'none' }}>
                  <button className="btn-primary" style={{ padding: '14px 32px', fontSize: 15, fontWeight: 600 }}>
                    Начать бесплатно →
                  </button>
                </Link>
                <Link href="/auth/login" style={{ textDecoration: 'none' }}>
                  <button className="btn-secondary" style={{ padding: '14px 32px', fontSize: 15, fontWeight: 500 }}>
                    Войти в систему
                  </button>
                </Link>
              </div>
            </ScrollReveal>
          </div>

          {/* Hero stat cards */}
          <div className="hero-stats-grid">
            {[
              { val: '5+ ч', label: 'Экономия / неделя' },
              { val: '−60%', label: 'Меньше фейков' },
              { val: '+30%', label: 'Рост дисциплины' },
              { val: 'AI', label: 'Проверка скриншотов' },
            ].map((s, i) => (
              <ScrollReveal key={i} direction="up" delay={i * 0.08} duration={0.6}>
                <div className="card hero-stat-card">
                  <div className="hero-stat-val">{s.val}</div>
                  <div className="hero-stat-label">{s.label}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Problems Section */}
        <section className="landing-section">
          <ScrollReveal direction="up">
            <div className="section-header">
              <p className="section-tag">Проблемы</p>
              <h2 className="section-title">Реальная «боль» кураторов</h2>
              <p className="section-subtitle">Проблемы, которые CuratorFlow AI решает каждый день</p>
            </div>
          </ScrollReveal>

          <div className="problems-grid">
            {[
              { title: 'Ручной сбор отчётов', desc: 'Кураторы тратят часы на сбор ссылок и скриншотов из мессенджеров.' },
              { title: 'Потеря данных в чатах', desc: 'Доказательства выполнения заданий теряются в длинных чатах.' },
              { title: 'Невозможность проверки', desc: 'Фейковые скриншоты делают оценку недостоверной.' },
            ].map((p, i) => (
              <ScrollReveal key={i} direction="up" delay={i * 0.1} duration={0.6}>
                <div className="card problem-card">
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="landing-section">
          <ScrollReveal direction="up">
            <div className="section-header">
              <p className="section-tag">Возможности</p>
              <h2 className="section-title">Мы защищаем, вы управляете</h2>
            </div>
          </ScrollReveal>

          <div className="features-grid">
            {[
              { title: 'Vision AI', desc: 'Проверка скриншотов с помощью ИИ.' },
              { title: 'Кросс-платформа', desc: 'Мобильные, веб и API.' },
              { title: 'Plug and Play', desc: 'Любое количество групп.' },
              { title: 'Масштабируемость', desc: 'Растёт вместе с вами.' },
            ].map((f, i) => (
              <ScrollReveal key={i} direction="up" delay={i * 0.08} duration={0.5}>
                <div className="card feature-card">
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="landing-section cta-section">
          <ScrollReveal direction="up">
            <p className="section-tag">Начните сейчас</p>
            <h2 className="section-title gradient-text">Готовы начать?</h2>
            <p className="section-subtitle" style={{ marginBottom: 32 }}>Присоединяйтесь как куратор или студент</p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.15}>
            <div className="cta-buttons">
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
          </ScrollReveal>
        </section>

        {/* Footer */}
        <footer className="landing-footer">
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
