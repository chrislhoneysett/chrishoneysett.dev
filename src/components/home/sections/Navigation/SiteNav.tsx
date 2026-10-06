'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ThemeToggle } from './ThemeToggle'
import { ContactDialog } from '@/components/ContactDialog'
import { profile } from '@/data/profile'
import { assetPath } from '@/lib/assetPath'
import styles from './Navigation.module.css'

export function SiteNav() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const isBlog = pathname.startsWith('/blog')
  const homeSection = (id: string) => isHome ? `#${id}` : assetPath(`/#${id}`)
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
    const sections = ['work', 'experience', 'about', 'resume']
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null)
    const navHeight =
      document
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
        // IntersectionObserver resolves percentage margins against width.
        // Use viewport height so the active region stays usable on wide screens.
        rootMargin: `-${activeOffset}px 0px -${Math.round(window.innerHeight * 0.68)}px 0px`,
        threshold: 0,
      },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [pathname])

  return (
    <nav
      className={styles.nav}
      data-scroll-mode={scrollMode}
      aria-label='Main navigation'
    >
      <div className={styles.navIdentity}>
        <a
          className={styles.wordmark}
          href={homeSection('top')}
          aria-label={`${profile.name}, home`}
        >
          <Image
            className={styles.mark}
            src={assetPath('/H.svg')}
            alt=''
            width={44}
            height={44}
            loading='eager'
          />
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
          className={isHome && activeSection === 'work' ? styles.activeLink : undefined}
          href={homeSection('work')}
          aria-current={isHome && activeSection === 'work' ? 'location' : undefined}
        >
          Work
        </a>
        <a
          className={
            isHome && activeSection === 'experience' ? styles.activeLink : undefined
          }
          href={homeSection('experience')}
          aria-current={isHome && activeSection === 'experience' ? 'location' : undefined}
        >
          Experience
        </a>
        <a
          className={isHome && activeSection === 'about' ? styles.activeLink : undefined}
          href={homeSection('about')}
          aria-current={isHome && activeSection === 'about' ? 'location' : undefined}
        >
          About
        </a>
        <a
          className={isHome && activeSection === 'resume' ? styles.activeLink : undefined}
          href={homeSection('resume')}
          aria-current={isHome && activeSection === 'resume' ? 'location' : undefined}
        >
          Resume
        </a>
        <Link href='/blog/' className={isBlog ? styles.activeLink : undefined} aria-current={isBlog ? 'page' : undefined}>
          Blog
        </Link>
      </div>
    </nav>
  )
}
