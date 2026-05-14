const fs = require("fs");
const p = process.argv[2];
if (!p) process.exit(1);
let s = fs.readFileSync(p, "utf8");
const before = (s.match(/"/g) || []).length;
s = s.replace(/style="/g, "style='");
s = s.replace(/([a-zA-Z0-9%)])">/g, "$1'>");
const after = (s.match(/"/g) || []).length;
if (s.includes('"')) {
  const i = s.indexOf('"');
  console.error("Still has double quotes:", after);
  console.error(JSON.stringify(s.slice(Math.max(0, i - 40), i + 40)));
  process.exit(1);
}
console.log("OK: removed", before - after, "double-quote chars");
fs.writeFileSync(p, s, "utf8");
