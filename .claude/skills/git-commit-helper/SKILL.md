---
name: git-commit-helper
description: Generate descriptive commit messages by analyzing git diffs following the project's specific policy. Use when the user asks for help writing commit messages or reviewing staged changes.
---

# Git Commit Helper

## Instructions

When the user requests a git commit or help with a commit message, follow these steps:

1. **Analyze changes**: Review staged and unstaged changes to understand the scope and purpose of the work.
2. **Determine Domain**: Identify the primary component or domain affected (e.g., `(nfs)`, `(open-webui)`). Use lowercase and kebab-case.
3. **Select Type & Gitmoji**: Choose the appropriate type and its corresponding gitmoji from the table below.
4. **Draft Message**: Create the message in English using the required format.

### Format

```
<gitmoji> <type>(<domain>): <title>

<description>
```

- **Title**: Concise, imperative mood, lowercase after the type.
- **Description**: Optional, explain "why" or provide context.
- **Co-Authored-By**: Do **not** add a co-author line in the message. Cursor adds `Co-authored-by: Cursor <cursoragent@cursor.com>` automatically when the agent runs `git commit`; adding one in the message causes a duplicate.
- **No Session Metadata**: NEVER append session infomation or session links (e.g. `Claude-Session:` lines) to commit messages. This is a public repository and session URLs are confidential.
- **Skill-File Changes**: `SKILL.md` files define agent behavior, not just documentation — use `fix` (corrections/refinements to an existing skill) or `feat` (new capability/rule added to a skill), never `docs`, for changes to them. Set the domain to `skills/<skill-name>` (e.g. `(skills/git-commit-helper)`) so it reads distinctly from other domains in this repo.

### Gitmoji & Type Mapping

| Gitmoji | Type | Description |
| :--- | :--- | :--- |
| 🎉 | `init` | Initial commit of a project |
| 🔧 | `chore` | Routine maintenance or minor corrections |
| 🛠️ | `fix` | Intentional functional configuration changes |
| ✨ | `feat` | New features |
| ✏️ | `typo` | Fix a typo |
| 🐛 | `bug` | Fix a bug |
| ⬆️ | `dep` | Upgrade dependencies |
| 🔐 | `security` | Add or update secrets |
| 🗑️ | `remove` | Deprecate or clean up code |
| ♻️ | `refactor` | Refactor code |
| 📄 | `docs` | Add or update documentation |
| 📝 | `article` | Add or update articles (content/workload, not project code) |
| 🎨 | `style` | Improve structure / format |
| ⚡ | `perf` | Improve performance |
| ✅ | `test` | Add, update, or pass tests |
| 🔨 | `build` | Add or update development scripts |
| 🚀 | `release` | Cut or merge a release (e.g. the release-proposal PR title/merge commit) |

#### Automated / Bot Commits
Commits created entirely by automation (e.g., Dependabot, Renovate) without direct user or agent involvement use a dedicated pairing, kept separate from the manual mapping above:

| Gitmoji | Type | Description |
| :--- | :--- | :--- |
| 🤖 | `ci` | Added automatically by a bot/automation (e.g., Dependabot), not by direct user intervention |

Configure this pairing directly in the automation tool itself, not by hand-editing bot commits after the fact. For Dependabot, set `commit-message` in `dependabot.yml` for every `package-ecosystem` entry:
```yaml
commit-message:
  prefix: "🤖 ci"
  prefix-development: "🤖 ci"
  include: "scope"
```
This renders as `🤖 ci(deps): bump <package> from X to Y` for production dependencies and `🤖 ci(deps-dev): ...` for development ones (the `(scope)` comes from `include: "scope"`, not from manually typing a domain). Without this config, Dependabot's default has no gitmoji at all, e.g. `build(deps): bump the production-dependencies group with 6 updates` — that default is the bug to fix, not a format to tolerate.

## Workflow

1. **Propose message**: Present the drafted message in a markdown code block. If the changes span multiple semantically distinct concerns, split them into separate commits and present all of them together.
2. **Request confirmation**: Ask the user if they want to proceed with the commit(s).
3. **Commit & Push**:
   - Only execute `git commit` after explicit user approval.
   - After committing, ask if they want to push to the remote.
   - Only execute `git push` after receiving explicit user approval.

## Additional Resources

- For concrete usage examples, see [examples.md](examples.md)
