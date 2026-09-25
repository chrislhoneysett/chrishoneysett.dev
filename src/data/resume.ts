import { profile, type Profile } from './profile'
import { skills, type SkillGroup } from './skills'
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
  skills,
  experience,
  additionalExperience,
  education,
}
