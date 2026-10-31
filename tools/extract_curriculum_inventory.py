#!/usr/bin/env python3
"""Page-indexed, unreviewed PDF Scheme of Work heading inventory. Requires PyMuPDF."""
import argparse,json,re
import fitz

TERMS=("FIRST TERM","SECOND TERM","THIRD TERM")
CLASS=re.compile(r"\b(PRE[- ]?NURSERY|NURSERY\s*[123]|PRIMARY\s*[1-6]|BASIC\s*[1-6]|JSS\s*[123]|SS\s*[123])\b",re.I)

def class_id(label):
 c=re.sub(r"\s+"," ",label.upper().replace("-"," ")).strip()
 if c.startswith(("PRIMARY","BASIC")): return "basic-"+c.split()[-1]
 if c.startswith("NURSERY"): return "nursery-"+c.split()[-1]
 if c.startswith("JSS"): return "jss-"+c.replace("JSS","").strip()
 if c.startswith("SS"): return "ss-"+c.replace("SS","").strip()
 return "prenursery"

def inspect(path,source):
 doc=fitz.open(path);records=[]
 for page_number,page in enumerate(doc,1):
  lines=[re.sub(r"\s+"," ",line).strip() for line in page.get_text().splitlines() if line.strip()]
  headers=[(i,line) for i,line in enumerate(lines[:14]) if "SCHEME OF WORK" in line.upper() and "..." not in line and "TABLE OF CONTENT" not in line.upper()]
  term=next((x.title() for x in TERMS if x in [line.upper() for line in lines[:16]]),None)
  if not headers or not term:continue
  i,heading=headers[0]
  match=CLASS.search(heading) or CLASS.search(" ".join(lines[:i+1]))
  if not match:continue
  subject=CLASS.sub("",re.sub("SCHEME OF WORK","",heading,flags=re.I)).strip(" ()-–")
  record={"source":source,"page":page_number,"class_id":class_id(match.group()),"source_class":match.group(),"subject":subject or "Unknown (review required)","term":term,"review_status":"needs_review"}
  if not records or any(records[-1][k]!=record[k] for k in ("class_id","subject","term")):records.append(record)
 return {"file":path,"pages":len(doc),"candidate_schemes":records}

if __name__=="__main__":
 parser=argparse.ArgumentParser()
 parser.add_argument("primary_pdf");parser.add_argument("secondary_pdf");parser.add_argument("--out",default="curriculum-source-index.json")
 args=parser.parse_args()
 data={"format":"sowa-curriculum-source-index-v1","verified":False,"sources":[inspect(args.primary_pdf,"primary"),inspect(args.secondary_pdf,"secondary")]}
 with open(args.out,"w",encoding="utf-8") as output:json.dump(data,output,ensure_ascii=False,indent=2)
 for source in data["sources"]:print(source["file"],len(source["candidate_schemes"]),"candidate schemes")
