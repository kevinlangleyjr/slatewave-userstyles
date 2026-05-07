# Contributing

Thanks for wanting to extend Slatewave to another corner of the web. The bar is simple: the site should look like every other Slatewave-themed surface — slate base, teal accents, the same named colors used the same way.

---

## Add a new site

1. **Copy the template.**

   ```sh
   cp -R template styles/<site>
   ```

   Use the bare hostname for the directory: `styles/github`, `styles/gitlab`, `styles/news.ycombinator.com`. Keep it lowercase.

2. **Fill in `meta.json`.** At minimum:

   - `name` — display name, e.g. `Slatewave for GitHub`
   - `namespace` — stable identifier, e.g. `getslatewave.com/github`
   - `version` — start at `0.0.1`, bump per release
   - `description` — one short sentence
   - `domains` — array of hostnames the style applies to (e.g. `["github.com", "gist.github.com"]`)
   - `supportURL` — issues URL for this repo

3. **Write `style.css`.** Author plain CSS scoped to the target site. Don't include the `@-moz-document` wrapper — the build script adds it. A few rules:

   - Prefer overriding the site's CSS custom properties at `:root` over selector-by-selector overrides. It survives upstream redesigns much better.
   - Use the [Slatewave palette](README.md#palette). Don't introduce new hues. If you need a shade between two anchors, use a Tailwind step from the same family.
   - When you must use a brittle class selector, leave a comment with the date — those break and we'll need to find them.

4. **Build and test.**

   ```sh
   npm run build
   ```

   Drag-and-drop `styles/<site>/slatewave.user.css` into Stylus, or paste its contents into a new Stylus rule. Reload the target site.

5. **Add a per-style `README.md`** describing what's themed and any caveats. Drop a screenshot in `styles/<site>/assets/preview.png` if you can.

6. **Update the table** in the root [`README.md`](README.md#available-styles).

7. **Open a PR** with a before/after screenshot.

---

## Palette discipline

The whole point of Slatewave is that one set of colors keeps showing up across every tool. New hues drift the family.

- Surfaces (backgrounds, borders): the slate ramp from `#282c34` down to `#0f172a`.
- Foreground text: `#e2e8f0` body, `#cbd5e1` muted, `#64748b` faint.
- Accents (primary teal): `#5eead4`. Hover: `#99f6e4`.
- Semantic: success → `#5eead4`, info → `#7dd3fc`, warning → `#fbbf24`, danger → `#fb7185`, attention/highlight → `#fbbf24`.

If a site needs a hue that isn't in the palette, open an issue first.

---

## Versioning

Each `meta.json` has its own `version`. Bump it when you publish meaningful changes — Stylus uses it for update detection. Loose semver:

- patch — selector tweak, color nudge
- minor — new section themed, support for a new subdomain
- major — palette overhaul, breaking selector rewrite

---

## License

By contributing, you agree your contribution is released under WTFPL — same as the rest of the repo.
