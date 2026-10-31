#!/usr/bin/env python3
"""Extract primary/nursery week-topic-content tables with page provenance.
Usage: python tools/extract_primary_tables.py input.pdf output.json
Requires PyMuPDF. Output remains unreviewed: not suitable for automatic publication.
"""
import argparse,json,re
import fitz

def clean(x):
 return re.sub(r'\s+',' ',str(x or '')).strip()
def page_heading(lines):
 text=' '.join(lines[:8])
 match=re.search(r'(PRE[- ]?NURSERY|NURSERY\s*[123]|PRIMARY\s*[1-6]|BASIC\s*[1-6])',text,re.I)
 term=re.search(r'\b(FIRST|SECOND|THIRD)\s+TERM\b',text,re.I)
 scheme=re.search(r'SCHEME OF WORK',text,re.I)
 if not (match and term and scheme):return None
 class_name=clean(match.group()).upper()
 cid=('basic-'+class_name.split()[-1] if class_name.startswith(('PRIMARY','BASIC')) else
      'nursery-'+class_name.split()[-1] if class_name.startswith('NURSERY') else 'prenursery')
 header=text[:scheme.end()]
 subject=re.sub(r'(PRE[- ]?NURSERY|NURSERY\s*[123]|PRIMARY\s*[1-6]|BASIC\s*[1-6])','',header,flags=re.I)
 subject=re.sub(r'SCHEME OF WORK|\(|\)','',subject,flags=re.I).strip(' -')
 return {'class_id':cid,'source_class':class_name,'subject':subject or 'UNKNOWN','term':term.group().title()}

def extract(source,start_page=1,end_page=985):
 doc=fitz.open(source);schemes=[];current=None;unparsed=[]
 for page_num,page in enumerate(doc,1):
  if page_num<start_page or page_num>end_page:continue
  lines=[clean(x) for x in page.get_text().splitlines() if x.strip()]
  head=page_heading(lines)
  if head:
   current={**head,'start_page':page_num,'review_status':'needs_review','rows':[]}
   schemes.append(current)
  if current is None:continue
  try: tables=page.find_tables().tables
  except Exception:tables=[]
  found=False
  for table in tables:
   rows=table.extract()
   if not rows:continue
   header_index=next((i for i,row in enumerate(rows[:4]) if len(row)>=3 and clean(row[0]).lower()=='week' and clean(row[1]).lower()=='topic'),None)
   if header_index is None:
    # Continued table without repeating a heading: first column is a week number.
    header_index=-1 if any(row and re.fullmatch(r'\d{1,2}(?:\s*[-–]\s*\d{1,2})?',clean(row[0])) for row in rows[:3]) else None
   if header_index is None:continue
   found=True
   for row in rows[header_index+1:]:
    if len(row)<3:continue
    week,topic,content=map(clean,row[:3])
    if re.fullmatch(r'\d{1,2}(?:\s*[-–]\s*\d{1,2})?',week) and topic:
     current['rows'].append({'week':week,'topic':topic,'content':content,'source_page':page_num})
    elif current['rows'] and not week and (topic or content):
     prev=current['rows'][-1]
     prev['topic']=clean(prev['topic']+' '+topic)
     prev['content']=clean(prev['content']+' '+content)
  if head and not found:unparsed.append({'page':page_num,'class_id':current['class_id'],'subject':current['subject'],'reason':'No matching week/topic table'})
 return {'format':'sowa-primary-extraction-v1','source':source,'pages':len(doc),'review_status':'needs_review','schemes':schemes,'unparsed':unparsed}

if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('pdf');parser.add_argument('output');parser.add_argument('--start-page',type=int,default=1);parser.add_argument('--end-page',type=int,default=985);args=parser.parse_args()
 data=extract(args.pdf,args.start_page,args.end_page)
 with open(args.output,'w',encoding='utf-8') as f:json.dump(data,f,ensure_ascii=False,indent=2)
 print('Schemes:',len(data['schemes']),'Rows:',sum(len(x['rows']) for x in data['schemes']),'Unparsed:',len(data['unparsed']))
