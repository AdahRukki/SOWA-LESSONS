# Basic 3 source-level correction report

Source: user-supplied **THE COMPLETE SCHEME OF WORK FOR PRE-PRIMARY & PRIMARY SCHOOLS (1).pdf**, pages **743–769**.

## Corrections committed
1. **Mathematics, all three terms (PDF pp. 746–748):** prior extractor shifted topics by one or more weeks, merged assessment rows into lesson descriptions, and lost a source printed week range. Replaced all three term row sets with exact source week/topic mapping and the visible content breakdown. The original source groups end weeks as **11–13** (First, Second) and **12–13** (Third). These remain **range rows**, not fictional individual lessons.
2. **English Language, all three terms (pp. 743–745):** restored omitted Week 13 content: First Term *End-of-term assessment*; Second Term *End-of-term tests and feedback*; Third Term *End-of-session test and feedback*.
3. **Validator:** updated to understand numeric week ranges, check overlapping ranges, and flag missing coverage instead of assuming each PDF row means one week.

## Current Basic 3 staging inventory
- 27 subject-term schemes, covering 9 subjects × 3 terms.
- All 27 now cover Weeks 1–13 by numerical week/range representation without overlapping entries.
- 346 physical weekly/range rows remain. Math contains several multiweek source rows.
- **35 content fields remain empty**, mostly where the printed PDF does not supply a standalone content cell: midterm breaks and the assessment/revision rows in Nigerian History and Social/Citizenship. Cultural & Creative Arts includes a source row with Week 6 but no topic or content in its first-term table. **These need human source interpretation before promotion**. Do not insert invented instructional material.

## Still required before approving/promoting
- Visually compare the non-Mathematics subject topic and content columns to the original source pages: parsing previously shifted some columns.
- Verify where the PDF truly leaves topic/content empty and whether importer supports such intentional administrative weeks without silently requiring fabricated content.
- Recheck embedded or split subject/term headings and source-page pointers.
- Keep all Basic 3 schemes in staging with `needs_review` and never auto-approve.

**Status:** Source corrections were applied to the isolated staging file on branch `phase12-batch-curriculum-validation`. The app's main curriculum bundle is unchanged for Basic 3.
