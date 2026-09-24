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
            <span>Senior frontend &amp; mobile engineer</span>
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
                I build clear, maintainable web and mobile applications, drawing
                on experience in graphic design, frontend systems, and connected
                devices.
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
                years leading
                <br />
                frontend work
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
              Selected projects across frontend platforms, mobile applications,
              and interface systems. Each project includes the technical approach
              and my contribution.
            </p>
          </div>
        </div>
        <ProjectGallery projects={projects} />
      </section>

      <section className={styles.statement} aria-labelledby='statement-title'>
        <p className={styles.sectionLabel}>02 / Career path</p>
        <div>
          <h2 id='statement-title'>
            From design to <em>software engineering.</em>
          </h2>
          <div className={styles.principles}>
            <article>
              <span>01</span>
              <h3>Print to interactive</h3>
              <p>
                Theatre, graphic design, and print production formed the
                foundation. As print changed, I learned Flash and ActionScript
                and moved into interactive work.
              </p>
            </article>
            <article>
              <span>02</span>
              <h3>Interactive to the web</h3>
              <p>
                As Flash faded, the work moved to frontend development: static
                sites and CSS, then JavaScript applications built with React and
                Vue.
              </p>
            </article>
            <article>
              <span>03</span>
              <h3>Web to connected devices</h3>
              <p>
                At Twisthink, the work expanded into mobile applications that
                communicate with hardware through Bluetooth Low Energy and NFC.
              </p>
            </article>
            <article>
              <span>04</span>
              <h3>Engineering with new tools</h3>
              <p>
                AI tools now support prototyping and implementation. Engineering
                experience guides architecture, review, and maintainability.
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
              <em>Several reinventions.</em>
            </h2>
            <p>
              The roles span frontend leadership, mobile development, connected
              devices, and design, with collaboration across disciplines at each
              stage.
            </p>
          </div>
        </div>
        <div className={styles.timeline}>
          {[...resume.experience, ...resume.additionalExperience].map(
            (role) => (
              <article className={styles.role} key={role.id}>
                <p className={styles.roleDate}>
                  {role.startDate} — {role.endDate}
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
