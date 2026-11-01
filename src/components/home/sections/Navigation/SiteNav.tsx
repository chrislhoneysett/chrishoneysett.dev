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
  useEffect(() => {
    const sections = ['work', 'background', 'resume']
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null)
    const nav = document.querySelector('nav[aria-label="Main navigation"]')
    if (!nav || !sections.length) return

    let frame = 0
    const updateActiveSection = () => {
      frame = 0
      // Read every section, rather than only the entries that changed visibility.
      // The extra space covers anchor padding and gives headings room below nav.
      const activationLine = nav.getBoundingClientRect().bottom + 48
      let current = ''
      for (const section of sections) {
        const bounds = section.getBoundingClientRect()
        if (bounds.top <= activationLine && bounds.bottom > activationLine) {
          current = section.id
        }
      }
      setActiveSection(current)
    }
    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateActiveSection)
    }
    const resizeObserver = new ResizeObserver(scheduleUpdate)
    resizeObserver.observe(document.body)
    resizeObserver.observe(nav)
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    scheduleUpdate()

    return () => {
      window.cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
    }
  }, [pathname])

  return (
    <nav
      className={styles.nav}
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
          className={isHome && activeSection === 'background' ? styles.activeLink : undefined}
          href={homeSection('background')}
          aria-current={isHome && activeSection === 'background' ? 'location' : undefined}
        >
          Background
        </a>
        <a
          className={isHome && activeSection === 'resume' ? styles.activeLink : undefined}
          href={homeSection('resume')}
          aria-current={isHome && activeSection === 'resume' ? 'location' : undefined}
        >
          Resume
        </a>
        <span className={styles.pageDivider} aria-hidden='true' />
        <Link href='/blog/' className={isBlog ? styles.activeLink : undefined} aria-current={isBlog ? 'page' : undefined}>
          Blog
        </Link>
      </div>
    </nav>
  )
}
