# Primary 2–6 bulk extraction — quarantine report

Source: original user-supplied 985-page pre-primary and primary scheme PDF, pages 668–957.

This pass used PDF text positioning to identify scheme headers and week rows. **It has not been merged into `src/preloadedCurriculum.json`** and is not approved.

Detected **157 candidate subject-term schemes**:
- Basic 2: 26
- Basic 3: 25
- Basic 4: 35
- Basic 5: 35
- Basic 6: 36

**126 candidates passed the initial sequence and nonblank-field checks; 31 were flagged.** Passing these checks does NOT guarantee text accuracy. Some unusual formats (e.g., legitimate break-week em dashes, Basic 3 Mathematics with 10/11 weeks, and split heading of Basic 2 Islamic Studies Second Term) need bespoke parsing. In addition, content-column position changes from one subject to another and must be confirmed visually.

**Next safe actions:** (1) extract per-class JSON into staging, (2) compare topic and content cells directly against source-page layout, (3) handle terms with 10–13 week structure without inventing weeks, (4) verify subject-term coverage including headings split across pages, (5) run duplicate and blank-content validation, (6) promote only validated schemes to the bundled curriculum in a separate commit.

Existing main-branch curriculum records remain unchanged.
