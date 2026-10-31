#!/usr/bin/env python3
"""Merge page-window curriculum extractions into one audited, UNAPPROVED staging file.
Usage: python tools/merge_primary_extractions.py output.json input1.json input2.json ...
This script never writes into the live academic library.
"""
import json,sys,re
from collections import Counter

def normalize_class(value):
 value=str(value).strip().lower().replace('_','-')
 match=re.fullmatch(r'(?:primary|basic)[ -]?([1-6])',value)
 if match:return 'basic-'+match.group(1)
 match=re.fullmatch(r'nursery[ -]?([1-3])',value)
 if match:return 'nursery-'+match.group(1)
 return value

def signature(s):
 return (s['class_id'],re.sub(r'\s+',' ',s['subject']).strip().casefold(),s['term'].strip().casefold())
def score(s):
 return (len(set(r.get('week','') for r in s['rows'])),len(s['rows']),sum(len(r.get('content','')) for r in s['rows']))
def merge(paths):
 grouped={};issues=[];sources=[]
 for path in paths:
  data=json.load(open(path,encoding='utf-8'));sources.append(data.get('source',path))
  issues.extend(data.get('issues',[]))
  for original in data.get('schemes',[]):
   s={**original,'class_id':normalize_class(original['class_id']),'review_status':'needs_review'}
   key=signature(s)
   if key in grouped:
    # Keep the stronger candidate but do not combine overlapping pages blindly.
    earlier=grouped[key]
    if score(s)>score(earlier):grouped[key]=s
    issues.append({'type':'duplicate_candidate','key':list(key),'pages':[earlier.get('source_start_page'),s.get('source_start_page')]})
   else:grouped[key]=s
 schemes=sorted(grouped.values(),key=lambda x:(x['class_id'],x['subject'],x['term']))
 for s in schemes:
  nums=[r.get('week','') for r in s['rows']]
  if len(nums)!=len(set(nums)):issues.append({'type':'repeated_week','class_id':s['class_id'],'subject':s['subject'],'term':s['term']})
  if len(s['rows'])!=13:issues.append({'type':'nonstandard_week_count','class_id':s['class_id'],'subject':s['subject'],'term':s['term'],'rows':len(s['rows'])})
  for r in s['rows']:
   if not r.get('content','').strip():issues.append({'type':'missing_content','class_id':s['class_id'],'subject':s['subject'],'term':s['term'],'week':r.get('week')})
 return {'format':'sowa-primary-merged-staging-v1','status':'needs_review','sources':list(dict.fromkeys(sources)),'schemes':schemes,'issues':issues,'summary':{'schemes':len(schemes),'rows':sum(len(x['rows']) for x in schemes),'classes':dict(Counter(s['class_id'] for s in schemes))}}
if __name__=='__main__':
 if len(sys.argv)<4:raise SystemExit(__doc__)
 merged=merge(sys.argv[2:])
 with open(sys.argv[1],'w',encoding='utf-8') as f:json.dump(merged,f,ensure_ascii=False,indent=2)
 print(json.dumps(merged['summary'],indent=2));print('Issues:',len(merged['issues']))
