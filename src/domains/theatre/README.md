# Theatre production history

`data/shows.ts` contains 222 production records, with types in `types/show.ts`.

## Import source

Imported from `Shows e2bd3f1566874a4f86bf9d2d37116d92_all.csv`. The accompanying `Shows e2bd3f1566874a4f86bf9d2d37116d92.csv` contains 221 rows, all already represented in the larger export. The extra record is **Noises Off**, DePaul University, 2001, with the note **Assistant Technical Director**.

- `Name` maps to `title`.
- `Company`, `Year`, and `Notes` map to `company`, numeric `year`, and `notes`. Missing values are `null`.
- `Role Type` maps to a `roles` array. An empty source field becomes an empty array.
- `Property` is empty in all 222 rows and is omitted.
- IDs were generated from year, title, and company, with suffixes for collisions. Keep IDs stable when editing content.
- Source ordering and spelling are preserved. Sort copies of the array when displaying results.

## Records to review

The source contains two identical records each for **Murder for Two** (Farmers Alley Theatre, 2016, Marketing) and **Goodnight Moon** (Farmers Alley Theatre, 2015, Marketing). Both copies are retained with distinct IDs because the export provides no production identifier to establish whether they are separate credits.

Seven records have no year, one has no company, and one has no role classification. Notes such as `???` and apparent spelling errors are preserved rather than guessed. The Noises Off role is present in its notes but is not inferred into the empty roles field.

## Future search

Search can match `title`, `company`, and `notes`, with exact filters for `roles` and numeric `year`. Treat `null` years as undated rather than zero. These records are not yet rendered on the development homepage.
