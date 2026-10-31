# Primary and Nursery Scheme of Work Reconciliation — 31 October 2026

## Source and scope
Source: user-provided **THE COMPLETE SCHEME OF WORK FOR PRE-PRIMARY & PRIMARY SCHOOLS (1).pdf**, 985 pages. Source index pages 2–5. The source includes Pre-nursery, Nursery 1–3 and Primary 1–6. This audit matches the application's Nursery 1–3 and Basic 1–6 classes; pre-nursery is outside the current default class list.

GitHub bundle audited: `src/preloadedCurriculum.json` (90 schemes). **These records are marked needs_review, not approved.** Count refers only to bundled entries, not any curriculum separately installed into an individual browser's IndexedDB.

## Current library comparison

| Application class | Source curriculum section (PDF pages) | Bundled subject-term schemes | Finding |
|---|---|---:|---|
| Nursery 1 | 100–308 | 0 | Entire section missing from bundled app |
| Nursery 2 | 309–452 | 0 | Entire section missing from bundled app |
| Nursery 3 | 453–609 | 0 | Entire section missing from bundled app |
| Basic 1 / Primary 1 | 610–666 | 12 | Four subjects × three terms bundled; other source subjects missing |
| Basic 2 / Primary 2 | 667–741 | 0 | Entire section missing from bundled app |
| Basic 3 / Primary 3 | 742–769 | 0 | Entire section missing from bundled app |
| Basic 4 / Primary 4 | 770–843 | 0 | Entire section missing from bundled app |
| Basic 5 / Primary 5 | 844–893 | 0 | Entire section missing from bundled app |
| Basic 6 / Primary 6 | 894–957 | 0 | Entire section missing from bundled app |

The other 78 bundled entries belong to JSS 1 and JSS 2, and are outside this primary/nursery reconciliation.

### Basic 1 already bundled
- Mathematics: First, Second, Third Terms
- English Language: First, Second, Third Terms
- Basic Science: First, Second, Third Terms
- Physical and Health Education: First, Second, Third Terms

### Basic 1 topics still missing from bundled app
The source table of contents also lists:
- Christian Religious Studies (starts page 637)
- Islamic Studies (starts page 643)
- Nigerian History (starts page 648)
- Social and Citizenship Studies (starts page 654)
- Cultural and Creative Arts (starts page 661)

Do **not** interpret a source subject as necessarily belonging in a school's active subject list; confirm the school's chosen curriculum and exclusions before importing.

## Conclusions
1. The existing **source PDF contains curriculum material for all nine target classes**, but this is **not the same as an extracted, validated, installed, approved curriculum in SOWA Lessons**.
2. The supplied PDF's table of contents establishes subject availability. It does not by itself establish that every week and every term has passed content validation.
3. **Stop manually reconstructing topics from memory.** Import mechanically from source pages into review staging, retaining original week/topic/content/source-page fields and source terminology.
4. For scanned, merged, or irregular PDF tables, verify row boundaries, week ranges, special examination/break weeks, and complete term coverage before publishing records as reviewed.
5. Preserve existing bundled Basic 1 records until a source-level comparison confirms whether they match; never overwrite approved or user-edited local schemes.
6. Phase 12 should use one audit/review batch per class, then import to `preloadedCurriculum.json` only after row-level validation. Do not automatically approve imported records.

## Recommended next batch
Audit and extract the five missing **Basic 1 source subjects**, then move to Basic 2 using source pages 667–741. Nursery classes should follow in a dedicated extraction pass because their table structures differ from Primary classes.

## Development status
Academic feature implementation: previously estimated at 8/10, **not build verified**.
Curriculum bundle: 90 records across three classes; **not a verified curriculum completion percentage**.
