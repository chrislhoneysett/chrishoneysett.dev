import { HeroProjectCarousel } from './HeroProjectCarousel'
import { selectedProjects } from '@/data/selectedProjects'
import { profile } from '@/data/profile'
import { Arrow } from '../../Arrow'
import styles from './Hero.module.css'

const featuredProjects = selectedProjects.map((project) => {
  if (!project.heroImage)
    throw new Error(`Missing featured project image: ${project.id}`)
  return {
    id: project.id,
    name: project.name,
    type: project.type,
    image: project.heroImage,
    technologies: project.technologies,
  }
})

export function HeroSection() {
  return (
    <header className={styles.hero}>
      <div className={styles.heroTopline}>
        <span>{profile.headline}</span>
        <span>Kalamazoo, Michigan · Working across disciplines</span>
      </div>
      <div className={styles.heroMain}>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>
            <span className={styles.kickerDot} /> Engineering informed by
            graphic design
          </p>
          <h1>
            Making
            <br />
            <em>complex</em>
            <br />
            feel clear<span className={styles.period}>.</span>
          </h1>
          <p className={styles.heroLead}>
            I build web and mobile products with React and React Native, taking
            responsibility from early planning through release and the
            improvements that follow. I work closely with clients, designers,
            and engineers to turn complex needs into software that is clear,
            useful, and maintainable.
          </p>
          <div className={styles.heroActions}>
            <a className={styles.primaryLink} href='#work'>
              View projects <Arrow />
            </a>
            <a className={styles.secondaryLink} href='#experience'>
              Career background <span aria-hidden='true'>↓</span>
            </a>
          </div>
        </div>
        <HeroProjectCarousel slides={featuredProjects} />
      </div>
      <div className={styles.heroFooter}>
        <div>
          <strong>
            28<span>+</span>
          </strong>
          <small>
            years across graphic design
            <br />
            &amp; software development
          </small>
        </div>
        <div>
          <strong>
            17<span>+</span>
          </strong>
          <small>
            years guiding
            <br />
            frontend projects
          </small>
        </div>
        <div>
          <strong>Web / Mobile</strong>
          <small>
            from interface systems
            <br />
            to connected devices
          </small>
        </div>
        <a href='#work'>
          Scroll to explore <span aria-hidden='true'>↓</span>
        </a>
      </div>
    </header>
  )
}
