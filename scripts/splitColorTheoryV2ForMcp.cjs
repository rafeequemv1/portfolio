const fs = require("fs");
const path = require("path");
const sqlPath = path.join(__dirname, "..", "supabase", "color_theory_v2_full_replace.sql");
const s = fs.readFileSync(sqlPath, "utf8");
const outDir = path.join(__dirname, "..", "supabase", "_mcp_parts_v2");
fs.mkdirSync(outDir, { recursive: true });

const header = s.match(/^[\s\S]*?(?=insert into public\.course_chapters)/i)[0].trim();
const insertBlock = s.match(/insert into public\.course_chapters[\s\S]*/i)[0];

const re =
  /\(\s*\n\s*'c0c0c000-0002-4000-8000-00000000d00[0-5]'::uuid,[\s\S]*?now\(\)\s*\n\s*\)/g;
const tuples = [...insertBlock.matchAll(re)].map((m) => m[0].trim());

if (tuples.length !== 6) throw new Error(`expected 6 chapter tuples, got ${tuples.length}`);

fs.writeFileSync(path.join(outDir, "part_header.sql"), header + "\n", "utf8");
fs.writeFileSync(path.join(outDir, "part_header.json"), JSON.stringify({ query: header }), "utf8");

tuples.forEach((t, i) => {
  const q = `insert into public.course_chapters (id, course_id, title, position, content_blocks, updated_at)\nvalues\n  ${t};`;
  fs.writeFileSync(path.join(outDir, `part_ch${i}.sql`), q, "utf8");
  fs.writeFileSync(path.join(outDir, `part_ch${i}.json`), JSON.stringify({ query: q }), "utf8");
});
console.log("wrote header +", tuples.length, "chapter parts to", outDir);
