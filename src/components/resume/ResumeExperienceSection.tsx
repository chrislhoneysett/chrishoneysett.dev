import { ResumeProjectCard, type ResumeProjectCardData } from "./ResumeProjectCard";
import { formatExperienceDate } from '@/lib/experienceDates';

export interface ResumeExperienceEntryData {
  id: string;
  company: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string | null;
  summary: string;
  projects: readonly ResumeProjectCardData[];
}

export function ResumeExperienceSection({ id, title, entries }: {
  id: string;
  title: string;
  entries: readonly ResumeExperienceEntryData[];
}) {
  return (
    <section aria-labelledby={id}>
      <h2 id={id}>{title}</h2>
      {entries.map((entry) => (
        <article key={entry.id} aria-labelledby={`experience-${entry.id}`}>
          <h3 id={`experience-${entry.id}`}>{entry.company}</h3>
          <p><strong>{entry.title}</strong></p>
          <p>{formatExperienceDate(entry.startDate)}–{formatExperienceDate(entry.endDate)} · {entry.location}</p>
          <p>{entry.summary}</p>
          {entry.projects.map((project) => (
            <ResumeProjectCard key={project.id} project={project} />
          ))}
        </article>
      ))}
    </section>
  );
}
