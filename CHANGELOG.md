# Changelog

Published versions link to their release and source commit. Unreleased describes changes on the development branch that are not yet included in a tagged release. The exported configuration's `version` field is separate and still defaults to `1.0.0`.

## Unreleased

No changes yet.

## [1.3.0](https://github.com/thaylorcs/overlay-controller-for-obs/releases/tag/v1.3.0) — 2026-11-05

Source: the commit referenced by tag `v1.3.0`.

- Added a separate Topic browser source and dock tab for service/talk messages, using the shared font and appearance.
- Added an optional editable message heading with an accessible visibility switch.
- Added inherited, manual and character-based automatic topic durations, adjustable scroll speed (40–480 px/s, default 160), and a single scrolling pass with automatic exit. The timeout remains a hard limit and can end a pass early.
- Added topic persistence, JSON backup compatibility and browser regression coverage for heading, timing, speed, switches and exit behavior.
- Increased presenter width to 1728 px and added optional expand-first fitting with a 32 px font floor, preview truncation warning and browser regression coverage.
- Documented project instructions and mandatory delivery/hash verification for the local OBS test folder.
- Consolidated English and Brazilian Portuguese setup/operation documentation, documented all 11 runtime files and saving behavior, added real browser-source layout examples, and updated the detailed guide.

## [1.2.0](https://github.com/thaylorcs/overlay-controller-for-obs/releases/tag/v1.2.0) — 2026-10-02

Source commit: [`9d4b250`](https://github.com/thaylorcs/overlay-controller-for-obs/commit/9d4b2506eb5a5abcdd4d7357f5c73f8a2d064bc1).

- Added independent Sidebar and Identity with logo presenter layouts and a Capsule social layout.
- Added local PNG, JPEG or WebP logo upload up to 1 MB, embedded in saved settings and JSON backups.
- Added a decorative Identity placeholder and layout selection independent of color themes.
- Preserved Classic defaults for existing configurations and added model compatibility checks.

## [1.1.0](https://github.com/thaylorcs/overlay-controller-for-obs/releases/tag/v1.1.0) — 2026-10-02

Source commit: [`703ff69`](https://github.com/thaylorcs/overlay-controller-for-obs/commit/703ff69de56de360a3ab2731f53a9d944a603178).

- Added shared Classic, Midnight, Minimal and Light color themes, customizable backgrounds, and live name/social previews.
- Added solid, gradient, transparent and embedded-image backgrounds with surface opacity independent of text.
- Matched the presenter-name background and width to the lower card by default.
- Added collapsible settings modules with General first, expand/collapse controls and remembered open state.
- Expanded minified source and standardized formatting with Prettier and EditorConfig.
- Added browser regression checks for themes, persistence and legacy configurations.

## [1.0.0](https://github.com/thaylorcs/overlay-controller-for-obs/releases/tag/v1.0.0) — 2026-10-02

Source commit: [`fbc7816`](https://github.com/thaylorcs/overlay-controller-for-obs/commit/fbc781602855ca6084d632266aa3940f9ba2b923).

- Initial public release with animated presenter lower thirds, a three-network social overlay and a Custom Browser Dock controller.
- English interface by default, with Brazilian Portuguese translation and a responsive dock layout.
- Configurable colors, system fonts, presenter-name shadow, width, position and automatic display duration.
- JSON configuration import/export and local OBS WebSocket integration with controlled reconnection.
- Embedded YouTube, Facebook and Instagram SVG icons and an OBS-style controller scrollbar.
