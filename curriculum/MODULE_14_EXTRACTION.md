# Module 14 — Source-based curriculum extraction

Source documents (supplied by the school):
- THE COMPLETE SCHEME OF WORK FOR PRE-PRIMARY & PRIMARY SCHOOLS-1.pdf (985 pages)
- New curriculum for secondary sch.pdf (476 pages)

## Extraction status
A first page-indexed heading inventory has been prepared from both PDFs. The automatic scan found **269 primary** and **321 secondary** candidate scheme headings. These numbers are *not verified scheme totals*, because layouts, repeated headings and continuation pages can affect detection.

## Required review before any website import
1. Match each original class label to an editable class ID. Keep Pre-Nursery as an explicit unmatched class until the school confirms mapping.
2. Match source subjects to subject records; do not silently merge renamed or overlapping subjects.
3. For each class × subject × term, extract individual week rows and their **complete content**, not only topic titles. Preserve source page and exact wording.
4. Handle multi-column primary tables, wrapped text, multiweek ranges (e.g. 11–13), examination weeks and combined English curriculum tables.
5. Compare row counts and content with the original PDF pages; mark uncertain rows for manual review.
6. Only after review, package a versioned, offline curriculum seed for Module 15. Import must be opt-in, idempotent, and never overwrite user-edited schemes.

**No PDF-derived scheme has been marked approved or automatically installed into the application's academic library.**

The extraction inventory and source script are produced as downloadable artifacts during the analysis stage. To reproduce locally, use PyMuPDF and scan source headings while retaining page references.
