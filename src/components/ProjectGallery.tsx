'use client'

import { useEffect, useRef, useState } from 'react'
import type { ResumeProject } from '@/domains/development/types/resume'
import styles from './ProjectGallery.module.css'

type ProjectGalleryItem = ResumeProject & { employer: string }

export function ProjectGallery({ projects }: { projects: readonly ProjectGalleryItem[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [activeProject, setActiveProject] = useState<ProjectGalleryItem | null>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (activeProject && !dialog.open) dialog.showModal()
    if (!activeProject && dialog.open) dialog.close()
  }, [activeProject])

  function closeDialog() {
    dialogRef.current?.close()
    setActiveProject(null)
  }

  return (
    <>
      <div className={styles.grid}>
        {projects.map((project, index) => (
          <article className={styles.card} key={project.id}>
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
      >
        {activeProject && (
          <div className={styles.dialogContent}>
            <button className={styles.closeButton} type='button' onClick={closeDialog} aria-label='Close project details'>
              ×
            </button>
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
