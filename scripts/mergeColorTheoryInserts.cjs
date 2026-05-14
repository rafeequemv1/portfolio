const fs = require("fs");
const path = require("path");
const dir = path.join(__dirname, "..", "supabase", "_mcp_parts_v2");
const parts = [];
for (let i = 0; i <= 5; i++) {
  let q = JSON.parse(fs.readFileSync(path.join(dir, `part_ch${i}.json`), "utf8")).query.trim();
  if (!q.endsWith(";")) q += ";";
  parts.push(q);
}
const q = parts.join("\n\n");
const out = path.join(__dirname, "..", "supabase", "color_theory_v2_inserts_batch.sql");
fs.writeFileSync(out, q, "utf8");
if (/"/.test(q)) throw new Error("unexpected double quote");
console.log("Wrote", out, "bytes", q.length);
