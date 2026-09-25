'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import PauseIcon from '@mui/icons-material/Pause'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { Arrow } from '../../Arrow'
import styles from './HeroProjectCarousel.module.css'

export interface HeroProjectSlide {
  id: string
  name: string
  type: string
  image: {
    src: string
    kind?: 'illustration'
  }
  technologies: string[]
}

export function HeroProjectCarousel({ slides }: { slides: HeroProjectSlide[] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [interacting, setInteracting] = useState(false)
  const activeSlide = slides[activeIndex]

  useEffect(() => {
    if (paused || interacting || slides.length < 2) return

    const interval = window.setInterval(() => {
      if (
        !document.hidden &&
        !window.matchMedia('(max-width: 760px)').matches &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ) {
        setActiveIndex((index) => (index + 1) % slides.length)
      }
    }, 7000)

    return () => window.clearInterval(interval)
  }, [interacting, paused, slides.length])

  function showRelativeSlide(offset: number) {
    setPaused(true)
    setActiveIndex((index) => (index + offset + slides.length) % slides.length)
  }

  return (
    <div
      className={styles.showcase}
      role='region'
      aria-roledescription='carousel'
      aria-label='Featured projects'
      onMouseEnter={() => setInteracting(true)}
      onMouseLeave={() => setInteracting(false)}
      onFocusCapture={() => setPaused(true)}
    >
      <div className={styles.toolbar}>
        <span>
          SELECTED WORK / {String(activeIndex + 1).padStart(2, '0')} OF{' '}
          {String(slides.length).padStart(2, '0')}
        </span>
        <div className={styles.controls}>
          <button
            type='button'
            aria-label='Previous project'
            onClick={() => showRelativeSlide(-1)}
          >
            <ArrowBackIcon fontSize='inherit' />
          </button>
          <button
            type='button'
            aria-label={paused ? 'Play slideshow' : 'Pause slideshow'}
            onClick={() => {
              setInteracting(false)
              setPaused((value) => !value)
            }}
          >
            {paused ? <PlayArrowIcon fontSize='inherit' /> : <PauseIcon fontSize='inherit' />}
          </button>
          <button
            type='button'
            aria-label='Next project'
            onClick={() => showRelativeSlide(1)}
          >
            <ArrowForwardIcon fontSize='inherit' />
          </button>
        </div>
      </div>
      <a
        className={styles.projectLink}
        href={`#project-${activeSlide.id}`}
        aria-label={`View ${activeSlide.name} in selected work`}
      >
        <span className={styles.imageStage} aria-hidden='true'>
          {slides.map((slide, index) => (
            <span
              className={styles.imageLayer}
              data-active={index === activeIndex}
              data-illustration={slide.image.kind === 'illustration'}
              key={slide.id}
            >
              <Image
                src={slide.image.src}
                alt=''
                fill
                sizes='(max-width: 760px) 100vw, (max-width: 1050px) 45vw, 40vw'
                style={{ objectFit: 'cover', objectPosition: '67% center' }}
                loading='lazy'
              />
            </span>
          ))}
        </span>
        <span className={styles.caption}>
          {slides.map((slide, index) => (
            <span
              className={styles.captionLayer}
              data-active={index === activeIndex}
              aria-hidden={index !== activeIndex}
              key={slide.id}
            >
              <span>
                <strong>{slide.name}</strong>
                <small>
                  {slide.type} · {slide.technologies.slice(0, 3).join(' · ')}
                </small>
              </span>
              <span className={styles.arrow}><Arrow /></span>
            </span>
          ))}
        </span>
      </a>
      <span className={styles.srOnly} aria-live={paused ? 'polite' : 'off'}>
        {activeIndex + 1} of {slides.length}: {activeSlide.name}
      </span>
    </div>
  )
}
