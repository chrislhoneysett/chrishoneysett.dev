'use client'

import { useEffect, useRef, useState } from 'react'
import type { ResumeProject } from '@/domains/development/types/resume'
import styles from './ProjectGallery.module.css'

type ProjectGalleryItem = ResumeProject & { employer: string }

export function ProjectGallery({ projects }: { projects: readonly ProjectGalleryItem[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const dialogContentRef = useRef<HTMLDivElement>(null)
  const [activeProject, setActiveProject] = useState<ProjectGalleryItem | null>(null)
  const activeIndex = activeProject ? projects.findIndex((project) => project.id === activeProject.id) : -1

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (activeProject) {
      if (!dialog.open) dialog.showModal()
      dialog.scrollTop = 0
      if (dialogContentRef.current) dialogContentRef.current.scrollTop = 0
    } else if (dialog.open) {
      dialog.close()
    }
  }, [activeProject])

  function closeDialog() {
    dialogRef.current?.close()
    setActiveProject(null)
  }

  function showRelativeProject(offset: number) {
    if (activeIndex < 0 || projects.length < 2) return
    setActiveProject(projects[(activeIndex + offset + projects.length) % projects.length])
  }

  return (
    <>
      <div className={styles.grid}>
        {projects.map((project, index) => (
          <article className={styles.card} id={`project-${project.id}`} key={project.id}>
            <div
              className={`${styles.visual} ${styles[`visual${(index % 3) + 1}`]} ${project.heroImage?.kind === 'illustration' ? styles.withIllustration : project.heroImage ? styles.withScreenshot : ''}`}
              aria-hidden='true'
            >
              {project.heroImage ? (
                <img className={project.heroImage.kind === 'illustration' ? styles.heroIllustration : styles.heroScreenshot} src={project.heroImage.src} alt='' />
              ) : null}
              <span className={styles.visualType}>{project.type}</span>
              <span className={styles.shape} />
              {project.projectOrigin ? <span className={styles.originBanner}>{project.projectOrigin}</span> : null}
            </div>
            <div className={styles.cardBody}>
              <div className={styles.meta}>
                <span>{project.employer}</span>
                <span>{project.type}</span>
              </div>
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <ul className={styles.tags} aria-label='Technologies used'>
                {project.technologies.map((technology) => <li key={technology}>{technology}</li>)}
              </ul>
              <button className={styles.openButton} type='button' onClick={() => setActiveProject(project)}>
                View project <span aria-hidden='true'>↗</span>
              </button>
            </div>
          </article>
        ))}
      </div>

      <dialog
        className={styles.dialog}
        ref={dialogRef}
        aria-labelledby='project-dialog-title'
        onClose={() => setActiveProject(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeDialog()
        }}
        onKeyDown={(event) => {
          if (event.altKey || event.ctrlKey || event.metaKey) return
          if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault()
            showRelativeProject(event.key === 'ArrowLeft' ? -1 : 1)
          }
        }}
      >
        {activeProject && (
          <div className={styles.dialogContent} ref={dialogContentRef}>
            <button className={styles.closeButton} type='button' onClick={closeDialog} aria-label='Close project details'>
              ×
            </button>
            {projects.length > 1 ? (
              <nav className={styles.dialogNavigation} aria-label='Project navigation'>
                <button type='button' onClick={() => showRelativeProject(-1)} aria-label={`Previous project: ${projects[(activeIndex - 1 + projects.length) % projects.length].name}`}>
                  <span aria-hidden='true'>←</span> Previous
                </button>
                <span aria-live='polite'>Project {activeIndex + 1} of {projects.length}</span>
                <button type='button' onClick={() => showRelativeProject(1)} aria-label={`Next project: ${projects[(activeIndex + 1) % projects.length].name}`}>
                  Next <span aria-hidden='true'>→</span>
                </button>
              </nav>
            ) : null}
            <p className={styles.dialogEyebrow}>
              {activeProject.employer} · {activeProject.type}
            </p>
            {activeProject.client && activeProject.client !== activeProject.employer ? (
              <p className={styles.clientLine}>Client: {activeProject.client}</p>
            ) : null}
            <h2 id='project-dialog-title'>{activeProject.name}</h2>
            <p className={styles.overview}>
              {activeProject.modal?.overview ?? activeProject.description}
            </p>
            <div className={styles.detailGrid}>
              <section>
                <h3>My contribution</h3>
                <p>{activeProject.modal?.contribution ?? activeProject.resumeHighlight}</p>
              </section>
              <section>
                <h3>Technology</h3>
                <ul className={styles.tags}>
                  {activeProject.technologies.map((technology) => <li key={technology}>{technology}</li>)}
                </ul>
                {activeProject.platforms?.length ? <p className={styles.platforms}>{activeProject.platforms.join(' · ')}</p> : null}
              </section>
            </div>
            {activeProject.modal?.highlights.length ? (
              <section className={styles.highlights}>
                <h3>Project highlights</h3>
                <ul>
                  {activeProject.modal.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
                </ul>
              </section>
            ) : null}
            {activeProject.modal?.screenshots.length ? (
              <section className={styles.gallery} aria-label='Project screenshots'>
                <h3>Site screenshots</h3>
                <div className={styles.screenshotGrid}>
                  {activeProject.modal.screenshots.map((screenshot) => (
                    <figure key={screenshot.src}>
                      <img src={screenshot.src} alt={screenshot.alt} />
                      <figcaption>{screenshot.caption}</figcaption>
                    </figure>
                  ))}
                </div>
              </section>
            ) : null}
            {activeProject.confidentialityNote ? (
              <p className={styles.confidentialityNote}>{activeProject.confidentialityNote}</p>
            ) : null}
            <div className={styles.dialogFooter}>
              {activeProject.modal?.liveUrl ? (
                <a href={activeProject.modal.liveUrl} target='_blank' rel='noreferrer'>Visit live site <span aria-hidden='true'>↗</span></a>
              ) : null}
              <button type='button' onClick={closeDialog}>Close details</button>
            </div>
          </div>
        )}
      </dialog>
    </>
  )
}
