import { additionalExperience, experience } from './experience'

const selectedProjectIds = [
  'secure-physical-access',
  'connected-battery-management',
  'auris',
  'charity-water',
  'uci-medicine',
  'ihsaa',
] as const

const projects = [...experience, ...additionalExperience].flatMap((role) =>
  role.projects.map((project) => ({ ...project, employer: role.company })),
)

export const selectedProjects = selectedProjectIds.map((id) => {
  const project = projects.find((item) => item.id === id)
  if (!project) throw new Error(`Missing selected project: ${id}`)
  return project
})

const selectedProjectIdSet = new Set<string>(selectedProjectIds)

export const moreProjects = projects.filter(
  (project) => !project.hidden && !selectedProjectIdSet.has(project.id),
)
