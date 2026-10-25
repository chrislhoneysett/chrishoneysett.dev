'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import styles from './ScrollReveals.module.css'

const REVEAL_INSET = 160

/** Enhance server-rendered content without hiding anything before hydration. */
export function ScrollReveals({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root || !('IntersectionObserver' in window)) return

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const elements = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]:not([data-reveal^="line-"])'))
    const revealed = new Set<HTMLElement>()
    function revealEntries(entries: IntersectionObserverEntry[]) {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const target = entry.target as HTMLElement
        const targets = target.hasAttribute('data-reveal-group')
          ? target.querySelectorAll<HTMLElement>('[data-reveal]')
          : [target]
        for (const element of targets) {
          if (revealed.has(element)) continue
          element.dataset.revealState = 'entering'
          revealed.add(element)
        }
        observer.unobserve(target)
        footerObserver.unobserve(target)
      }
    }

    const observer = new IntersectionObserver(
      revealEntries,
      // Let content travel into the viewport before starting its reveal.
      { rootMargin: `0px 0px -${REVEAL_INSET}px 0px`, threshold: 0 },
    )
    // A collapsed footer near the page end cannot always reach the usual inset.
    const footerObserver = new IntersectionObserver(revealEntries)

    function updateMotion() {
      observer.disconnect()
      footerObserver.disconnect()
      for (const element of elements) {
        delete element.dataset.revealState
        if (motionPreference.matches || revealed.has(element)) continue

        // Keep the initial viewport and restored scroll positions immediately visible.
        const trigger = element.closest<HTMLElement>('[data-reveal-group]') ?? element
        if (trigger.getBoundingClientRect().top < window.innerHeight) {
          revealed.add(element)
          continue
        }
        element.dataset.revealState = 'pending'
        if (element.dataset.reveal === 'contact') {
          footerObserver.observe(trigger)
        } else {
          observer.observe(trigger)
        }
      }
    }

    function revealFocusedContent(event: FocusEvent) {
      if (!(event.target instanceof Element)) return
      const element = event.target.closest<HTMLElement>('[data-reveal]')
      if (!element) return
      const openingContact = element.dataset.reveal === 'contact' && element.hasAttribute('data-reveal-state')
      delete element.dataset.revealState
      revealed.add(element)
      observer.unobserve(element)
      footerObserver.unobserve(element)
      if (openingContact) element.scrollIntoView({ block: 'nearest', behavior: 'instant' })
    }

    function finishReveal(event: AnimationEvent) {
      if (event.target instanceof HTMLElement && event.target.dataset.revealState === 'entering') {
        delete event.target.dataset.revealState
      }
    }

    updateMotion()
    motionPreference.addEventListener('change', updateMotion)
    root.addEventListener('focusin', revealFocusedContent)
    root.addEventListener('animationend', finishReveal)

    return () => {
      observer.disconnect()
      footerObserver.disconnect()
      motionPreference.removeEventListener('change', updateMotion)
      root.removeEventListener('focusin', revealFocusedContent)
      root.removeEventListener('animationend', finishReveal)
      for (const element of elements) delete element.dataset.revealState
    }
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const lines = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal^="line-"]'))
    const unfinished = new Set(lines)
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0

    function clearLine(line: HTMLElement) {
      delete line.dataset.revealState
      line.style.removeProperty('--line-progress')
    }

    function updateLines() {
      frame = 0
      if (motionPreference.matches) return

      const start = window.innerHeight - REVEAL_INSET
      // Draw over the next 40% of the viewport, following scroll rather than time.
      const distance = Math.max(REVEAL_INSET, window.innerHeight * 0.4)
      const positions = Array.from(unfinished, line => ({ line, top: line.getBoundingClientRect().top }))
      for (const { line, top } of positions) {
        const progress = Math.min(1, Math.max(0, (start - top) / distance))
        if (progress === 1) {
          unfinished.delete(line)
          clearLine(line)
        } else {
          line.dataset.revealState = 'drawing'
          line.style.setProperty('--line-progress', String(progress))
        }
      }
    }

    function scheduleUpdate() {
      if (!frame && unfinished.size && !motionPreference.matches) {
        frame = window.requestAnimationFrame(updateLines)
      }
    }

    function updateMotion() {
      window.cancelAnimationFrame(frame)
      frame = 0
      for (const line of lines) clearLine(line)
      updateLines()
    }

    updateMotion()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    motionPreference.addEventListener('change', updateMotion)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      motionPreference.removeEventListener('change', updateMotion)
      for (const line of lines) clearLine(line)
    }
  }, [])

  return <main id='top' ref={rootRef} className={styles.root}>{children}</main>
}
