# Basic 3: source blanks and staged-validation update

Source: user-supplied 985-page Primary Scheme of Work PDF, Basic 3 subject tables pp. 743–769.

## Basic 3 source audit
- All 27 subject-term schemes cover the printed Weeks 1–13, including Mathematics' grouped week ranges.
- The staged Basic 3 file now marks **39 rows** with `source_blank:true` when their topic or content field is empty in the source or original extraction.
- **Three Cultural and Creative Arts Week 6 rows have both topic and content blank in the printed PDF** (pp. 767, 768, 769). These have not been replaced with a guessed 'Midterm Break' topic.
- Assessment/break weeks in Nigerian History and Social and Citizenship Studies also have empty content cells in the printed table; they are preserved.
- The PDF repeats 'Review of all topics covered in third term and entire year' in CCA's First and Second Terms. This appears to be source wording; the extraction must not silently rewrite the curriculum without approval.
- Source blanks are explicitly tracked, not treated as verified instructional topics.

## Staged bulk checks
A separate script (`scripts/validate-staged-curriculum.cjs`) now checks the Basic 2–6 staging files:
- Unique class/subject/term identities
- Numeric and ranged week labels with no overlaps
- Coverage of Weeks 1–13
- Topic/content blanks documented as `source_blank:true`
- Source-page references
- `needs_review` status

Current staging inventory: **162 schemes, 2,101 physical rows, 39 documented blank-field rows**. A local equivalent check reports **zero coverage/duplication/undocumented-blank errors**. The GitHub Actions workflow was updated to run both the bundled and staging checks; **CI outcome has not yet been independently confirmed**.

## Critical limit
This checks structural integrity only. Full page-by-page transcription verification, semantic accuracy, curriculum subject selection, installer compatibility, app build, and final merge are **not completed**. No Basic 2–6 schemes were copied to the main curriculum bundle. None has been approved.
