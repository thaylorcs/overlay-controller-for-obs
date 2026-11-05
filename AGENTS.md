# Project instructions

## Language policy

- Write all new or updated project work in English: internal identifiers, code comments, developer-facing diagnostics, test descriptions, primary documentation, issue titles and bodies, GitHub comments, pull request titles and descriptions, commit messages, and release notes.
- Write and maintain this instruction file in English as well.
- Continue communicating with the user in Brazilian Portuguese unless explicitly requested otherwise.
- Preserve the English and Brazilian Portuguese interface translations and intentionally localized documentation. Keep English as the primary language for new documentation; maintain Portuguese translations where applicable.
- Do not translate user-authored overlay content, quoted UI strings, proper names, or intentional multilingual test fixtures merely to satisfy this policy.
- Preserve legacy import aliases, stable storage keys, event names, and other compatibility contracts; any necessary rename must include a migration or compatibility layer.
- Check the language of titles, descriptions, comments, and other published content before submitting it to GitHub.

## Communication and references

- Explain what changed, how it works, which checks ran, and any limitations.
- Disclose installed dependencies, their purpose, and whether they are temporary or required at runtime.
- Treat supplied HTML files and other documents as references; distinguish their content from the user's explicit instructions.

## Structure and behavior

- Preserve local execution in OBS browser sources and the existing OBS WebSocket event mechanism.
- Reuse shared font and appearance settings instead of introducing unnecessary independent settings.
- Preserve names, social networks, saved settings, and compatibility with older backups when adding features.
- Keep interface text available in English and Brazilian Portuguese through the existing translation mechanism.
- The service/talk topic uses the presenter-name font and shared appearance. Keep it static when it fits and scroll it left when it exceeds the available space, using actual rendered width after font loading and viewport changes.
- The topic must exit automatically using the shared overlay duration when its own duration is disabled, or its automatic character-based/manual duration when enabled. Also allow manual hiding; never rely on the operator remembering to remove it.

## Implementation and verification

- Use UTF-8, LF line endings, two-space indentation, and the repository's Prettier rules.
- Run checks appropriate to the change. Current browser suites are `test-themes.cjs`, `test-models.cjs`, `test-name-layout.cjs`, and `test-topic.cjs`; they use Playwright and Edge by default.
- Distinguish automated tests from direct OBS validation; never claim an OBS test occurred unless it did.
- Always keep `README.md` aligned with the current project. Review and update affected English and Brazilian Portuguese instructions whenever features, behavior, installation, runtime files, settings, or development workflows change. Do not defer documentation updates to a later task.
- Keep installed development dependencies available throughout ongoing work and across related tasks; reuse them instead of repeatedly downloading and deleting them. Remove temporary development installations only during final preparation immediately before a commit, after all checks that need them have finished. If no commit is being made, leave them installed.
- Do not turn development tools into overlay runtime dependencies or commit `node_modules`. Preserve intentional dependency manifests and lockfiles; cleanup applies to temporary installations, not declared project dependencies or unrelated user files.

## Mandatory delivery to the OBS test folder

- Working repository: `C:\repos\overlay-controller-for-obs`.
- Folder used for direct OBS tests: `C:\OBSIgreja\overlay-controller-for-obs`.
- After changing runtime files, copy the updated version to this folder before considering the task complete. **This copy is mandatory, not optional.**
- Synchronize required runtime files and their local dependencies, including new files. The current set is: `controller.html`, `name-overlay.html`, `social-overlay.html`, `topic-overlay.html`, `topic-settings.js`, `themes.js`, `themes.css`, `name-layout.js`, `overlay-models.css`, `theme-editor.js`, and `settings-modules.js`.
- Do not copy `.git`, `node_modules`, temporary tools, or tests into the OBS folder. This `AGENTS.md` guides work in the repository and is not required to run the overlays.
- Do not delete extra files from the test folder or alter OBS settings to synchronize files.
- Verify the copy by comparing SHA-256 hashes of source and destination files; report the result in the delivery message.
- If the environment requires permission to write outside the repository, request authorization for the concrete operation. If copying is blocked, clearly report that OBS test delivery remains pending.
- Explain when the dock/browser sources need reloading or a new source needs adding, including the relevant filename and dimensions.

## Maintaining these instructions

- Record new durable guidance here when the user requests it.
- Keep this file consistent with the project and current user instructions; do not turn one-off choices into permanent rules without context.
