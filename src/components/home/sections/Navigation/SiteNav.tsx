'use client'

import { useEffect, useState } from 'react'
import { ThemeToggle } from './ThemeToggle'
import { ContactDialog } from '@/components/ContactDialog'
import { profile } from '@/data/profile'
import styles from './Navigation.module.css'

export function SiteNav() {
  const [activeSection, setActiveSection] = useState('')
  const [scrollMode, setScrollMode] = useState<'top' | 'scrolled'>('top')

  useEffect(() => {
    const updateScrollMode = () => {
      setScrollMode(window.scrollY <= 20 ? 'top' : 'scrolled')
    }

    updateScrollMode()
    window.addEventListener('scroll', updateScrollMode, { passive: true })
    return () => window.removeEventListener('scroll', updateScrollMode)
  }, [])

  useEffect(() => {
    const sections = ['work', 'experience', 'about']
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null)
    const navHeight = document
      .querySelector('nav[aria-label="Main navigation"]')
      ?.getBoundingClientRect().height ?? 0
    const activeOffset = window.innerWidth <= 760 ? 24 : Math.ceil(navHeight)

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visibleSections.length > 0) {
          setActiveSection(visibleSections[0].target.id)
        }
      },
      {
        rootMargin: `-${activeOffset}px 0px -68% 0px`,
        threshold: 0,
      },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <nav className={styles.nav} data-scroll-mode={scrollMode} aria-label='Main navigation'>
      <div className={styles.navIdentity}>
        <a
          className={styles.wordmark}
          href='#top'
          aria-label={`${profile.name}, top of page`}
        >
          <span className={styles.mark} aria-hidden='true'>
            <span className={styles.markInitials}>
              CH<span className={styles.markPeriod}>.</span>
            </span>
          </span>
          <span>{profile.name}</span>
        </a>
        <div className={styles.navEnd}>
          <ThemeToggle />
          <ContactDialog
            id='nav-contact'
            className={styles.navContact}
            label="Let's talk"
          />
        </div>
      </div>
      <div className={styles.navLinks}>
        <a
          className={activeSection === 'work' ? styles.activeLink : undefined}
          href='#work'
          aria-current={activeSection === 'work' ? 'location' : undefined}
        >
          Work
        </a>
        <a
          className={activeSection === 'experience' ? styles.activeLink : undefined}
          href='#experience'
          aria-current={activeSection === 'experience' ? 'location' : undefined}
        >
          Experience
        </a>
        <a
          className={activeSection === 'about' ? styles.activeLink : undefined}
          href='#about'
          aria-current={activeSection === 'about' ? 'location' : undefined}
        >
          About
        </a>
      </div>
    </nav>
  )
}
