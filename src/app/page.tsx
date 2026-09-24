import { ThemeToggle } from '@/components/ThemeToggle'
import { ProjectGallery } from '@/components/ProjectGallery'
import { resume } from '@/domains/development/data/resume'
import styles from './page.module.css'

const projects = [...resume.experience, ...resume.additionalExperience]
  .flatMap((role) =>
    role.projects.map((project) => ({ ...project, employer: role.company })),
  )

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
            <a className={styles.navContact} href={`mailto:${resume.email}`}>
              Let&apos;s talk <Arrow />
            </a>
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
                I build web and mobile software, bringing experience across
                print, interactive media, frontend, and connected devices. I
                keep learning as the tools change—and bring the judgment to turn
                new capabilities into clear, maintainable work.
              </p>
              <div className={styles.heroActions}>
                <a className={styles.primaryLink} href='#work'>
                  Explore my work <Arrow />
                </a>
                <a className={styles.secondaryLink} href='#about'>
                  A little about me <span aria-hidden='true'>↓</span>
                </a>
              </div>
            </div>
            <div className={styles.heroArt} aria-hidden='true'>
              <span className={styles.artLabel}>
                ENGINEERING / DESIGN-INFORMED
              </span>
              <div className={styles.artGrid} />
              <div className={styles.artRing} />
              <div className={styles.artCircle} />
              <div className={styles.artSquare} />
              <div className={styles.artLine} />
              <span className={styles.artCaption}>
                01 / DETAILS SUPPORT THE SYSTEM
              </span>
            </div>
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
              Built with purpose.
              <br />
              <em>Made for people.</em>
            </h2>
            <p>
              Good engineering makes complicated things feel natural. Explore
              projects across systems, products, and platforms.
            </p>
          </div>
        </div>
        <ProjectGallery projects={projects} />
      </section>

      <section className={styles.statement} aria-labelledby='statement-title'>
        <p className={styles.sectionLabel}>02 / Reinvention</p>
        <div>
          <h2 id='statement-title'>
            When the medium changes, <em>I learn the next one.</em>
          </h2>
          <div className={styles.principles}>
            <article>
              <span>01</span>
              <h3>Print to interactive</h3>
              <p>
                I began in theatre, studied graphic design, and worked in print.
                As that industry shifted, I taught myself Flash and ActionScript
                and moved into interactive work.
              </p>
            </article>
            <article>
              <span>02</span>
              <h3>Interactive to the web</h3>
              <p>
                When Flash began to fade, I moved into frontend development:
                first static sites and CSS, then JavaScript and application
                architectures like React and Vue.
              </p>
            </article>
            <article>
              <span>03</span>
              <h3>Web to connected devices</h3>
              <p>
                At Twisthink, I expanded into full mobile development, building
                applications that work with hardware through Bluetooth Low
                Energy and NFC.
              </p>
            </article>
            <article>
              <span>04</span>
              <h3>Experience into the AI era</h3>
              <p>
                Now I use AI as part of the development workflow, applying years
                of engineering judgment to guide it toward clean, organized
                solutions built efficiently.
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
              Each shift asked me to learn new tools and ways of working. The
              accumulated experience helps me adapt without losing sight of the
              people, constraints, and craft behind the work.
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
            What I bring
            <br />
            <em>to the table.</em>
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
          Let&apos;s make something meaningful
        </p>
        <h2>
          Have a challenge?
          <br />
          <em>Let&apos;s talk.</em>
        </h2>
        <div className={styles.footerLinks}>
          <a href={`mailto:${resume.email}`}>
            {resume.email} <Arrow />
          </a>
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
