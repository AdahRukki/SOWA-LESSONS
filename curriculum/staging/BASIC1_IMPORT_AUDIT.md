# Basic 1 curriculum batch — source reconciliation

Source: **THE COMPLETE SCHEME OF WORK FOR PRE-PRIMARY & PRIMARY SCHOOLS (1).pdf**, original PDF pages 637–666.

This branch stages 15 term schemes with 195 week records in `curriculum/staging/basic1_missing_subjects.json`, and merges these 15 records without replacing any existing entries into `src/preloadedCurriculum.json`.

| Subject | Source pages | Terms | Weeks |
|---|---|---|---|
| Christian Religious Studies | 637–642 | 3 | 39 |
| Islamic Studies | 643–647 | 3 | 39 |
| Nigerian History | 648–653 | 3 | 39 |
| Social and Citizenship Studies | 654–660 | 3 | 39 |
| Cultural and Creative Arts | 661–666 | 3 | 39 |

Automated extraction checks passed: 13 sequential weeks for every subject and term, nonempty topic/content fields, valid source-page provenance, and no duplicate class/subject/term keys after merging.

**Important limitations:** This is a structurally validated staging import, **not** a completed human comparison of all 195 extracted titles and descriptions against PDF page layouts. All 15 schemes remain `needs_review`; none is approved or automatically installed into a browser's local data. Islamic Studies is retained in the *source library* because it appears in the PDF; schools can choose not to install it.

Branch curriculum total: 105 bundled subject-term schemes (90 existing + 15 staged).
Do not merge until the build and workflow checks are confirmed.
