#!/usr/bin/env python3
"""Extract standard Week/Topic/Content tables from the supplied secondary curriculum.
Install: pip install pymupdf
Usage: python tools/extract_secondary_tables.py source.pdf output.json
Output is UNREVIEWED. Do not install automatically into a live curriculum.
"""
import fitz,json,re,sys,os
source,destination=sys.argv[1:3]
document=fitz.open(source)
heading=re.compile(r'^(JSS\s*[123]|SS\s*[123])\s+(.+?)\s+SCHEME OF WORK$',re.I)
schemes=[];unparsed=[]
for number,page in enumerate(document,1):
 lines=[re.sub(r'\s+',' ',line.strip()) for line in page.get_text().splitlines() if line.strip()]
 match=next((m for line in lines[:15] if (m:=heading.match(line))),None)
 if not match:continue
 term=next((line.title() for line in lines[:15] if line.upper() in {'FIRST TERM','SECOND TERM','THIRD TERM'}),None)
 if not term:continue
 tables=page.find_tables().tables
 rows=next((t.extract() for t in tables if t.extract() and [str(c).strip().lower() for c in t.extract()[0][:3]]==['week','topic','content']),None)
 if not rows:
  unparsed.append({'page':number,'heading':match.group(0),'reason':'Nonstandard table'})
  continue
 data=[]
 for row in rows[1:]:
  if len(row)<3:continue
  values=[re.sub(r'\s+',' ',str(x or '')).strip() for x in row[:3]]
  if values[0] and values[1]:data.append(dict(zip(('week','topic','content'),values)))
 if data:
  class_id=re.sub(r'^(jss|ss)([123])
  schemes.append({'class_id':class_id,'subject':match.group(2),'term':term,'page':number,'rows':data,'review_status':'needs_review'})
result={'format':'sowa-pdf-table-extraction-v1','source':os.path.basename(source),'total_pages':len(document),'review_status':'needs_review','schemes':schemes,'unparsed_headings':unparsed}
with open(destination,'w',encoding='utf-8') as output:json.dump(result,output,ensure_ascii=False,indent=2)
print('Schemes extracted:',len(schemes),'Rows:',sum(len(s['rows']) for s in schemes),'Unparsed headings:',len(unparsed))
,r'\1-\2',re.sub(r'\s+','',match.group(1)).lower())
  schemes.append({'class_id':class_id,'subject':match.group(2),'term':term,'page':number,'rows':data,'review_status':'needs_review'})
result={'format':'sowa-pdf-table-extraction-v1','source':os.path.basename(source),'total_pages':len(document),'review_status':'needs_review','schemes':schemes,'unparsed_headings':unparsed}
with open(destination,'w',encoding='utf-8') as output:json.dump(result,output,ensure_ascii=False,indent=2)
print('Schemes extracted:',len(schemes),'Rows:',sum(len(s['rows']) for s in schemes),'Unparsed headings:',len(unparsed))
