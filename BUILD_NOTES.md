# Character Sheet Generator — build decisions

Separate from M&S Cartoon Café Meme Creator / sourmilkman/CAFECLOUDMEME. No Café code or Dropbox files are modified. Export is a versioned interchange package, not a claimed existing importer.

Primary archetype: interactive-decoupled. React widget in web/, pure TypeScript domain engine in shared/, stateless MCP server in server/. open_character_sheet renders; prepare_character_sheet validates and prepares without remounting. No OpenAI model API dependency, API key, image endpoint, analytics, or public photograph storage.

Sources checked 2026-09-08: official OpenAI Apps SDK URLs now redirect to /plugins. Current quickstart supplies Streamable HTTP and MCP Apps resource registration. Official send-message React example supplies the App bridge pattern; kitchen-sink server inspected but its older SSE/skybridge metadata is replaced with current documented registration. Example revision: 18cc38e78a968712c357bacdc3c79fead5bfc6b4.

- https://developers.openai.com/plugins/build/app-quickstart
- https://developers.openai.com/plugins/build/chatgpt-ui
- https://developers.openai.com/plugins/reference
- https://developers.openai.com/plugins/build/mcp-server
- https://developers.openai.com/plugins/plan/tools
- https://developers.openai.com/plugins/build/examples
- https://github.com/openai/openai-apps-sdk-examples/tree/18cc38e78a968712c357bacdc3c79fead5bfc6b4/src/send-message

Handoff: feature-detect uploadFile and setWidgetState. Upload only selected user photographs on Generate; publish exact selected file IDs in structured widget state imageIds, then send ui/message through ext-apps App.sendMessage. No fabricated attachments property. This makes images available on later turns; it does not guarantee invocation of ChatGPT's image generator or output likeness. Missing capabilities use export + manual attachment + copy prompt. ChatGPT's live host loop must be distinguished from mocked browser contract checks.

Persistence: explicit local IndexedDB drafts and image blobs, with downloadable backup/export. Isolated host storage may be unavailable/evicted and does not sync devices. No claim of durable server persistence. ProjectStore and CharacterAssetStore isolate future authenticated storage. Host image handles remain in memory, not saved to drafts. No private download URLs are persisted.

Identity controls: V1 rejects non-identity roles for generation, uses textual layouts only, validates one-subject confirmation, selects references deterministically, and never invents blank metadata. Reference coverage comes from user classification, not face recognition. Prompt restrictions improve instructions but cannot guarantee image-model compliance.
