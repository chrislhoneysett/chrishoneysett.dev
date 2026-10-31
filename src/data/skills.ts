export interface SkillGroup {
  id: string
  label: string
  items: string[]
}

export const skills: SkillGroup[] = [
  { id: 'core', label: 'Current Focus', items: ['React', 'React Native', 'TypeScript', 'JavaScript', 'HTML', 'CSS / SCSS'] },
  { id: 'architecture', label: 'Frontend Architecture', items: ['Component APIs and composition', 'Shared frontend foundations', 'State coordination', 'Application and library boundaries', 'Shared BLE / cloud control interfaces'] },
  { id: 'ui-engineering', label: 'UI Systems', items: ['Component libraries and themes', 'Storybook examples and documentation', 'Responsive layouts and navigation', 'Figma-to-code implementation'] },
  { id: 'verification', label: 'Testing & Recovery', items: ['Behavioral tests', 'Asynchronous failure-path tests', 'Interrupted and competing operations', 'Subscription and task cleanup', 'Preserving pending data after failures'] },
  { id: 'integration', label: 'Application Integration', items: ['Amplify and Cognito account flows', 'Authenticated service requests', 'Bluetooth and NFC', 'SQLite', 'Expo / EAS', 'iOS & Android delivery'] },
  { id: 'collaboration', label: 'Delivery & Team Support', items: ['Frontend project leadership', 'Designer and firmware collaboration', 'Client communication', 'Integration documentation', 'Private npm packages', 'GitHub Actions and CI/CD'] },
  { id: 'earlier', label: 'Earlier Professional Experience', items: ['Vue', 'Drupal', 'Adobe AEM', 'Embedded React applications'] },
]
