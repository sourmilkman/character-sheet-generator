# Character Sheet Generator

Private/internal ChatGPT-native character-sheet preparation app. This is a **separate project** from the M&S Cartoon Café Meme Creator (`sourmilkman/CAFECLOUDMEME`). It does not edit that app or access its Dropbox folder.

## Install on your Android phone

Open **https://sourmilkman.github.io/character-sheet-generator/** in Chrome. Tap **⋮ → Add to Home screen → Install**, or use the in-app Install button when offered. Open it once online to prepare offline use. No PC or MCP server is needed for this edition.

Add photos, choose your preset, Preview, then **Prepare for ChatGPT**. This saves the draft locally and shows **Copy prompt for ChatGPT**, **Open ChatGPT**, and photo sharing where supported. Attach the selected original photos using ChatGPT's photo picker, paste the prompt and send. Individual photo downloads are available; no ZIP extraction is required for the normal mobile workflow.

The editor and saved drafts work offline after the first successful load. ChatGPT still needs internet. Drafts stay in this browser/device and do not automatically transfer from the local PC URL. Clearing site data deletes local drafts. Keep exports as backups. Updates wait until you choose **Update app**; save your current draft first.

GitHub Pages serves public application code only. Photographs are never uploaded to Pages, and the service worker caches only the application shell. On github.io, browser storage is shared by origin with the owner's other Pages apps: this is not a secure multi-user vault. Use only trusted apps on that origin, or host on a dedicated domain for stronger isolation.

## Run on your PC

Open PowerShell in this folder:

```powershell
npm ci
npm run build
npm start
```

Open **http://127.0.0.1:4318**. Leave the terminal running. The ordinary browser editor supports uploads, drafts, prompt preparation and ZIP export. ChatGPT-specific generation handoff becomes available only inside a connected ChatGPT widget. The build produces two editions: dist/pwa is the installable standalone Pages app; dist/index.html remains the separate ChatGPT MCP widget. Pages does not run the MCP server.

Node.js 22+ is recommended. No OpenAI API key is required. The footer identifies version, source commit, build time and build model. `npm run dev` builds and starts without a watch process. Set `PORT` in your shell to override the default. `.env.example` documents settings; `.env` is not automatically loaded.

## Purpose and identity contamination

An example sheet containing someone else can transfer that person's identity into a new result. This app never supplies a visual layout example. The sheet design exists only as text. Every selected photograph must depict the target subject. V1 rejects non-identity roles during validation, and the selection engine excludes them independently. This prevents the app from packaging a foreign layout identity; it cannot guarantee an image model's compliance or likeness.

## Architecture and files

```text
server/index.ts                 Stateless Streamable HTTP MCP server
web/main.tsx, styles.css        Mobile-first React editor
web/uploads.ts                 Image decoding, size/type/hash checks
web/bridge.ts                  MCP Apps + optional ChatGPT extensions
web/storage.ts                 IndexedDB and ZIP export
shared/model.ts                Versioned Zod schemas, project factory
shared/presets.ts              Textual layouts and exact labels
shared/references.ts           Deterministic selection and validation
shared/characterSheetPromptBuilder.ts  Pure 15-section prompt builder
shared/export.ts               Versioned Café manifest
scripts/build.ts               Self-contained widget bundle
scripts/check-mcp.ts           Real MCP client smoke check
tests/                         Domain and browser contract tests
docs/                          Handoff, privacy and extension notes
BUILD_NOTES.md                  Decisions and upstream revision
```

The interactive-decoupled pattern keeps the editor mounted. `open_character_sheet` renders the UI; `prepare_character_sheet` is a pure validated transformation with no output template. Tools declare read-only, non-destructive, closed-world and idempotent annotations. Tools do not fetch or store photos. UI HTML uses `text/html;profile=mcp-app` and standard `_meta.ui.resourceUri`. The bundled widget has no external asset domains.

## Official OpenAI approach

Docs checked 2026-09-08: Apps SDK URLs now redirect to Plugins documentation. The implementation adapts the official React send-message pattern and current quickstart server wiring. The older kitchen-sink SSE/skybridge server was inspected, but current Streamable HTTP and MCP Apps metadata are used. Upstream revision is recorded in BUILD_NOTES.md.

