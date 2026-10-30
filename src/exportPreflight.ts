import type {PrintableWeek,PageSettings} from './DocumentSettings';
export type ExportIssue={severity:'warning'|'error';message:string;week?:number};
export function inspectProject(project:{name:string;weeks:PrintableWeek[]},settings:PageSettings):ExportIssue[]{
 const issues:ExportIssue[]=[];
 if(!project.name.trim())issues.push({severity:'error',message:'Project title is missing.'});
 if(project.weeks.length===0)issues.push({severity:'error',message:'The project has no weeks.'});
 const seen=new Set<string>();
 project.weeks.forEach((week,i)=>{
  const n=i+1,doc=new DOMParser().parseFromString(week.content||'','text/html');
  if(!week.title.trim())issues.push({severity:'warning',week:n,message:'Week title is blank.'});
  if(seen.has(week.title.trim().toLowerCase()))issues.push({severity:'warning',week:n,message:'Repeated week title.'});
  seen.add(week.title.trim().toLowerCase());
  if(!(doc.body.textContent||'').trim()&&!doc.body.querySelector('img'))issues.push({severity:'warning',week:n,message:'Lesson content is empty.'});
  if(settings.showGuide&&!week.plan)issues.push({severity:'warning',week:n,message:'Teacher guide has not been filled in.'});
  for(const img of Array.from(doc.querySelectorAll('img'))){
   if(!img.getAttribute('alt')?.trim())issues.push({severity:'warning',week:n,message:'An image is missing descriptive alt text.'});
   const src=img.getAttribute('src')||'';
   if(!/^data:image\/(png|jpeg|jpg|gif);base64,/i.test(src))issues.push({severity:'warning',week:n,message:'An image may not be embedded in Word export.'});
  }
  if(doc.querySelector('table')&&settings.paper==='A5')issues.push({severity:'warning',week:n,message:'Check wide tables on A5 pages.'});
 });
 if(settings.showTOC)issues.push({severity:'warning',message:'Update the table of contents in Microsoft Word to calculate its page numbers.'});
 return issues;
}
