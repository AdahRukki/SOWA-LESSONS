# Academic rebuild — Module 1: foundation

## Scope
This module adds the data foundation only. It does **not** replace the current project-based screen, login, lesson editor, or document exports.

## Hierarchy
Master academic library → Academic session → Class → Subject → Term → Scheme of Work → Week → Topic.

- Classes: Nursery 1–3, Basic 1–6, JSS 1–3, SS 1–3.
- Each class has its own subject list; subjects are not guessed or automatically populated.
- Terms: First Term, Second Term, Third Term.
- Weeks have a configurable count (1–24), and each week can hold multiple topics.
- Every topic has subtopics, learning objectives, content outline, activities and resources.
- Scheme statuses: draft, in-review, approved. Approval behavior will be implemented later.
- A single master library is assumed; branch-specific overrides are not implemented.
- Academic session uses start-year naming, such as 2026/2027.

## Implementation
- `src/academic.ts`: canonical types, class ordering, constructors and structural validation.
- `src/academicStorage.ts`: independent IndexedDB store for academic schemes.

## Data safety and migration
The old `sowa-lessons-offline` IndexedDB workspace and existing lesson-note Projects are untouched.
New curriculum records are stored separately in `sowa-lessons-academic`.
No automatic migration or deletion has been attempted. Backups should precede future schema migrations.

## Next: Module 2
Make class selection the entry screen and route to a class dashboard. This must use the canonical class list from `src/academic.ts` and load the library from `academicStorage.ts`.

## Unfinished / verification
- New academic library is not yet connected to the UI.
- Subject assignment, scheme entry, approval and lesson generation remain later modules.
- Run `npm run build` locally or inspect GitHub Actions before claiming the TypeScript/Vite build passes.
