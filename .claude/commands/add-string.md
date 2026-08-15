---
description: Add a new i18n message key to both en.json and vi.json
---

Add the message key/copy described in `$ARGUMENTS` to this project's i18n
files:

1. Pick (or confirm) the namespace it belongs under in
   `src/messages/en.json` (e.g. `Home`, `Nav`, `Services`).
2. Add the key with the English copy to `src/messages/en.json`.
3. Add the same key to `src/messages/vi.json` with a Vietnamese translation.
   If a natural translation isn't obvious, ask the user rather than
   guessing — a wrong translation is worse than a missing one.
4. Reference the key via `useTranslations("<Namespace>")` in the calling
   component — never inline the string.
