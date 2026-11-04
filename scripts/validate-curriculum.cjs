#!/usr/bin/env node
// Read-only validation of bundled curriculum. Never changes or approves schemes.
const fs = require('node:fs');
const path = require('node:path');
const file = path.join(__dirname, '..', 'src', 'preloadedCurriculum.json');
const errors = [], warnings = [], counts = {};
const norm = x => String(x ?? '').trim().toLowerCase().replace(/\s+/g,' ');
const label = s => [s.class_id,s.subject,s.term].join(' / ');
const fail = message => errors.push(message);
const warn = message => warnings.push(message);
let data;
try { data = JSON.parse(fs.readFileSync(file, 'utf8')); }
catch (e) { console.error('Unable to read curriculum:',e.message); process.exit(1); }
if (!Array.isArray(data.schemes)) { console.error('Missing schemes array'); process.exit(1); }
const seen = new Set();
for (const s of data.schemes) {
  const name = label(s);
  if (!s.class_id || !s.subject || !s.term) fail('Missing scheme identity: '+name);
  const key=[s.class_id,s.subject,s.term].map(norm).join('|');
  if (seen.has(key)) fail('Duplicate scheme: '+name);
  seen.add(key);
  if (!['First Term','Second Term','Third Term'].includes(s.term)) fail('Unexpected term: '+name);
  if (s.review_status !== 'needs_review' && s.review_status !== 'approved') warn('Unexpected review status: '+name);
  if (!Array.isArray(s.rows) || !s.rows.length) {fail('No weeks: '+name);continue;}
  const weeks=new Set();
  for (const row of s.rows) {
    const week=norm(row.week);
    if (!week) fail('Blank week in '+name);
    if (weeks.has(week)) fail('Duplicate week '+week+' in '+name);
    weeks.add(week);
    if (!norm(row.topic)) fail('Blank topic in '+name+' week '+week);
    if (!norm(row.content) || ['-','–','—'].includes(norm(row.content))) {
      // Examination, revision and break weeks may have no instructional content.
      if (!/exam|break|revision|vacation|holiday|test/.test(norm(row.topic))) warn('Missing teaching content: '+name+' week '+week);
    }
    if (row.source_page === undefined || row.source_page === null || !Number.isInteger(Number(row.source_page))) warn('Missing source page: '+name+' week '+week);
  }
  // Expand printed week ranges (e.g. 11–13) for completeness checks.
  const covered=new Set();
  for (const token of weeks) {
    const match=token.match(/^(\d+)(?:\s*[-–—]\s*(\d+))?$/);
    if (!match) {warn('Unrecognized week token '+token+' in '+name);continue;}
    const start=Number(match[1]),end=Number(match[2]||match[1]);
    if (start<1||end>24||end<start) {fail('Invalid week range '+token+' in '+name);continue;}
    for(let w=start;w<=end;w++){if(covered.has(w))fail('Overlapping week '+w+' in '+name);covered.add(w);}
  }
  for(let w=1;w<=Math.max(0,...covered);w++)if(!covered.has(w))warn('Missing week '+w+' in '+name);
  counts[s.class_id] = (counts[s.class_id]||0)+1;
}
console.log('Schemes:',data.schemes.length);
console.log('By class:',JSON.stringify(counts,null,2));
console.log('Errors:',errors.length,'Warnings:',warnings.length);
errors.forEach(x=>console.error('ERROR:',x));
warnings.forEach(x=>console.warn('REVIEW:',x));
if (errors.length) process.exitCode=1;
