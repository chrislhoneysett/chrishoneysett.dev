import { experience, additionalExperience } from '@/data/experience'
import { Icon } from '@/components/Icon'
import styles from './Experience.module.css'
import { calculateTenureLabel, formatExperienceDate } from '@/lib/experienceDates'

export function ExperienceSection() {
  return (
    <section
      className={styles.experience}
      id='experience'
      aria-labelledby='experience-title'
    >
      <div className={styles.sectionHeader} data-reveal>
        <p className={styles.sectionLabel}>04 / Experience</p>
        <div>
          <h2 id='experience-title'>
            One career.
            <br />
            Several <em>chapters.</em>
          </h2>
          <p>
            I have led frontend delivery for consumer brands, public institutions,
            and connected products, supporting applications through release
            and continued development.
          </p>
        </div>
      </div>
      <div className={styles.timeline} data-reveal-group>
        {[...experience, ...additionalExperience].map((role) => (
          <article className={styles.role} key={role.id} data-reveal='left'>
            <p className={styles.roleDate}>
              {formatExperienceDate(role.startDate)} — {formatExperienceDate(role.endDate)}
              <span className={styles.roleTenure}>
                {calculateTenureLabel(role.startDate, role.endDate)}
              </span>
            </p>
            <div>
              <h3>
                {role.website ? (
                  <a
                    className={styles.companyLink}
                    href={role.website}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {role.company}
                    <Icon
                      name='north-east'
                      className={styles.companyLinkIcon}
                    />
                  </a>
                ) : (
                  role.company
                )}
              </h3>
              <p className={styles.roleTitle}>{role.title}</p>
            </div>
            <p className={styles.roleSummary}>{role.summary}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
