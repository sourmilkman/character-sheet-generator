# Local validation — 2026-09-08

Passed:

- Dependency installation; npm audit reported zero vulnerabilities at installation.
- TypeScript strict type checking.
- ESLint recommended TypeScript rules.
- 21 domain tests: upload counts, duplicates, classification, deterministic ranking, primary/manual priority, all prompt sections, metadata omission/insertion, presets, exact labels, identity lock with edited prompts, role exclusion, serialization, manifest, handoff structure and the three requested acceptance scenarios at specification level.
- Production widget bundle; self-contained HTML/CSS/JS.
- Live local MCP client: initialize, list tools/resources, open widget, read correct MCP Apps HTML MIME, reject invalid preparation, prepare valid project.
- Three Chromium browser scenarios: mobile 384×854, desktop 1440×1000, synthetic 1/10/11 photo upload, duplicates/unsupported files, classification, preset switch, preview, IndexedDB save/reload, source ZIP contents, and manual fallback. No page errors or horizontal overflow in the tested flows.
- Simulated ChatGPT extensions: uploaded selected file IDs precede structured widget state and then text follow-up; no invented attachment field. Light theme capture included.
- Desktop/mobile screenshots visually inspected. No real personal photographs used.

Not verified:

- Live ChatGPT connection, actual ChatGPT iframe storage/CSP behavior, account-specific upload capability and actual image generation/likeness. These require an associated Secure MCP Tunnel or an authenticated HTTPS deployment and an enabled ChatGPT connection.
- Physical Galaxy S21 Ultra device behavior.
- Dropbox integration or automatic import into the existing Café app; only interfaces/package specification are provided, as scoped.
- Generated character-sheet retrieval; exported manifests explicitly mark output absent.

Do not equate a simulated host test with an actual ChatGPT image-generation run. The application is locally working; in-ChatGPT acceptance remains pending connection setup.

## Mobile PWA 1.1.0

Passed strict typecheck, lint, 21 domain tests and all three existing widget browser scenarios. Added a PWA browser test at the GitHub repository subpath: manifest/start URL/icons, active service worker, local photo/draft saving, offline reload, draft photo restoration, guided ChatGPT handoff and no horizontal overflow. Service-worker cache inspected: application shell only, no photographs. Android installation UI and native share destinations still require a physical phone check.
