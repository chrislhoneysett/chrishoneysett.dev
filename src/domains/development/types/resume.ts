/** Company names represented in this domain. */
export type ExperienceCompany =
  | "Gravity Works"
  | "Honeysett Design"
  | "North American Color, Inc."
  | "Twisthink"
  | "VMLY&R / Biggs | Gilmore";

/** Plain, serializable content shared by the website and future PDF renderer. */
export interface ResumeLink {
  label: string;
  url: string;
}

export type ResumeTag =
  | "web"
  | "mobile"
  | "ui"
  | "design-system"
  | "bluetooth"
  | "cms"
  | "leadership";

export interface ResumeProject {
  id: string;
  name: string;
  /** Omit from the website's selected work while retaining the project record. */
  hidden?: boolean;
  /** When omitted, render the label "Client Work". */
  client?: string;
  type: "Web Application" | "Mobile Application" | "Component Library" | "Website";
  platforms?: ("iOS" | "Android")[];
  /** Marks greenfield projects with a corner tag on the project card. */
  projectOrigin?: "Greenfield";
  /** Optional image used as the project's card hero image. */
  heroImage?: {
    src: string;
    alt: string;
    kind?: 'illustration';
  };
  /** Product-focused prose for website project cards. */
  description: string;
  /** Quiet disclosure shown after the project details in the modal. */
  confidentialityNote?: string;
  /** Expanded project story for the website's project detail modal. */
  modal?: {
    overview: string;
    contribution: string;
    highlights: string[];
    screenshots: {
      src: string;
      alt: string;
      caption: string;
    }[];
    liveUrl?: string;
  };
  /** Concise contribution statement for PDF resume bullets. */
  resumeHighlight: string;
  technologies: string[];
  /** Supports selecting projects for frontend- or mobile-focused resumes. */
  tags: ResumeTag[];
}

export interface Experience {
  id: string;
  company: ExperienceCompany;
  title: string;
  location: string;
  /** Year precision matches the source resume; no month is implied. */
  startDate: string;
  endDate: string;
  /** Approximate tenure shown below the year range when useful. */
  tenureLabel?: string;
  summary: string;
  projects: ResumeProject[];
}

export interface SkillGroup {
  id: string;
  label: string;
  items: string[];
}

export interface Education {
  id: string;
  institution: string;
  school: string;
  location: string;
  degree: string;
  minor: string;
  honors: string[];
}

export interface Resume {
  name: string;
  headline: string;
  location: string;
  email: string;
  phone?: string;
  links: ResumeLink[];
  summary: string;
  skills: SkillGroup[];
  experience: Experience[];
  /** Kept concise and separate so the primary engineering roles lead. */
  additionalExperience: Experience[];
  education: Education[];
}
