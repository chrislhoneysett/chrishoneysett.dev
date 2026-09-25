export interface SkillGroup {
  id: string;
  label: string;
  items: string[];
}

export const skills: SkillGroup[] = [
    {
      id: 'core',
      label: 'Core Technologies',
      items: [
        'React',
        'React Native',
        'TypeScript',
        'JavaScript',
        'HTML5',
        'CSS / SCSS',
        'Vue',
      ],
    },
    {
      id: 'mobile',
      label: 'Mobile',
      items: [
        'Expo / EAS',
        'Cross-Platform application builds',
        'Bluetooth',
        'NFC',
        'TypeScript APIs for device communication',
      ],
    },
    {
      id: 'ui-engineering',
      label: 'UI Engineering',
      items: [
        'Component libraries',
        'Atomic Design',
        'Storybook',
        'Accessibility',
        'Responsive UI',
        'Figma-to-code implementation',
        'Responsive prototyping',
      ],
    },
    {
      id: 'platforms-tools',
      label: 'Platforms & Tools',
      items: [
        'AWS',
        'GitHub Actions',
        'CI/CD pipelines',
        'npm',
        'ESLint',
        'Prettier',
        'Drupal',
        'Adobe AEM',
      ],
    },
    {
      id: 'collaboration',
      label: 'Delivery & Collaboration',
      items: [
        'Client communication',
        'Project leadership',
        'Project planning',
        'Designer collaboration',
        'Agile',
        'Scrum',
        'Jira',
        'Miro',
      ],
    },
  ]
