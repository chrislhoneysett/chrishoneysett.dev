/** Presentation fields shared by any domain using this card. */
export interface ProjectCardData {
  id: string;
  name: string;
  client?: string;
  type: string;
  platforms?: readonly string[];
  description: string;
  technologies: readonly string[];
}

export function ProjectCard({ project }: { project: ProjectCardData }) {
  return (
    <article aria-labelledby={`project-${project.id}`}>
      <h4 id={`project-${project.id}`}>{project.name}</h4>
      <p>
        {project.client ?? "Client Work"} · {project.type}
        {project.platforms?.length ? ` (${project.platforms.join(" & ")})` : null}
      </p>
      <p>{project.description}</p>
      {project.technologies.length > 0 && (
        <p><strong>Technologies:</strong> {project.technologies.join(" · ")}</p>
      )}
    </article>
  );
}
