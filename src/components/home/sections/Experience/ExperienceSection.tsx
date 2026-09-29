import {
  experience,
  additionalExperience,
} from '@/data/experience'
import { Icon } from '@/components/Icon'
import styles from './Experience.module.css'

const calculateTenureLabel = (startDate: string, endDate: string) => {
  const start = parseInt(startDate, 10)
  const end =
    endDate === 'Present' ? new Date().getFullYear() : parseInt(endDate, 10)
  const years = end - start
  return `${years} year${years !== 1 ? 's' : ''}`
}

export function ExperienceSection() {
  return (
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
            Those layers show up in the roles below. I have stayed with teams
            long enough to see projects through and take on new kinds of work,
            bringing earlier skills into each new responsibility.
          </p>
        </div>
      </div>
      <div className={styles.timeline}>
        {[...experience, ...additionalExperience].map((role) => (
          <article className={styles.role} key={role.id}>
            <p className={styles.roleDate}>
              {role.startDate} — {role.endDate}
              {role.endDate ? (
                <span className={styles.roleTenure}>
                  {calculateTenureLabel(role.startDate, role.endDate)}
                </span>
              ) : null}
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
                    <Icon name='north-east' className={styles.companyLinkIcon} />
                  </a>
                ) : role.company}
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
