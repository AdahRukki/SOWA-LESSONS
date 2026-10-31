export type LessonTemplate={id:string;name:string;description:string;sections:string[];blocks?:LessonBlockId[]};
export const LESSON_TEMPLATES:LessonTemplate[]=[
 {id:'standard',name:'Standard Lesson Note',description:'Theory subjects and general classroom teaching',sections:['Explanation','Worked Examples','Class Activities','Evaluation']},
 {id:'mathematics',name:'Mathematics & Quantitative',description:'Step-by-step solving and practice',sections:['Concept Explanation','Worked Examples','Guided Practice','Independent Exercises','Evaluation']},
 {id:'verbal',name:'English & Verbal Reasoning',description:'Language examples and guided practice',sections:['Explanation','Examples','Guided Practice','Reading or Language Activities','Evaluation']},
 {id:'practical',name:'Science & Practical',description:'Investigations, demonstrations, and observations',sections:['Explanation','Materials and Apparatus','Procedure','Observations','Discussion','Evaluation']},
 {id:'creative',name:'Creative Arts & Copywork',description:'Demonstrations, guided tasks, and independent creation',sections:['Explanation','Teacher Demonstration','Guided Activity','Independent Activity','Evaluation']}
];

export type LessonBlockId='table'|'questions'|'handwriting'|'drawing'|'matching';
export const LESSON_BLOCKS:{id:LessonBlockId;name:string;description:string}[]=[
{id:'table',name:'Editable table',description:'Three-column table for examples, steps, or observations'},
{id:'questions',name:'Practice questions',description:'Five editable numbered questions'},
{id:'handwriting',name:'Handwriting practice',description:'Trace and copy letters or words using a writing table'},
{id:'drawing',name:'Drawing / colouring space',description:'Large bordered drawing area within an editable table'},
{id:'matching',name:'Matching exercise',description:'Two-column matching activity'}
];
export function blockHtml(id:LessonBlockId):string{
 switch(id){
 case 'table':return '<h3>Activity Table</h3><table><thead><tr><th>Item</th><th>Explanation</th><th>Example</th></tr></thead><tbody><tr><td>1</td><td></td><td></td></tr><tr><td>2</td><td></td><td></td></tr><tr><td>3</td><td></td><td></td></tr></tbody></table>';
 case 'questions':return '<h3>Practice Questions</h3><ol><li>Question 1</li><li>Question 2</li><li>Question 3</li><li>Question 4</li><li>Question 5</li></ol>';
 case 'handwriting':return '<h3>Handwriting Practice</h3><p>Look, say, trace and copy.</p><table><tbody><tr><td>Model: Aa Aa Aa</td></tr><tr><td>Copy: _________________________________</td></tr><tr><td>Copy: _________________________________</td></tr><tr><td>Copy: _________________________________</td></tr></tbody></table>';
 case 'drawing':return '<h3>Drawing and Colouring Activity</h3><p>Draw or colour in the space below.</p><table><tbody><tr><td><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p></td></tr></tbody></table>';
 case 'matching':return '<h3>Matching Exercise</h3><p>Match each item on the left with the correct answer on the right.</p><table><thead><tr><th>Column A</th><th>Column B</th></tr></thead><tbody><tr><td>1.</td><td>A.</td></tr><tr><td>2.</td><td>B.</td></tr><tr><td>3.</td><td>C.</td></tr></tbody></table>';
 }
}

export const htmlEscape=(s:string)=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
export function templateHtml(template:LessonTemplate):string{return template.sections.filter(Boolean).map(section=>'<h3>'+htmlEscape(section)+'</h3><p></p>').join('')+(template.blocks??[]).map(blockHtml).join('')}

export const CUSTOM_TEMPLATES_KEY='sowa-lessons-custom-templates-v1';
export function readCustomTemplates():LessonTemplate[]{
 try{const raw=localStorage.getItem(CUSTOM_TEMPLATES_KEY);const value=raw?JSON.parse(raw):[];if(!Array.isArray(value))return [];
 return value.filter((t):t is LessonTemplate=>Boolean(t&&typeof t.id==='string'&&typeof t.name==='string'&&typeof t.description==='string'&&Array.isArray(t.sections)&&t.sections.length>0&&t.sections.every((s:unknown)=>typeof s==='string')&&(!t.blocks||Array.isArray(t.blocks))));}
 catch{return []}
}
export function saveCustomTemplates(templates:LessonTemplate[]):void{
 localStorage.setItem(CUSTOM_TEMPLATES_KEY,JSON.stringify(templates));
 window.dispatchEvent(new Event('sowa-lesson-templates-updated'));
}
