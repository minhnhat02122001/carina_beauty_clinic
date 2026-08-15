#!/usr/bin/env node
let data = "";
process.stdin.on("data", (chunk) => (data += chunk));
process.stdin.on("end", () => {
  let command = "";
  try {
    command = JSON.parse(data).tool_input?.command ?? "";
  } catch {
    process.exit(0);
  }

  const DANGEROUS = [
    /git\s+push\s+[^\n]*(--force|-f)\b[^\n]*\b(main|master)\b/i,
    /git\s+push\s+[^\n]*\b(main|master)\b[^\n]*(--force|-f)\b/i,
    /git\s+reset\s+--hard/i,
    /git\s+clean\s+-[a-z]*f/i,
    /\brm\s+-rf\s+\/(\s|$)/i,
  ];

  const hit = DANGEROUS.find((re) => re.test(command));
  if (hit) {
    console.log(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          permissionDecision: "deny",
          permissionDecisionReason:
            "validate-bash hook: this command looks destructive (force-push to main/master, git reset --hard, git clean -f, or rm -rf /). Run it manually outside Claude Code if this is really intended.",
        },
      }),
    );
  }
  process.exit(0);
});
