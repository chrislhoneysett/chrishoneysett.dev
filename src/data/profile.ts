/** Plain, serializable content shared by the website and future PDF renderer. */
export interface ResumeLink {
  label: string
  url: string
}

export interface Profile {
  name: string
  headline: string
  location: string
  phone?: string
  links: ResumeLink[]
  summary: string
}

export const profile: Profile = {
  name: 'Chris Honeysett',
  headline: 'Senior Frontend Engineer | React & Connected Mobile Apps',
  location: 'Kalamazoo, MI',
  links: [
    { label: 'chrishoneysett.dev', url: 'https://chrishoneysett.dev' },
    {
      label: 'chrislhoneysett@gmail.com',
      url: 'mailto:chrislhoneysett@gmail.com',
    },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/chris-honeysett/' },
  ],
  summary:
    'While studying theatre technology at DePaul, I discovered graphic design. That became the starting point for my career in print and interactive media, then frontend engineering and mobile apps. I continued theatre technical direction as side work, where production planning and crew coordination strengthened skills I still use with clients and teams. Today I draw on that experience to understand the goal, connect design and engineering, and carry the details through release and improvement.',
}
