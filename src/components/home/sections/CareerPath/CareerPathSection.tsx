import styles from './CareerPath.module.css'

export function CareerPathSection() {
  return (
    <section className={styles.statement} aria-labelledby='statement-title'>
      <p className={styles.sectionLabel} data-reveal>02 / Career path</p>
      <div>
        <h2 data-reveal id='statement-title'>
          Each step <em>builds</em>
          <br />
          on the last.
        </h2>
        <p className={styles.statementIntro} data-reveal>
          My path from print design to software has been shaped by changing
          tools and the needs of the people using them. Each transition adds to
          how I approach the next.
        </p>
        <div className={styles.principles} data-reveal-group>
          <article data-reveal='right'>
            <span>01</span>
            <h3>Print</h3>
            <p>
              I began in print production and graphic design, learning to think
              about what an audience needs to see and understand. As the print
              business declined, I looked toward digital work.
            </p>
          </article>
          <article data-reveal='right'>
            <span>02</span>
            <h3>Flash</h3>
            <p>
              I carried that design foundation into interactive projects,
              learning Flash and ActionScript to make experiences people could
              explore and use.
            </p>
          </article>
          <article data-reveal='right'>
            <span>03</span>
            <h3>Web</h3>
            <p>
              When Flash faded, I brought design and interaction into web
              development: first HTML and CSS, then JavaScript applications
              built with React and Vue.
            </p>
          </article>
          <article data-reveal='right'>
            <span>04</span>
            <h3>Mobile</h3>
            <p>
              The same frontend skills now carry into React Native apps for
              connected products. At Twisthink, I own the mobile experience and
              coordinate work across hardware, cloud services, and design.
            </p>
          </article>
          <article data-reveal='right'>
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
