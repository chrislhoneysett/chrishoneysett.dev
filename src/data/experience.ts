import type { ResumeProject } from './projects'

/** Company names represented in this domain. */
export type ExperienceCompany =
  | 'Gravity Works'
  | 'Honeysett Design'
  | 'North American Color, Inc.'
  | 'Twisthink'
  | 'VML / Biggs | Gilmore'

export interface Experience {
  id: string
  company: ExperienceCompany
  website?: string
  title: string
  location: string
  /** Year precision matches the source resume; no month is implied. */
  startDate: string
  endDate: string
  /** Approximate tenure shown below the year range when useful. */
  tenureLabel?: string
  summary: string
  projects: ResumeProject[]
}

import { projectsByRole } from './projects'

export const experience: Experience[] = [
  {
    id: 'twisthink',
    company: 'Twisthink',
    website: 'https://www.twisthink.com/',
    title: 'Senior Software Engineer',
    location: 'Grand Rapids, MI',
    startDate: '2023',
    endDate: 'Present',
    summary:
      'As the sole frontend engineer, I own web interfaces and nearly all application engineering for two released React Native apps. I continue to iterate on both, contribute to their design, and collaborate with teammates responsible for specialized BLE and NFC security layers. I also build TypeScript APIs that let app developers work with connected devices without handling device-specific message formats directly.',
    projects: projectsByRole['twisthink'],
  },
  {
    id: 'gravity-works',
    company: 'Gravity Works',
    website: 'https://www.gravityworksdesign.com/',
    title: 'Senior Frontend Developer',
    location: 'Lansing, MI',
    startDate: '2020',
    endDate: '2023',
    summary:
      'Led development of Drupal websites and embedded React applications for education, athletics, arts, and public-sector organizations. Built shared site structures and integrated external data, ticketing, registration, and permission-controlled financial workflows.',
    projects: projectsByRole['gravity-works'],
  },
  {
    id: 'vmlyr',
    company: 'VML / Biggs | Gilmore',
    website: 'https://www.vml.com/',
    title: 'Lead Technologist',
    location: 'Kalamazoo, MI',
    startDate: '2009',
    endDate: '2020',
    summary:
      'Led frontend development for major consumer brands, including Ford, Kellogg’s, Cottonelle, and Walmart, as well as pro bono projects for nonprofit organizations. Delivered responsive websites and application features using React, Vue, Adobe AEM, and Drupal.',
    projects: projectsByRole['vmlyr'],
  },
]

export const additionalExperience: Experience[] = [
  {
    id: 'north-american-color',
    company: 'North American Color, Inc.',
    title:
      'Prepress Systems Operator / Graphic Designer / Digital Press Operator',
    location: 'Portage, MI',
    startDate: '2002',
    endDate: '2009',
    summary:
      'Managed graphic design, image manipulation, print preparation, and digital press operations.',
    projects: projectsByRole['north-american-color'],
  },
  {
    id: 'honeysett-design',
    company: 'Honeysett Design',
    title: 'Freelance Designer / Developer',
    location: 'Kalamazoo, MI',
    startDate: '1998',
    endDate: '2024',
    summary:
      'Worked directly with arts and education clients on responsive websites, marketing, branding, and graphic design, much of it for theatrical productions. Concurrent theatre technical direction involved production planning and crew coordination.',
    projects: projectsByRole['honeysett-design'],
  },
]
