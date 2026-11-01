# Basic 2–6: Exception triage, 157 candidates

Automated inspection of the five JSON staging files on this branch. **No source-page correction is claimed. No candidate has been promoted to the bundled curriculum.**

| Class | Candidates | Flagged | Main reasons |
|---|---:|---:|---|
| Basic 2 | 26 | 1 | Islamic Studies First Term has 26 rows with repeated weeks |
| Basic 3 | 25 | 25 | Blank/short content, duplicate 26-row tables, Mathematics 10–11-row terms |
| Basic 4 | 35 | 1 | Social and Citizenship Studies First Term repeated 26-row table |
| Basic 5 | 35 | 1 | Prevocational Studies Second Term repeated 26-row table |
| Basic 6 | 36 | 3 | English Language Terms 1–3 missing Week 1 |
| **Total** | **157** | **31** | |

126 candidate term schemes pass this **initial structure check only**. Passing does not mean topic/content transcription has been verified against the PDF.

## 31 flagged records requiring source comparison

1. Basic 2 — Islamic Studies / First Term: duplicate week rows, 26 records.
2. Basic 3 — English Language / First, Second and Third Terms: blank content fields.
3. Basic 3 — Mathematics / First, Second and Third Terms: 10, 10 and 11 rows, blank fields.
4. Basic 3 — Basic Science / all terms: blank fields.
5. Basic 3 — Physical and Health Education / all terms: blank fields.
6. Basic 3 — Christian Religious Studies / all terms: blank fields.
7. Basic 3 — Islamic Studies / all terms: blank fields.
8. Basic 3 — Nigerian History / all terms: blank/short fields.
9. Basic 3 — Social and Citizenship Studies / First and Third Terms: duplicated First Term, blank fields.
10. Basic 3 — Cultural and Creative Arts / First and Third Terms: duplicated First Term, blank fields.
11. Basic 4 — Social and Citizenship Studies / First Term: duplicated week rows.
12. Basic 5 — Prevocational Studies / Second Term: duplicated week rows.
13. Basic 6 — English Language / all terms: starts at Week 2; Week 1 missing.

## Guardrails before merge

- Reinspect each flagged scheme on the cited PDF page, especially titles crossing page breaks, week ranges, and row boundaries.
- Do not convert 10–11-row terms to 13 weeks without checking the original.
- Do not replace blank source fields with invented explanatory text.
- Check **all** candidates' topic/content-column alignment with the PDF, including those passing structural tests.
- Preserve the source subject names, original terms and week numbering.
- Reject existing `class_id/subject/term` duplicates and keep all new schemes marked `needs_review`.
- Only after checks, merge verified candidates into `src/preloadedCurriculum.json`.

**Source PDF:** THE COMPLETE SCHEME OF WORK FOR PRE-PRIMARY & PRIMARY SCHOOLS (1).pdf, primary sections approximately pages 667–957.
