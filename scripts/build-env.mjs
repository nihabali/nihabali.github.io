// বাংলায় সংক্ষেপে: .env ফাইলের (বা হোস্টিংয়ের) গোপন কী পড়ে data/env.generated.js বানায়, যেটা ওয়েবসাইট ব্যবহার করে।
// Reads secrets from the ".env" file (local) or from environment variables (GitHub Actions / Vercel)
// and writes them into data/env.generated.js, which the website loads as window.ENV.
//
//   Local test:        node scripts/build-env.mjs            (writes data/env.generated.js)
//   Hosting (deploy):  node scripts/build-env.mjs --dist dist (copies the site into dist/ and writes dist/data/env.generated.js)
//
// Important: anything written here ends up in a file that visitors' browsers download. See README "Security".
import fs from "node:fs";
import path from "node:path";

const KEYS = ["TMDB_READ_TOKEN", "TMDB_API_KEY", "ANILIST_USERNAME", "ANILIST_TOKEN", "YOUTUBE_API_KEY"];
const fromFile = {};
if (fs.existsSync(".env")) {
  for (const line of fs.readFileSync(".env", "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !line.trim().startsWith("#")) fromFile[m[1]] = m[2].replace(/^(['"])(.*)\1$/, "$2");
  }
}
const env = {};
for (const k of KEYS) { const v = process.env[k] || fromFile[k]; if (v) env[k] = v; }

const i = process.argv.indexOf("--dist");
const dist = i > -1 ? process.argv[i + 1] || "dist" : null;
let target = path.join("data", "env.generated.js");
if (dist) {
  const skip = new Set([".git", ".github", "node_modules", "scripts", dist, "dist", ".gitignore", ".vercelignore", "vercel.json", "README.md", "extras"]);
  fs.rmSync(dist, { recursive: true, force: true });
  fs.cpSync(".", dist, { recursive: true, filter: s => { const b = path.basename(s); return b === "." || !(skip.has(b) || b.startsWith(".env") || b === "env.generated.js"); } });
  target = path.join(dist, "data", "env.generated.js");
}
// কোনো কী না পেলে, আগে থেকে বানানো data/env.generated.js (যদি থাকে) যেমন আছে তেমনই রেখে দিই।
if (dist && Object.keys(env).length === 0 && fs.existsSync(path.join("data", "env.generated.js"))) {
  fs.copyFileSync(path.join("data", "env.generated.js"), target);
  console.log("No .env keys found: kept the existing data/env.generated.js in " + target);
  process.exit(0);
}
fs.writeFileSync(target, "window.ENV = " + JSON.stringify(env, null, 1) + ";\n");
console.log("Wrote " + target + " with: " + (Object.keys(env).join(", ") || "no keys (site will use the saved snapshots)"));
