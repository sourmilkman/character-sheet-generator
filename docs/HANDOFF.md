# Handoff contract

Current official reference: https://developers.openai.com/plugins/reference and https://developers.openai.com/plugins/build/chatgpt-ui (checked 2026-09-08).

1. Validate the versioned project, exact selected IDs and one-subject confirmation.
2. Build the deterministic specification. It has identityReferences, empty nonIdentityReferences and textualSheetSpecification.
3. On the explicit Generate click, upload each selected user photograph using optional `window.openai.uploadFile(File)`. Reuse a successful in-memory handle on retry; stop on failure without sending the follow-up.
4. If the standard MCP bridge is connected, call prepare_character_sheet to validate the project on the server. This sends metadata only.
5. Call synchronous `setWidgetState({modelContent: specification, privateContent: {projectId}, imageIds})`. Only real IDs returned by the host's upload helper are used.
6. Send MCP `ui/message` through the official ext-apps wrapper `App.sendMessage({role:'user',content:[{type:'text',text:prompt}]})`. The compatible extension `sendFollowUpMessage({prompt,scrollToBottom:true})` is used only when the portable bridge is unavailable.

The message has no attachments property. Documented widget imageIds make images available on later turns. This is not a documented imperative image-generation API and does not guarantee the image tool runs. The prompt tells ChatGPT to request attachments if it cannot see the selected images. Successful send means request sent, never “image generated.”

Without uploadFile, setWidgetState or messaging capability: no images are uploaded, and a three-step manual workflow is displayed. Download the ZIP, attach only its selected refs in a new ChatGPT conversation, and copy/paste the prompt. The local editor cannot silently attach files to another site.

Test the actual host using one, four and ten selected photos, retries, host themes, denied upload and missing extensions. Confirm correct identity input visually and inspect generated output separately. Contract mocks verify payload ordering only.
