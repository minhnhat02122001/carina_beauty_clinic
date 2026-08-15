---
name: i18n-check
description: Verifies that src/messages/en.json and vi.json have identical key sets. Use when adding/editing translation strings, before considering an i18n-related change done, or when asked to check for missing/broken translations in the Carina Beauty Clinic site.
---

Run the parity checker:

```
node .claude/skills/i18n-check/check-parity.js
```

- Exit code `0` and an `OK` line means every locale file has the same keys.
- Exit code `1` lists each key and which locale(s) it's missing from, e.g.
  `MISSING "Home.testExtraKey" in: vi`.

If it reports missing keys, add the missing key/translation to the locale
file(s) listed — ask the user for the Vietnamese copy if it isn't obvious,
per this project's [[i18n rules]](../../rules/i18n.md) rather than guessing
a translation.
