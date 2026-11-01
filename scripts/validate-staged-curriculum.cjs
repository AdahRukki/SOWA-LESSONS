#!/usr/bin/env node
// Source-conscious staging validator. Does not modify or approve records.
const fs=require('node:fs');
const path=require('node:path');
let failures=0,warnings=0,total=0,records=0;
const names=new Set();
for(let level=2;level<=6;level++){
 const fp=path.join(__dirname,'..','curriculum','staging','basic'+level+'_raw_review_candidates.json');
 const d=JSON.parse(fs.readFileSync(fp,'utf8'));
 for(const s of d.schemes){
  total++;
  const label=[s.class_id,s.subject,s.term].join(' / ');
  const id=label.toLowerCase().replace(/\s+/g,' ');
  if(names.has(id)){console.error('ERROR duplicate scheme:',label);failures++;}
  names.add(id);
  const covered=new Set();
  for(const r of s.rows){
   records++;
   const w=String(r.week||'').trim();
   const m=w.match(/^(\d+)(?:\s*[-–—]\s*(\d+))?$/);
   if(!m){console.error('ERROR invalid week:',label,w);failures++;continue;}
   const begin=Number(m[1]),end=Number(m[2]||m[1]);
   if(end<begin||begin<1||end>24){console.error('ERROR invalid range:',label,w);failures++;continue;}
   for(let i=begin;i<=end;i++){
    if(covered.has(i)){console.error('ERROR overlapping week:',label,i);failures++;}
    covered.add(i);
   }
   if(!String(r.topic||'').trim()||!String(r.content||'').trim()){
    if(r.source_blank===true){warnings++;}else{console.error('ERROR undocumented empty source cell:',label,w);failures++;}
   }
   if(!Number.isInteger(Number(r.source_page))){console.error('ERROR source page missing:',label,w);failures++;}
  }
  for(let i=1;i<=13;i++)if(!covered.has(i)){console.error('ERROR missing week:',label,i);failures++;}
  if(s.review_status!=='needs_review'){console.error('ERROR unreviewed import is not needs_review:',label);failures++;}
 }
}
console.log(JSON.stringify({schemes:total,physical_rows:records,source_blank_warnings:warnings,errors:failures},null,2));
if(failures)process.exitCode=1;
