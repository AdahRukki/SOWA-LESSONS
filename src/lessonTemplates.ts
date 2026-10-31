export type LessonTemplate={id:string;name:string;description:string;sections:string[]};
export const LESSON_TEMPLATES:LessonTemplate[]=[
 {id:'standard',name:'Standard Lesson Note',description:'Theory subjects and general classroom teaching',sections:['Explanation','Worked Examples','Class Activities','Evaluation']},
 {id:'mathematics',name:'Mathematics & Quantitative',description:'Step-by-step solving and practice',sections:['Concept Explanation','Worked Examples','Guided Practice','Independent Exercises','Evaluation']},
 {id:'verbal',name:'English & Verbal Reasoning',description:'Language examples and guided practice',sections:['Explanation','Examples','Guided Practice','Reading or Language Activities','Evaluation']},
 {id:'practical',name:'Science & Practical',description:'Investigations, demonstrations, and observations',sections:['Explanation','Materials and Apparatus','Procedure','Observations','Discussion','Evaluation']},
 {id:'creative',name:'Creative Arts & Copywork',description:'Demonstrations, guided tasks, and independent creation',sections:['Explanation','Teacher Demonstration','Guided Activity','Independent Activity','Evaluation']}
];
export const htmlEscape=(s:string)=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
export function templateHtml(template:LessonTemplate):string{return template.sections.map(section=>'<h3>'+htmlEscape(section)+'</h3><p></p>').join('')}

export const CUSTOM_TEMPLATES_KEY='sowa-lessons-custom-templates-v1';
export function readCustomTemplates():LessonTemplate[]{
 try{const raw=localStorage.getItem(CUSTOM_TEMPLATES_KEY);const value=raw?JSON.parse(raw):[];if(!Array.isArray(value))return [];
 return value.filter((t):t is LessonTemplate=>Boolean(t&&typeof t.id==='string'&&typeof t.name==='string'&&typeof t.description==='string'&&Array.isArray(t.sections)&&t.sections.length>0&&t.sections.every((s:unknown)=>typeof s==='string')));}
 catch{return []}
}
export function saveCustomTemplates(templates:LessonTemplate[]):void{
 localStorage.setItem(CUSTOM_TEMPLATES_KEY,JSON.stringify(templates));
 window.dispatchEvent(new Event('sowa-lesson-templates-updated'));
}
