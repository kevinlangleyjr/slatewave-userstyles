# Slatewave for GitHub

Slate base, teal accents, applied to [github.com](https://github.com) and [gist.github.com](https://gist.github.com).

> _Slate below, teal above._

## Install

1. Install [Stylus](https://github.com/openstyles/stylus) for your browser.
2. Click [`slatewave.user.css`](slatewave.user.css?raw=1) — Stylus will offer to install.
3. Reload GitHub. Slatewave applies regardless of your GitHub theme setting (auto / dark / light).

## What it styles

- **Surfaces** — page canvas, cards, modals, code blocks all map to the slate ramp (`#282c34` → `#1e293b` → `#0f172a`).
- **Accents** — links, active tabs, primary buttons, open-issue/PR icons all resolve to teal `#5eead4`.
- **Status colors** — open is teal, closed is rose, completed is purple, attention is amber.
- **Diffs** — additions read in teal, deletions in rose, with subtler line backgrounds than the upstream green/red.
- **Syntax highlighting** — matches the [VSCode Slatewave](https://github.com/kevinlangleyjr/vscode-slatewave) palette so code reads the same in PRs as it does in your editor.
- **CodeMirror** — the inline editor (issue/PR composer, gist edit) gets the same treatment.

## How it works

The style overrides GitHub's [Primer design tokens](https://primer.style/foundations/primitives/color/) at the `html` root for every `[data-color-mode]` permutation. That means:

- Slatewave wins regardless of the user's GitHub theme setting.
- Most surfaces theme automatically as GitHub adds them, because they consume the same token set.
- Only the surfaces that bypass tokens need surgical selector overrides — see the bottom of [`style.css`](style.css).

## Caveats

- GitHub ships UI changes constantly. If a surface looks unthemed, it's probably a new component using a token we haven't mapped yet — open an issue with a screenshot.
- Brand-colored surfaces (Copilot, Sponsors banners, marketing pages) are intentionally left mostly alone.

## Palette

See the [root README](../../README.md#palette) for the full Slatewave palette and role mapping.
