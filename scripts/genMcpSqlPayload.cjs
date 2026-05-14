const fs = require('fs');
const path = require('path');
const sqlPath = path.join(__dirname, '..', 'supabase', 'color_theory_conversational_updates.sql');
const q = fs.readFileSync(sqlPath, 'utf8');
process.stdout.write(JSON.stringify({ query: q }));
