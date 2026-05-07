<div align="center">

<img src="https://getslatewave.com/brand/icon.png" alt="" height="64" align="middle">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://getslatewave.com/brand/wordmark-light.png">
  <img alt="Slatewave" src="https://getslatewave.com/brand/wordmark.png" height="64" align="middle">
</picture>

# Slatewave Userstyles

Soothing slate, signature teal — for the websites you live in.

> _Slate below, teal above._

</div>

---

## What this is

A monorepo of [userstyles](https://github.com/openstyles/stylus) that retheme third-party websites in the Slatewave palette. Each style is a hand-tuned override that respects the site's structure but swaps the palette for slate + teal.

The collection starts with **GitHub** and is built to grow.

---

## Available styles

| Site | Status | Install |
|---|---|---|
| [GitHub](styles/github) | dark | [`slatewave.user.css`](styles/github/slatewave.user.css?raw=1) |

More on the way — see [open issues](https://github.com/kevinlangleyjr/slatewave-userstyles/issues) for the request queue, or [propose a site](#contributing).

---

## Installation

1. Install the [Stylus](https://github.com/openstyles/stylus) browser extension ([Chrome](https://chrome.google.com/webstore/detail/stylus/clngdbkpkpeebahjckkjfobafhncgmne) · [Firefox](https://addons.mozilla.org/firefox/addon/styl-us/) · [Edge](https://microsoftedge.microsoft.com/addons/detail/stylus/fjnbnpbmkenffdnngjfgmeleoegfcffe)).
2. Click the install link for the site you want above (or click the `slatewave.user.css` file in this repo and use the **Raw** button).
3. Stylus will prompt you to install. Confirm.
4. Reload the site — Slatewave should be applied.

> [!NOTE]
> The CSS files in `styles/<site>/slatewave.user.css` are committed build artifacts. You can install them directly without cloning or running the build.

---

## Palette

All styles share the Slatewave palette:

| | Hex | Tailwind | Role |
|---|---|---|---|
| ![#282c34](https://placehold.co/20x20/282c34/282c34.png) | `#282c34` | — | editor background |
| ![#21252b](https://placehold.co/20x20/21252b/21252b.png) | `#21252b` | — | sidebar, tabs |
| ![#1e293b](https://placehold.co/20x20/1e293b/1e293b.png) | `#1e293b` | slate-800 | status bar, modals, code blocks |
| ![#334155](https://placehold.co/20x20/334155/334155.png) | `#334155` | slate-700 | borders, dividers |
| ![#e2e8f0](https://placehold.co/20x20/e2e8f0/e2e8f0.png) | `#e2e8f0` | slate-200 | body text |
| ![#5eead4](https://placehold.co/20x20/5eead4/5eead4.png) | `#5eead4` | teal-300 | **primary accent** |
| ![#99f6e4](https://placehold.co/20x20/99f6e4/99f6e4.png) | `#99f6e4` | teal-200 | hover accent |
| ![#7dd3fc](https://placehold.co/20x20/7dd3fc/7dd3fc.png) | `#7dd3fc` | sky-300 | links, info |
| ![#38bdf8](https://placehold.co/20x20/38bdf8/38bdf8.png) | `#38bdf8` | sky-400 | external links, keywords |
| ![#b388ff](https://placehold.co/20x20/b388ff/b388ff.png) | `#b388ff` | — | decorators |
| ![#fb7185](https://placehold.co/20x20/fb7185/fb7185.png) | `#fb7185` | rose-400 | errors, danger, deletions |
| ![#fbbf24](https://placehold.co/20x20/fbbf24/fbbf24.png) | `#fbbf24` | amber-400 | warnings, attention |

---

## How it's organized

```
slatewave-userstyles/
├── styles/
│   └── <site>/
│       ├── meta.json           # name, namespace, version, supportURL
│       ├── style.css           # plain CSS source (what you author)
│       ├── slatewave.user.css  # build artifact (what users install)
│       └── README.md           # what this style covers
├── template/                   # copy this to start a new site
├── scripts/
│   └── build.mjs               # wraps style.css with UserCSS metadata
├── package.json
└── LICENSE                     # WTFPL
```

Each style is authored as plain CSS in `style.css`. The build script reads `meta.json` and emits `slatewave.user.css` with a Stylus-compatible UserCSS metadata header.

---

## Building

Requires Node 18+. No runtime dependencies.

```sh
# Build every style
npm run build

# Verify built artifacts are up-to-date with sources (for CI)
npm run build:check
```

---

## Contributing

Want a site styled? Two ways in:

1. **Open an issue** with the URL and a few screenshots of the parts that bug you most.
2. **Submit a PR** by copying `template/` to `styles/<site>/`, filling in the meta, writing the CSS, and running `npm run build`.

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for the playbook.

---

## Slatewave family

One palette. Every tool. See [getslatewave.com](https://getslatewave.com) for the full set — editors, terminals, prompts, notes, launchers, and now the websites in between.

---

## License

WTFPL — Do What The Fuck You Want To Public License. See [LICENSE](LICENSE).
