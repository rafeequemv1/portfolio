const fs = require("fs");
const path = require("path");
const sqlPath = path.join(__dirname, "..", "supabase", "color_theory_conversational_updates.sql");
let s = fs.readFileSync(sqlPath, "utf8");
s = s.replace(/^--[^\n]*\n/gm, "");
const re =
  /update public\.(?:courses|course_chapters)[\s\S]*?;\s*(?=\nupdate public\.|$)/g;
const parts = s.match(re) || [];
const outDir = path.join(__dirname, "..", "supabase", "_mcp_parts");
fs.mkdirSync(outDir, { recursive: true });
parts.forEach((chunk, i) => {
  const t = chunk.trim();
  fs.writeFileSync(path.join(outDir, `part_${i}.sql`), t + "\n", "utf8");
  fs.writeFileSync(
    path.join(outDir, `part_${i}.json`),
    JSON.stringify({ query: t }),
    "utf8"
  );
});
console.log("wrote", parts.length, "parts to", outDir);
