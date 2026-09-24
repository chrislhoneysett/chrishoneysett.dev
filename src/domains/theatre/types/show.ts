/** Company names represented in this domain. */
export type ShowCompany =
  | "Actors & Playwrights Initiative (API)"
  | "Brandy"
  | "DePaul University"
  | "Drama Learning Center"
  | "Farmers Alley Theatre"
  | "Haverhill Elementary"
  | "Kalamazoo Civic Summer Theatre"
  | "Kalamazoo Civic Theatre"
  | "Kalamazoo Civic Youth Theatre"
  | "Kalamazoo College"
  | "Keyhole Players"
  | "Mason Street Warehouse"
  | "Portage Central High School"
  | "Portage North Middle School"
  | "Portage Northern High School"
  | "Portage Parks & Recreation"
  | "Steppenwolf"
  | "Whole Art Theatre";

/** Role labels from the show export. */
export type ShowRole =
  | "Actor"
  | "Crew"
  | "Marketing"
  | "Master Carpenter"
  | "Set Design"
  | "Technical Director";

/** One production credit; repeat productions can share a title. */
export interface Show {
  /** Stable identifier; retain it when correcting imported details. */
  id: string;
  title: string;
  company: ShowCompany | null;
  year: number | null;
  roles: ShowRole[];
  notes: string | null;
}
