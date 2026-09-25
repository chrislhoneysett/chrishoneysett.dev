import { ThemeToggle } from '@/components/ThemeToggle'
import { ProjectGallery } from '@/components/ProjectGallery'
import { HeroShowcase } from '@/components/HeroShowcase'
import { ContactDialog } from '@/components/ContactDialog'
import { resume } from '@/domains/development/data/resume'
import styles from './page.module.css'

const projects = [...resume.experience, ...resume.additionalExperience]
  .flatMap((role) =>
    role.projects
      .filter((project) => !project.hidden)
      .map((project) => ({ ...project, employer: role.company })),
  )

const featuredProjects = [
  'charity-water',
  'auris',
  'connected-battery-management',
  'ford-quicklane',
].map((id) => {
  const project = projects.find((item) => item.id === id)
  if (!project?.heroImage) throw new Error(`Missing featured project image: ${id}`)
  return {
    id: project.id,
    name: project.name,
    type: project.type,
    image: project.heroImage,
    technologies: project.technologies,
  }
})

function Arrow() {
  return <span aria-hidden='true'>↗</span>
}

export default function Home() {
  return (
    <main id='top'>
      <div className={styles.shell}>
        <nav className={styles.nav} aria-label='Main navigation'>
          <a
            className={styles.wordmark}
            href='#top'
            aria-label='Chris Honeysett, top of page'
          >
            <span className={styles.mark}>
              CH<span>.</span>
            </span>
            <span>Chris Honeysett</span>
          </a>
          <div className={styles.navLinks}>
            <a href='#work'>Work</a>
            <a href='#experience'>Experience</a>
            <a href='#about'>About</a>
          </div>
          <div className={styles.navEnd}>
            <ThemeToggle />
            <ContactDialog id='nav-contact' email={resume.email} className={styles.navContact} label="Let's talk" />
          </div>
        </nav>

        <header className={styles.hero}>
          <div className={styles.heroTopline}>
            <span>{resume.headline}</span>
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
                I build web and mobile products with React and React Native,
                taking responsibility from early planning through release and
                the improvements that follow. I work closely with clients,
                designers, and engineers to turn complex needs into software
                that is clear, useful, and maintainable.
              </p>
              <div className={styles.heroActions}>
                <a className={styles.primaryLink} href='#work'>
                  View projects <Arrow />
                </a>
                <a className={styles.secondaryLink} href='#about'>
                  Career background <span aria-hidden='true'>↓</span>
                </a>
              </div>
            </div>
            <HeroShowcase slides={featuredProjects} />
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
      </div>

      <section className={styles.work} id='work' aria-labelledby='work-title'>
        <div className={styles.sectionHeader}>
          <p className={styles.sectionLabel}>01 / Selected work</p>
          <div>
            <h2 id='work-title'>
              Web, mobile,
              <br />
              <em>and systems work.</em>
            </h2>
            <p>
              Every project has its own people, constraints, and moving parts.
              I work with clients and teammates to understand what matters,
              connect the pieces, and shape an experience that feels clear to
              the people using it.
            </p>
            <p className={styles.workNote}>
              Some project names, imagery, and details are kept general to
              respect client confidentiality.
            </p>
          </div>
        </div>
        <ProjectGallery projects={projects} />
      </section>

      <section className={styles.statement} aria-labelledby='statement-title'>
        <p className={styles.sectionLabel}>02 / Career path</p>
        <div>
          <h2 id='statement-title'>
            Each step builds <em>on the last.</em>
          </h2>
          <div className={styles.principles}>
            <article>
              <span>01</span>
              <h3>Print</h3>
              <p>
                I began in print production and graphic design. As the print
                business declined, I recognized that digital work was where I
                needed to go next.
              </p>
            </article>
            <article>
              <span>02</span>
              <h3>Flash</h3>
              <p>
                I learned Flash and ActionScript and started building
                interactive experiences, bringing my design background into a
                new medium.
              </p>
            </article>
            <article>
              <span>03</span>
              <h3>Web</h3>
              <p>
                When Flash faded, I moved into web development, first with HTML
                and CSS, then with JavaScript applications built in React and
                Vue.
              </p>
            </article>
            <article>
              <span>04</span>
              <h3>Mobile Apps</h3>
              <p>
                At Twisthink, I moved into React Native apps for connected
                products, owning the mobile experience and coordinating work
                across hardware, cloud services, and design.
              </p>
            </article>
            <article>
              <span>05</span>
              <h3>AI</h3>
              <p>
                AI is now part of how I develop: I use it to explore options,
                prototype, and implement features. I remain responsible for the
                technical decisions, reviewing the code, and the quality of
                what ships.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section
        className={styles.experience}
        id='experience'
        aria-labelledby='experience-title'
      >
        <div className={styles.sectionHeader}>
          <p className={styles.sectionLabel}>03 / Experience</p>
          <div>
            <h2 id='experience-title'>
              One career.
              <br />
              <em>Several iterations.</em>
            </h2>
            <p>
              Each stage has built on the one before it. Design informs how I
              shape interfaces, frontend engineering carries into mobile apps,
              and working with clients and collaborators remains part of how I
              find the right approach.
            </p>
          </div>
        </div>
        <div className={styles.timeline}>
          {[...resume.experience, ...resume.additionalExperience].map(
            (role) => (
              <article className={styles.role} key={role.id}>
                <p className={styles.roleDate}>
                  {role.startDate} — {role.endDate}
                  {role.tenureLabel ? (
                    <span className={styles.roleTenure}>{role.tenureLabel}</span>
                  ) : null}
                </p>
                <div>
                  <h3>{role.company}</h3>
                  <p className={styles.roleTitle}>{role.title}</p>
                </div>
                <p className={styles.roleSummary}>{role.summary}</p>
              </article>
            ),
          )}
        </div>
      </section>

      <section
        className={styles.capabilities}
        aria-labelledby='capabilities-title'
      >
        <p className={styles.sectionLabel}>04 / Capabilities</p>
        <div>
          <h2 id='capabilities-title'>
            Technical
            <br />
            <em>strengths.</em>
          </h2>
        </div>
        <div className={styles.skillList}>
          {resume.skills.map((group) => (
            <div key={group.id}>
              <h3>{group.label}</h3>
              <p>{group.items.join(' · ')}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        className={styles.about}
        id='about'
        aria-labelledby='about-title'
      >
        <div>
          <p className={styles.sectionLabel}>05 / Beyond the code</p>
          <p className={styles.aboutAside}>
            Engineering.
            <br />
            Graphic Design.
            <br />
            Theatre.
            <br />
            Architecture.
            <br />
            Collaboration.
          </p>
        </div>
        <div className={styles.aboutMain}>
          <h2 id='about-title'>
            Curiosity is
            <br />
            part of the <em>craft.</em>
          </h2>
          <p>{resume.summary}</p>
          <div className={styles.education}>
            <span>Foundation</span>
            <p>
              <strong>{resume.education[0].degree}</strong>
              <br />
              Minor {resume.education[0].minor}
              <br />
              {resume.education[0].institution} · {resume.education[0].location}
            </p>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <p className={styles.sectionLabel}>
          Open to the next opportunity
        </p>
        <h2>
          Interested in working together?
          <br />
          <em>Get in touch.</em>
        </h2>
        <div className={styles.footerLinks}>
          <ContactDialog id='footer-contact' email={resume.email} className={styles.footerContact} label='Contact me' />
          <a
            href='https://www.linkedin.com/in/chris-honeysett/'
            target='_blank'
            rel='noopener noreferrer'
          >
            LinkedIn <Arrow />
          </a>
        </div>
        <p className={styles.copyright}>
          © {new Date().getFullYear()} Chris Honeysett
        </p>
      </footer>
    </main>
  )
}
