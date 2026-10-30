import type {SchemeOfWork} from './academic';
export type CoverageItem={week:number;kind:'topic'|'subtopic';name:string;found:boolean};
export type CoverageReport={items:CoverageItem[];covered:number;total:number;percent:number;missing:CoverageItem[]};
type LessonWeek={title:string;content:string;sourceWeekId?:string};
function normalized(s:string){return s.toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim().replace(/\s+/g,' ')}
function htmlText(html:string){const doc=new DOMParser().parseFromString(html,'text/html');return doc.body.textContent||''}
export function checkSchemeCoverage(scheme:SchemeOfWork,weeks:LessonWeek[]):CoverageReport{
 const items:CoverageItem[]=[];
 for(const source of scheme.weeks){
  const target=weeks.find(w=>w.sourceWeekId===source.id)??weeks[scheme.weeks.indexOf(source)];
  const body=normalized((target?.title||'')+' '+htmlText(target?.content||''));
  for(const topic of source.topics){
   const entries:[CoverageItem['kind'],string][]=[['topic',topic.title],...topic.subtopics.map(s=>['subtopic',s] as [CoverageItem['kind'],string])];
   for(const [kind,name] of entries){const needle=normalized(name);items.push({week:source.number,kind,name,found:!!needle&&body.includes(needle)})}
  }
 }
 const covered=items.filter(x=>x.found).length;
 return {items,covered,total:items.length,percent:items.length?Math.round(covered*100/items.length):0,missing:items.filter(x=>!x.found)};
}
