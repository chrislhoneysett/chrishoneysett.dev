import styles from './CareerPath.module.css'

export function CareerPathSection() {
  return (
    <section className={styles.statement} aria-labelledby='statement-title'>
      <p className={styles.sectionLabel}>02 / Career path</p>
      <div>
        <h2 id='statement-title'>
          Each step builds
          <br />
          <em>on the last.</em>
        </h2>
        <p className={styles.statementIntro}>
          My path from print design to software has been shaped by changing
          tools and the needs of the people using them. Each transition adds to
          how I approach the next.
        </p>
        <div className={styles.principles}>
          <article>
            <span>01</span>
            <h3>Print</h3>
            <p>
              I began in print production and graphic design, learning to think
              about what an audience needs to see and understand. As the print
              business declined, I looked toward digital work.
            </p>
          </article>
          <article>
            <span>02</span>
            <h3>Flash</h3>
            <p>
              I carried that design foundation into interactive projects,
              learning Flash and ActionScript to make experiences people could
              explore and use.
            </p>
          </article>
          <article>
            <span>03</span>
            <h3>Web</h3>
            <p>
              When Flash faded, I brought design and interaction into web
              development: first HTML and CSS, then JavaScript applications
              built with React and Vue.
            </p>
          </article>
          <article>
            <span>04</span>
            <h3>Mobile</h3>
            <p>
              The same frontend skills now carry into React Native apps for
              connected products. At Twisthink, I own the mobile experience and
              coordinate work across hardware, cloud services, and design.
            </p>
          </article>
          <article>
            <span>05</span>
            <h3>AI</h3>
            <p>
              AI is the newest tool I have added to that foundation. I use it to
              explore options, prototype, and implement features while I remain
              responsible for the decisions, review, and quality of what ships.
            </p>
          </article>
        </div>
      </div>
    </section>
  )
}
