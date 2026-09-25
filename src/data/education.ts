

export interface Education {
  id: string;
  institution: string;
  school: string;
  location: string;
  degree: string;
  minor: string;
  honors: string[];
}

export const education: Education[] = [
    {
      id: 'depaul',
      institution: 'DePaul University',
      school: 'The Theatre School',
      location: 'Chicago, IL',
      degree: 'B.F.A. Theatre Technology',
      minor: 'Graphic Design',
      honors: [
        'Graduated with High Honors',
        "Dean's Theatre Design & Technology Scholarship",
      ],
    },
  ]
