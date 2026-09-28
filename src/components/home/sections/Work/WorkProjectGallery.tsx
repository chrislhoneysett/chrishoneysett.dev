'use client'

import { useEffect, useRef, useState } from 'react'
import { Icon } from '@/components/Icon'
import type { ResumeProject } from '@/data/projects'
import styles from './WorkProjectGallery.module.css'
import { WorkProjectCard } from './WorkProjectCard'
import { assetPath } from '@/lib/assetPath'

type WorkProjectGalleryItem = ResumeProject & { employer: string }

export function WorkProjectGallery({
  projects,
  moreProjects,
}: {
  projects: readonly WorkProjectGalleryItem[]
  moreProjects: readonly WorkProjectGalleryItem[]
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const dialogContentRef = useRef<HTMLDivElement>(null)
  const [showMore, setShowMore] = useState(false)
  const [activeProject, setActiveProject] = useState<WorkProjectGalleryItem | null>(
    null,
  )
  const visibleProjects = showMore ? [...projects, ...moreProjects] : projects
  const activeIndex = activeProject
    ? visibleProjects.findIndex((project) => project.id === activeProject.id)
    : -1

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
    if (activeIndex < 0 || visibleProjects.length < 2) return
    setActiveProject(
      visibleProjects[(activeIndex + offset + visibleProjects.length) % visibleProjects.length],
    )
  }

  return (
    <>
      <div className={styles.grid}>
        {projects.map((project, index) => (
          <WorkProjectCard
            key={project.id}
            project={project}
            index={index}
            onClick={() => setActiveProject(project)}
          />
        ))}
      </div>

      {moreProjects.length > 0 ? (
        <>
          <div className={styles.moreControls}>
            <button
              className={styles.moreButton}
              type='button'
              aria-controls='more-projects'
              aria-expanded={showMore}
              aria-label={showMore ? 'Show fewer projects' : `Show ${moreProjects.length} more projects`}
              onClick={() => setShowMore((value) => !value)}
            >
              {showMore ? 'Less' : 'More'}
              <Icon name='arrow-downward' className={`${styles.moreChevron} ${showMore ? styles.moreChevronUp : ''}`} />
            </button>
          </div>
          <div
            className={`${styles.moreReveal} ${showMore ? styles.moreRevealOpen : ''}`}
            id='more-projects'
            inert={!showMore}
            aria-hidden={!showMore}
          >
            <div className={styles.moreRevealInner}>
              <div className={`${styles.grid} ${styles.extraGrid}`}>
                {moreProjects.map((project, index) => (
                  <WorkProjectCard
                    key={project.id}
                    project={project}
                    index={projects.length + index}
                    onClick={() => setActiveProject(project)}
                  />
                ))}
              </div>
            </div>
          </div>
        </>
      ) : null}

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
            <button
              className={styles.closeButton}
              type='button'
              onClick={closeDialog}
              aria-label='Close project details'
            >
              <Icon name='close' />
            </button>
            {visibleProjects.length > 1 ? (
              <nav
                className={styles.dialogNavigation}
                aria-label='Project navigation'
              >
                <button
                  type='button'
                  onClick={() => showRelativeProject(-1)}
                  aria-label={`Previous project: ${visibleProjects[(activeIndex - 1 + visibleProjects.length) % visibleProjects.length].name}`}
                >
                  <Icon name='arrow-back' /> Previous
                </button>
                <span aria-live='polite'>
                  Project {activeIndex + 1} of {visibleProjects.length}
                </span>
                <button
                  type='button'
                  onClick={() => showRelativeProject(1)}
                  aria-label={`Next project: ${visibleProjects[(activeIndex + 1) % visibleProjects.length].name}`}
                >
                  Next <Icon name='arrow-forward' />
                </button>
              </nav>
            ) : null}
            <p className={styles.dialogEyebrow}>
              {activeProject.employer} · {activeProject.type}
            </p>
            {activeProject.client &&
            activeProject.client !== activeProject.employer ? (
              <p className={styles.clientLine}>
                Client: {activeProject.client}
              </p>
            ) : null}
            <h2 id='project-dialog-title'>{activeProject.name}</h2>
            <p className={styles.overview}>
              {activeProject.modal?.overview ?? activeProject.description}
            </p>
            <div className={styles.detailGrid}>
              <section>
                <h3>My contribution</h3>
                <p>
                  {activeProject.modal?.contribution ??
                    activeProject.resumeHighlight}
                </p>
              </section>
              <section>
                <h3>Technology</h3>
                <ul className={styles.tags}>
                  {activeProject.technologies.map((technology) => (
                    <li key={technology}>{technology}</li>
                  ))}
                </ul>
                {activeProject.platforms?.length ? (
                  <p className={styles.platforms}>
                    {activeProject.platforms.join(' · ')}
                  </p>
                ) : null}
              </section>
            </div>
            {activeProject.modal?.highlights.length ? (
              <section className={styles.highlights}>
                <h3>Project highlights</h3>
                <ul>
                  {activeProject.modal.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </section>
            ) : null}
            {activeProject.modal?.screenshots.length ? (
              <section
                className={styles.gallery}
                aria-label='Project screenshots'
              >
                <h3>Site screenshots</h3>
                <div className={styles.screenshotGrid}>
                  {activeProject.modal.screenshots.map((screenshot) => (
                    <figure key={screenshot.src}>
                      <img src={assetPath(screenshot.src)} alt={screenshot.alt} />
                      <figcaption>{screenshot.caption}</figcaption>
                    </figure>
                  ))}
                </div>
              </section>
            ) : null}
            {activeProject.confidentialityNote ? (
              <p className={styles.confidentialityNote}>
                {activeProject.confidentialityNote}
              </p>
            ) : null}
            <div className={styles.dialogFooter}>
              {activeProject.modal?.liveUrl ? (
                <a
                  href={activeProject.modal.liveUrl}
                  target='_blank'
                  rel='noreferrer'
                >
                  Visit live site <Icon name='north-east' />
                </a>
              ) : null}
              <button type='button' onClick={closeDialog}>
                Close details
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  )
}
