import { readFile, stat } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (name) => readFile(path.join(root, name), "utf8");
const [html, app, rules, styles, workflow, artwork, artworkInfo] = await Promise.all([
  read("index.html"),
  read("app.js"),
  read("firestore.rules"),
  read("styles.css"),
  read(".github/workflows/pages.yml"),
  readFile(path.join(root, "assets/cubiertos-papercraft-v1.webp")),
  stat(path.join(root, "assets/cubiertos-papercraft-v1.webp"))
]);

const checks = [
  ["Invitation copy, role, and CTA remain semantic HTML", html.includes("Caro") && html.includes("Madrina de cuchillo y pala") && html.includes('id="accept-trigger"')],
  ["Inline SVG layers transparent papercraft sanctuary and utensils WebP assets", html.includes('href="assets/santuario-papercraft-v1.webp"') && html.includes('href="assets/cubiertos-papercraft-v1.webp"') && !html.includes('href="assets/cuchillo-pala-transparente.png"')],
  ["SVG contains no hand-drawn paths or text artwork", !/<(?:path|text)\b/i.test(html)],
  ["Date and venue are present in semantic HTML", html.includes('datetime="2027-01-23"') && html.includes("La Piedad,") && html.includes("Michoacán")],
  ["Only one invitation acceptance CTA is present", (html.match(/id="accept-trigger"/g) ?? []).length === 1 && (html.match(/id="confirm-accept"/g) ?? []).length === 1],
  ["SVG art has native scroll-linked movement", styles.includes("animation-timeline: scroll(root block)") && styles.includes("art-scroll-travel")],
  ["Reduced motion is honored and no per-frame scroll listener exists", styles.includes("prefers-reduced-motion: reduce") && !/addEventListener\s*\(\s*["']scroll["']|\.onscroll\s*=/.test(app)],
  ["Firebase writes only the fixed response document and performs no reads", app.includes('doc(db, "responses", INVITATION_ID)') && app.includes('const INVITATION_ID = "caro-cuchillo-pala"') && !/\b(getDoc|getDocs|onSnapshot)\s*\(/.test(app)],
  ["Response fields are scoped to Caro", app.includes('recipients: ["Caro"]') && app.includes("responderUid: currentUser.uid") && app.includes("serverTimestamp()")],
  ["Existing invitation rules remain intact with default deny", ["mary-everardo", "felipe-banda", "gaby-ramo", "caro-cuchillo-pala"].every((id) => rules.includes(id)) && rules.includes("allow read, update, delete: if false;")],
  ["Tablet and desktop layout breakpoints are defined", styles.includes("@media (min-width: 48rem)") && styles.includes("@media (min-width: 64rem)")],
  ["No hard minimum width forces 320 px horizontal overflow", !styles.includes("min-width: 320px")],
  ["Optimized transparent WebP asset is served below 200 KB", artwork.subarray(0, 4).toString() === "RIFF" && artwork.subarray(8, 12).toString() === "WEBP" && artworkInfo.size < 200_000],
  ["GitHub Pages workflow deploys the static site", workflow.includes("actions/upload-pages-artifact@v3") && workflow.includes("actions/deploy-pages@v4")]
];

const syntax = spawnSync(process.execPath, ["--check", path.join(root, "app.js")], { encoding: "utf8" });
checks.push(["app.js syntax", syntax.status === 0]);

let failed = false;
for (const [label, passed] of checks) {
  process.stdout.write(`${passed ? "PASS" : "FAIL"} ${label}\n`);
  failed ||= !passed;
}
if (syntax.status !== 0) process.stderr.write(syntax.stderr);
if (failed) process.exitCode = 1;
