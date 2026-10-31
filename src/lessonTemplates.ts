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
