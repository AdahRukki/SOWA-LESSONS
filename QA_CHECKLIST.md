# SOWA Lessons — release verification

Run locally after pulling:

```bash
npm install
npm run build
npm run dev
```

Automated CI checks the TypeScript and Vite production build for pushes and pull requests to main. CI does **not** test browser interactions or Microsoft Word/WPS rendering.

## Browser acceptance checklist

1. Open the app and create a project with two weeks.
2. Enter different lesson text and teacher-guide stages in each week.
3. Reorder weeks, refresh, and confirm the new order and both lesson contents.
4. Verify the **Saved offline** indicator before closing the tab.
5. Download a JSON backup, then restore it as a separate project. Check the teacher guide and lesson contents.
6. Insert a PNG or JPEG image and a table. Reload the page to confirm content persists.
7. Test the ChatGPT bridge with a short suggestion; confirm it appends content only after approval.
8. Export a DOCX with all weeks. Inspect it in Microsoft Word or WPS, including stage tables, page breaks, and headers/footers.
9. Print to PDF. Set the same paper size and orientation in the print dialog. Check that each week starts on a fresh page.
10. While the app is installed and previously loaded, disconnect from the internet, refresh, and confirm the UI loads. Offline behavior depends on the PWA service worker being installed/cached in a production build, not the development server.

## Known limitations

- TOC page numbers are not calculated yet.
- Word image dimensions use a default placeholder size.
- Browser printing varies with browser/print settings.
- The PWA currently has no install icons configured; install prompts may not appear.
- Document settings are temporary UI state rather than stored project properties.
- Complex source HTML (nested tables, arbitrary markup) may not round-trip through DOCX export.
- IndexedDB is local to the browser/device; it is not cloud sync. Export backups regularly.

Do not treat the prototype as production-ready until the automated build passes and the checklist has been completed on the target Windows/Word/WPS installation.
