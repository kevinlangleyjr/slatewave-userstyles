#!/usr/bin/env node
// Build slatewave.user.css for each style in styles/, plus the aggregate
// import.json that lets users install every Slatewave userstyle in one shot
// via Stylus's Backup → Restore flow.
//
// Reads styles/<site>/meta.json + styles/<site>/style.css and emits a
// Stylus-compatible UserCSS file at styles/<site>/slatewave.user.css. Then
// aggregates all built styles into ROOT/import.json — a Stylus backup-format
// file with each style's source embedded so a single import installs them
// all and wires up updateUrl for auto-updates.
//
// Pass --check to fail (exit 1) if any built artifact (including import.json)
// would change. Useful in CI to ensure committed files are in sync.

import { readdir, readFile, writeFile, stat } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const STYLES_DIR = join(ROOT, "styles");

const checkOnly = process.argv.includes("--check");

async function listSites() {
  const entries = await readdir(STYLES_DIR, { withFileTypes: true });
  return entries.filter((e) => e.isDirectory()).map((e) => e.name);
}

async function readJSON(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

function requireField(meta, field, site) {
  if (meta[field] === undefined || meta[field] === null || meta[field] === "") {
    throw new Error(`styles/${site}/meta.json: missing required field "${field}"`);
  }
}

function buildHeader(meta) {
  // UserCSS metadata block — Stylus-compatible.
  // https://github.com/openstyles/stylus/wiki/Writing-UserCSS
  const lines = [
    `@name           ${meta.name}`,
    `@namespace      ${meta.namespace}`,
    `@version        ${meta.version}`,
    `@description    ${meta.description}`,
    `@author         ${meta.author ?? "Kevin Langley Jr."}`,
    `@homepageURL    ${meta.homepageURL ?? "https://getslatewave.com"}`,
    `@supportURL     ${meta.supportURL}`,
    `@license        ${meta.license ?? "WTFPL"}`,
  ];

  if (meta.preprocessor) {
    lines.push(`@preprocessor   ${meta.preprocessor}`);
  }

  return ["/* ==UserStyle==", ...lines.map((l) => " " + l), "==/UserStyle== */"].join("\n");
}

function buildDocumentBlock(meta, css) {
  const matchers = (meta.domains ?? []).map((d) => `domain("${d}")`);
  if (matchers.length === 0) {
    throw new Error(`meta.domains must contain at least one hostname`);
  }
  const indented = css.replace(/\n/g, "\n  ");
  return `@-moz-document ${matchers.join(", ")} {\n  ${indented}\n}\n`;
}

function repoFromPackage(pkg) {
  // Accepts both shorthand ("owner/repo") and full URL forms.
  const raw = typeof pkg.repository === "string" ? pkg.repository : pkg.repository?.url ?? "";
  const match = String(raw).match(/github\.com[/:]([^/]+)\/([^/.]+)/);
  if (!match) throw new Error(`could not parse GitHub repo from package.json (got: ${raw || "<empty>"})`);
  return { owner: match[1], repo: match[2] };
}

async function buildImportEntry({ site, owner, repo, branch }) {
  const dir = join(STYLES_DIR, site);
  const meta = await readJSON(join(dir, "meta.json"));
  const sourceCode = await readFile(join(dir, "slatewave.user.css"), "utf8");

  return {
    enabled: true,
    name: meta.name,
    updateUrl: `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/styles/${site}/slatewave.user.css`,
    url: `https://github.com/${owner}/${repo}/tree/${branch}/styles/${site}`,
    sourceCode,
    sections: [],
    usercssData: {
      name: meta.name,
      namespace: meta.namespace,
      version: meta.version,
      description: meta.description,
      author: meta.author ?? "Kevin Langley Jr.",
      license: meta.license ?? "WTFPL",
      homepageURL: meta.homepageURL ?? "https://getslatewave.com",
      supportURL: meta.supportURL,
      preprocessor: null,
      vars: {},
    },
  };
}

async function generateImportJson(builtSites) {
  const pkg = await readJSON(join(ROOT, "package.json"));
  const { owner, repo } = repoFromPackage(pkg);
  const branch = process.env.IMPORT_BRANCH || "main";

  const entries = [];
  for (const site of builtSites) {
    entries.push(await buildImportEntry({ site, owner, repo, branch }));
  }
  return JSON.stringify(entries, null, 2) + "\n";
}

async function buildSite(site) {
  const dir = join(STYLES_DIR, site);
  const metaPath = join(dir, "meta.json");
  const cssPath = join(dir, "style.css");
  const outPath = join(dir, "slatewave.user.css");

  let metaStat, cssStat;
  try {
    metaStat = await stat(metaPath);
    cssStat = await stat(cssPath);
  } catch {
    console.warn(`skip ${site}: missing meta.json or style.css`);
    return { site, skipped: true };
  }
  void metaStat;
  void cssStat;

  const meta = await readJSON(metaPath);
  for (const field of ["name", "namespace", "version", "description", "supportURL", "domains"]) {
    requireField(meta, field, site);
  }

  const css = (await readFile(cssPath, "utf8")).trimEnd();
  const header = buildHeader(meta);
  const body = buildDocumentBlock(meta, css);
  const built = `${header}\n\n${body}`;

  let existing = "";
  try {
    existing = await readFile(outPath, "utf8");
  } catch {
    // first build — no prior artifact
  }

  const changed = existing !== built;

  if (checkOnly) {
    return { site, changed };
  }

  if (changed) {
    await writeFile(outPath, built);
  }
  return { site, changed };
}

async function main() {
  const sites = await listSites();
  if (sites.length === 0) {
    console.log("no styles found in styles/");
    return;
  }

  const results = [];
  for (const site of sites) {
    try {
      results.push(await buildSite(site));
    } catch (err) {
      console.error(`error building ${site}: ${err.message}`);
      process.exitCode = 1;
    }
  }

  const drift = results.filter((r) => r.changed && !r.skipped);
  const ok = results.filter((r) => !r.changed && !r.skipped);
  const skipped = results.filter((r) => r.skipped);

  // Aggregate import.json from every built style. Run after per-site builds
  // so the embedded sourceCode reflects the just-built artifacts.
  const builtSites = results.filter((r) => !r.skipped).map((r) => r.site).sort();
  const importPath = join(ROOT, "import.json");
  const importJson = await generateImportJson(builtSites);
  let existingImport = "";
  try {
    existingImport = await readFile(importPath, "utf8");
  } catch {
    // first build — no prior import.json
  }
  const importChanged = existingImport !== importJson;

  if (checkOnly) {
    const stale = drift.map((r) => `styles/${r.site}/slatewave.user.css`);
    if (importChanged) stale.push("import.json");
    if (stale.length > 0) {
      console.error(`out-of-date: ${stale.join(", ")}`);
      console.error(`run \`npm run build\` and commit the changes.`);
      process.exitCode = 1;
    } else {
      console.log(`all ${ok.length} styles + import.json up to date`);
    }
    return;
  }

  if (importChanged) await writeFile(importPath, importJson);

  for (const r of drift) console.log(`built  styles/${r.site}/slatewave.user.css`);
  for (const r of ok) console.log(`ok     styles/${r.site}`);
  for (const r of skipped) console.log(`skip   styles/${r.site}`);
  console.log(importChanged ? `built  import.json` : `ok     import.json`);
}

await main();
