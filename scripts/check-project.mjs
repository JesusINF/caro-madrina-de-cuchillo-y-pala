import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (name) => readFile(path.join(root, name), "utf8");
const [html, app, rules, styles, workflow] = await Promise.all([
  read("index.html"), read("app.js"), read("firestore.rules"), read("styles.css"), read(".github/workflows/pages.yml")
]);

const checks = [
  ["HTML keeps the invitation copy and CTA as text", html.includes("Caro, ¿aceptas") && html.includes("id=\"accept-trigger\"")],
  ["SVG references both transparent artwork slots", html.includes('href="assets/templo-transparente.png"') && html.includes('href="assets/cuchillo-pala-transparente.png"') && html.includes("animateMotion")],
  ["Date and venue are present in semantic HTML", html.includes('datetime="2027-01-23"') && html.includes("La Piedad, Michoacán")],
  ["SVG art has native scroll-linked motion", styles.includes("animation-timeline: scroll(root block)") && styles.includes("art-scroll-travel")],
  ["Firebase writes only the fixed response document", app.includes('doc(db, "responses", INVITATION_ID)') && app.includes('const INVITATION_ID = "caro-cuchillo-pala"') && !/\b(getDoc|getDocs|onSnapshot)\s*\(/.test(app)],
  ["App avoids console output", !app.includes("console.")],
  ["Response fields are scoped to Caro", app.includes('recipients: ["Caro"]') && app.includes("responderUid: currentUser.uid") && app.includes("serverTimestamp()")],
  ["Rules preserve deployed Mary/Felipe and include both new create-only paths", ["mary-everardo", "felipe-banda", "gaby-ramo", "caro-cuchillo-pala"].every((id) => rules.includes(id)) && rules.includes("allow read, update, delete: if false;")],
  ["GitHub Pages workflow deploys the site", workflow.includes("actions/upload-pages-artifact@v3") && workflow.includes("actions/deploy-pages@v4")]
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
