'use client'
import { useEffect, useRef, ReactNode } from 'react'

type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade'

interface ScrollRevealProps {
    children: ReactNode
    direction?: RevealDirection
    delay?: number
    duration?: number
    className?: string
    style?: React.CSSProperties
    threshold?: number
    once?: boolean
}

export default function ScrollReveal({
    children,
    direction = 'up',
    delay = 0,
    duration = 0.6,
    className = '',
    style = {},
    threshold = 0.15,
    once = false,
}: ScrollRevealProps) {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add('sr-visible')
                    if (once) observer.unobserve(el)
                } else if (!once) {
                    el.classList.remove('sr-visible')
                }
            },
            { threshold, rootMargin: '0px 0px -40px 0px' }
        )

        observer.observe(el)
        return () => observer.disconnect()
    }, [threshold, once])

    return (
        <div
            ref={ref}
            className={`sr sr-${direction} ${className}`}
            style={{
                transitionDelay: `${delay}s`,
                transitionDuration: `${duration}s`,
                ...style,
            }}
        >
            {children}
        </div>
    )
}
