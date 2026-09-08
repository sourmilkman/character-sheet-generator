# Storage and Café integration boundaries

This application is separate from M&S Cartoon Café Meme Creator. The supplied Café repository and Dropbox folder are integration context only. No assets were downloaded, changed or committed.

Future Dropbox implementation: implement CharacterAssetStore and an authenticated ProjectStore with per-user authorization. Keep OAuth credentials and tokens server-side; add environment variable names to .env.example without values. Use least-privilege access and explicit save/load operations. Never expose anonymous photo URLs or fetch arbitrary user-supplied URLs.

Suggested future path: Character-Sheets/<subject-id>/project.json, source-refs/, generated/, metadata.json. Source refs remain distinguishable from generated sheets. Saved templates must never carry photographic identities.

The V1 exported manifest is schemaVersion 1. A future Café importer should reject unknown versions, validate paths under characters/<id>/, preserve reference roles, show the user the selected subject and never substitute a different subject's sheet. `characterSheet:null` means no generated artifact is present; do not treat it as a successful generation. Once a user saves ChatGPT's output, a future import step can record character-sheet.png explicitly.

No DropboxAssetStore or OpenAIAPIProvider stub pretends to work. Those remain future implementations behind the documented interfaces.
