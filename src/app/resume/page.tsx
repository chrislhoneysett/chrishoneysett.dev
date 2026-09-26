import type { Metadata } from 'next'
import Link from 'next/link'
import { profile } from '@/data/profile'
import { ResumeDownload } from '@/components/resume/ResumeDownload'
import styles from './resume.module.css'

export const metadata: Metadata = {
  title: `${profile.name} - Resume`,
  description: `Download ${profile.name}'s resume, including experience, capabilities, and selected project highlights.`,
}

export default function ResumePage() {
  return (
    <main className={styles.page}>
      <Link className={styles.back} href='/'>← Back to the site</Link>
      <div className={styles.content}>
        <ResumeDownload headingLevel='h1' />
      </div>
    </main>
  )
}
