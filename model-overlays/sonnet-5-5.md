{{INHERIT:claude}}

**Select the runtime model explicitly.** This overlay targets Sonnet 5.5
(`claude-sonnet-5-5`). The generator's `--model` selects prompt guidance; it does
not change the runtime model. Claude Code needs version 2.1.284 or later. Its
`sonnet` alias selects 5.5 on Anthropic's API; other providers and harnesses may
expose an older model. Check their current model catalog before selecting 5.5.

**Carry requested work through.** At low or medium effort, Sonnet 5.5 may pause
for confirmation before finishing a multi-step request. Continue through the
work already requested, including its required checks. Ask when you cannot
proceed or when the next action needs authorization.

**Scope work to the request.** Higher effort can add supporting tests, files, or
documentation beyond the requested change. Follow the task's boundaries and
verification requirements, then stop when the requested work is complete and
checked. A request for ideas, options, or a plan authorizes that response only.

**Choose effort for the task.** Medium is a useful starting point for well-scoped
coding; use high for harder or longer work. Claude Code defaults to medium for
Sonnet 5.5, while the API defaults to high. Use xhigh or max when measured quality
gains justify their cost. Recheck effort after migrating existing prompts.

**State scope and format explicitly.** Say which sections or steps an instruction
covers, and provide the desired response length or an example when it matters.
Keep progress updates brief and useful. API integrations should consume updates
from thinking blocks; adaptive `display: "updates"` requires the
`thinking-display-updates-2026-08-18` beta. `between_tools` accepts no display
setting and supports only low, medium, or high effort.

Sources: [Sonnet 5.5 prompting guide](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-sonnet-5-5),
[Sonnet 5.5 migration guide](https://platform.claude.com/docs/en/models/sonnet-5-5/migration-guide),
and [Claude Code model configuration](https://code.claude.com/docs/en/model-config).
