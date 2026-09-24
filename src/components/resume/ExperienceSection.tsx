import { ProjectCard, type ProjectCardData } from "./ProjectCard";

export interface ExperienceEntryData {
  id: string;
  company: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  summary: string;
  projects: readonly ProjectCardData[];
}

export function ExperienceSection({ id, title, entries }: {
  id: string;
  title: string;
  entries: readonly ExperienceEntryData[];
}) {
  return (
    <section aria-labelledby={id}>
      <h2 id={id}>{title}</h2>
      {entries.map((entry) => (
        <article key={entry.id} aria-labelledby={`experience-${entry.id}`}>
          <h3 id={`experience-${entry.id}`}>{entry.company}</h3>
          <p><strong>{entry.title}</strong></p>
          <p>{entry.startDate}–{entry.endDate} · {entry.location}</p>
          <p>{entry.summary}</p>
          {entry.projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </article>
      ))}
    </section>
  );
}
