# Content domains

- `development/` owns the engineering resume data and types.
- `theatre/` owns production credits and theatre-specific types. Theatre-specific search helpers and page information belong here.

Next.js routes stay in `src/app` and compose shared components with domain data. The homepage currently uses development only.

## Components and themes

Use `src/components` for components that can be shared by both domains, including the example resume components in `src/components/resume`. Shared components define their own presentation props and do not import domain data or domain types. Pages map domain records to those props where needed.

Create a domain's `components` folder only for UI specific to that domain. Keep domain-specific page content and configuration in the domain folder, while route entry points remain in `src/app`. Future shared theme code belongs outside the domains, for example in `src/styles`.

Import data directly:

```ts
import { resume } from "@/domains/development/data/resume";
import { shows } from "@/domains/theatre/data/shows";
```

Keep domain-specific content and behavior independent. Theatre projects within the professional resume remain there as professional credits; the production history belongs to theatre.
