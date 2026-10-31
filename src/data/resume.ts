import { profile, type Profile } from './profile'
import { type SkillGroup } from './skills'
import { experience, additionalExperience, type Experience } from './experience'
import { education, type Education } from './education'

export interface Resume extends Profile {
  skills: SkillGroup[];
  experience: Experience[];
  /** Kept concise and separate so the primary engineering roles lead. */
  additionalExperience: Experience[];
  education: Education[];
}

/** Canonical resume record for the site and future print/PDF output. */
export const resume: Resume = {
  ...profile,
  headline: 'Senior Frontend Engineer | React · React Native · TypeScript',
  summary: 'Senior Frontend Engineer with 15+ years of experience building web applications and cross-platform products with React, React Native, and TypeScript. Design-informed engineer who leads frontend architecture, reusable component systems, and connected-device applications from concept through production. Experience spans major consumer brands, public-sector organizations, and product development teams.',
  skills: [
    { id: 'core', label: 'Core', items: ['React', 'React Native', 'TypeScript', 'JavaScript', 'HTML', 'CSS / SCSS'] },
    { id: 'architecture', label: 'Architecture & UI', items: ['Component APIs', 'Shared foundations', 'Storybook', 'Responsive UI', 'State coordination'] },
    { id: 'verification', label: 'Verification & Delivery', items: ['Behavioral and failure-path tests', 'Task cleanup', 'Integration documentation', 'CI/CD'] },
    { id: 'integration', label: 'Integration', items: ['BLE / NFC', 'SQLite', 'Amplify / Cognito', 'Authenticated services', 'Expo / EAS'] },
    { id: 'earlier', label: 'Earlier experience', items: ['Vue', 'Drupal', 'Adobe AEM'] },
  ],
  experience,
  additionalExperience,
  education,
}