- [UI and image state](https://developers.openai.com/plugins/build/chatgpt-ui)
- [Upload and follow-up API reference](https://developers.openai.com/plugins/reference)
- [MCP/UI quickstart](https://developers.openai.com/plugins/build/app-quickstart)
- [Official examples](https://developers.openai.com/plugins/build/examples)
- [Connect and test](https://developers.openai.com/plugins/deploy/connect-chatgpt)

## Connect to ChatGPT

1. Run the local server and check `http://127.0.0.1:4318/health`.
2. Use OpenAI's [Secure MCP Tunnel](https://developers.openai.com/api/docs/guides/secure-mcp-tunnels) to connect this private HTTP MCP server at `http://127.0.0.1:4318/mcp`. This requires a tunnel associated with your ChatGPT workspace and its tunnel client. No tunnel or account association is created by this repository.
3. In current documented ChatGPT settings, choose **Security and login → Developer mode**. Availability depends on the account/workspace.
4. Open ChatGPT Plugins, select **+**, name it **Character Sheet Generator**, choose **Tunnel**, and select your tunnel or enter its ID. Review the two discovered tools.
5. In a new conversation, enable the connection and ask: “Open Character Sheet Generator.”
6. Add your subject photos in the widget. Preview, then Generate. Verify the selected images are available to ChatGPT and that the conversation produces the requested sheet.
7. After code changes, rebuild/restart the server, refresh the connection metadata and test in a new conversation.

A public HTTPS `/mcp` endpoint is another documented connection method. This app intentionally binds to loopback and ships no public deployment or authentication service. Use an authenticated deployment before serving it publicly. A private GitHub repository alone does not authenticate a running server.

Live ChatGPT account/tunnel setup and actual image output are not covered by a successful local browser test. See docs/HANDOFF.md for the exact capability boundary. GitHub Pages hosts the standalone mobile editor, not this optional MCP server.

## Photos and reference ranking

Add 1–10 JPG, PNG or WebP images, up to 20 MB each. Images must decode successfully; identical file bytes are rejected by SHA-256. Batches that exceed 10 or contain a duplicate fail before changing the reference set. HEIC and other types need conversion first. File picker and desktop drag/drop are supported. You can replace, delete, reorder, select a primary reference, classify and add photo notes. The first added image is initially primary; this does not claim it is a frontal face.

Automatic ranking uses up to four facial references (primary/front/three-quarter/profile), two body references (front/three-quarter/side/rear), and one detail reference (hair/clothing/expression/other). Primary is always first; ties retain user order. Unclassified photos are “Other Identity Reference”; classify them to improve coverage. Manual selection overrides automatic inclusion and must retain the primary photo. No face recognition or automatic subject classification is used.

The selected reference preview is the exact intended package. Confirm all photographs depict one subject. No frontal face, no body photo for turnarounds and sparse facial coverage produce warnings. No photos, missing primary, empty selection, missing one-subject confirmation, invalid preset and non-identity roles block generation.

## Identity Lock, presets and prompts

Optional fields cover name/display name, approximate age, sex, height/build, hair/hairline/facial hair, eyes, glasses, skin, identifying features, clothing, jewellery, tattoos, scars and physical/other notes. Blank fields are omitted.

Presets: Standard, Portrait Identity, Full Production, Café Staff and Custom. Custom provides individual component toggles. Choose landscape, portrait or square; white/pale neutral/light grey background; neutral or soft diffused studio light; labels, custom details, exclusions and generation notes. Café uniform instructions appear only in the Café preset or supplied metadata. Badge details require supplied evidence.

The pure prompt builder emits the requested fifteen sections with identity preservation, anatomy, consistency, reference priority, textual layout and exact labels. Preview supports Copy, Download and Edit Prompt. An immutable identity block is prefixed to edited prompts. “Regenerate Prompt from Settings” discards the override. An edited prompt remains in effect when settings change; review it or regenerate before sending.

## Projects and templates

Save Draft stores a validated project and image blobs together in browser IndexedDB. Recent supports open, duplicate and delete. Save as Template stores layout/settings only, excluding subject metadata and photographs. Four built-in templates are always available. Storage errors are shown. Widget/browser storage can be isolated, evicted or unavailable; this is local persistence, not a durable cross-device service. Export files provide portable source data; V1 does not have a ZIP re-import UI. Files are not uploaded to the MCP server or Dropbox by Save Draft.

## Café Meme Creator export

“Export for Café Meme Creator” creates a ZIP:

```text
characters/<subject-slug>/
  manifest.json
  project.json
  prompt.txt
  refs/01-front-face.png
  refs/...
```

The manifest contains schemaVersion, id, name, metadata, role/classification, source paths and textual layout. `characterSheet` is `null`, generation status is `prepared`, and `outputReceived` is false. This app cannot automatically retrieve ChatGPT's generated output. Save the finished sheet manually; a future importer can add its path. The existing Café app's importer has not been verified or modified. This is an explicit interchange package, not a claim of direct cross-app synchronization.

## Dropbox and future providers

`ProjectStore` exposes save/load/list/delete. `CharacterAssetStore` exposes saveProjectAssets/loadProjectAssets. `LocalProjectStore` implements both. A future authenticated `DropboxAssetStore` can replace the asset implementation; see docs/EXTENSIONS.md. There are no Dropbox secrets or API calls in V1.

`GenerationProvider.prepareGeneration` isolates preparation. `ChatGPTConversationProvider` implements it and the documented handoff. **OPTIONAL FUTURE API MODE:** an explicitly opt-in provider could offer billable API generation after pricing/consent design; no such provider or image API endpoint is implemented here.

## Privacy and limitations

Photographs reside in browser memory, browser IndexedDB after explicit Save, ChatGPT after Generate where uploadFile is supported, and downloaded ZIPs after Export. ChatGPT account retention rules apply to uploaded files. Deleting local photos/drafts does not delete files already uploaded to ChatGPT. Host file IDs are retained only in runtime memory for retry; no temporary download URLs are stored. Metadata is sent to the MCP prepare tool and ChatGPT on Generate; images never pass through this MCP server. No analytics, unrelated third-party transmission, public photo storage, secrets or real photos are included. Source images are exported unchanged and may retain EXIF metadata. Browser drafts/downloads are not encrypted by this app.

The app prepares a request; it cannot guarantee ChatGPT image-tool availability, identity fidelity, exact labels or anatomy. It does not infer hidden rear-body details, fetch generated sheets, sync devices or integrate Dropbox. Mobile layout is tested at 384×854 CSS pixels; a physical Galaxy S21 Ultra and the actual ChatGPT iframe need separate verification.

## Checks

```powershell
npm run typecheck
npm run lint
npm test
npm run build
npx playwright install chromium
npm run test:browser
npm run test:pwa
# With npm start running:
npx tsx scripts/check-mcp.ts
```

Tests use anonymous synthetic geometric images only. The named staff acceptance case contains text metadata, not personal photographs. Browser handoff tests simulate host extensions and do not prove live ChatGPT image generation. See docs/VALIDATION.md for recorded results.
