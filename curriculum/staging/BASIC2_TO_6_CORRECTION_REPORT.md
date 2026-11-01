# Basic 2–6 source fixes — batch 2

Source: **THE COMPLETE SCHEME OF WORK FOR PRE-PRIMARY & PRIMARY SCHOOLS (1).pdf**.

## Corrected on this review branch
- **Basic 2, Islamic Studies:** original First Term extraction improperly swallowed Second Term after Week 13. Split the two original 13-week blocks and recovered the missing **Second Term** scheme (PDF p. 707–708).
- **Basic 3, Social and Citizenship Studies:** First Term swallowed Second Term. Split the two week blocks at the source's Second Term heading (p. 764).
- **Basic 3, Cultural and Creative Arts:** First Term swallowed Second Term. Split after Week 13 (p. 767).
- **Basic 4, Social and Citizenship Studies:** First Term swallowed Second Term (p. 817).
- **Basic 5, Prevocational Studies:** Second Term swallowed Third Term (p. 888).
- **Basic 6, English Language:** Week 1 was missing in all three terms. Restored original topic/content from p. 895, 897, and 899.

## Updated results
The staged Basic 2–6 candidate set now holds **162 schemes** (previously 157), because 5 genuine term headings were recovered. **135/162 pass initial automated checks** for 13 sequential week numbers, nonempty topics and content, and no repeated weeks. **27 are flagged** for further review, all in Basic 3. This is not proof that the passing schemes' topic/content columns accurately reproduce the PDF.

All corrections are confined to raw staging files on branch `phase12-batch-curriculum-validation`. No Basic 2–6 records were promoted to `src/preloadedCurriculum.json` in this batch, and nothing was approved or merged into main.

## Next
Check Basic 3 PDF pages 743–769 directly: blank content fields, source rows with 10 or 11 weeks, split/misread columns. After independent source comparison of passing records, promote validated entries to bundled curriculum.
