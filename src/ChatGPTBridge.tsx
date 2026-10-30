import React,{useMemo,useState} from 'react';
type Task='complete'|'improve'|'plan'|'questions'|'curriculum';
type Props={project:{name:string;className:string;subject:string;term:string};week:{title:string;content:string};onClose:()=>void;onInsert:(html:string)=>void};
const taskNames:Record<Task,string>={complete:'Expand lesson content',improve:'Improve explanations',plan:"Suggest teacher's lesson plan",questions:'Generate evaluation and assignment',curriculum:'Review curriculum coverage'};
function toPlain(html:string){const el=document.createElement('div');el.innerHTML=html;return el.textContent||''}
function toSafeHtml(text:string){return text.split(/\r?\n/).map(line=>{const v=line.trim();if(!v)return '<p></p>';const heading=/^(#{1,4})\s+(.*)$/.exec(v);if(heading)return '<h'+heading[1].length+'>'+esc(heading[2])+'</h'+heading[1].length+'>';return '<p>'+esc(v)+'</p>'}).join('')}
function esc(s:string){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
export default function ChatGPTBridge({project,week,onClose,onInsert}:Props){
 const [task,setTask]=useState<Task>('complete');
 const [response,setResponse]=useState('');
 const [review,setReview]=useState(false);
 const prompt=useMemo(()=>[
 'You are helping prepare a Nigerian primary-school lesson note for Seat of Wisdom Academy.',
 'Class: '+project.className,'Subject: '+project.subject,'Term: '+project.term,'Topic: '+week.title,
 'Task: '+taskNames[task],
 'Use the original lesson as the primary source. Do not invent curriculum coverage. Identify any proposed additions clearly.',
 'Keep the explanations age-appropriate, use Nigerian examples, and organize the output with Markdown headings (#, ##, ###, ####).',
 'Return only the proposed content for human review. Do not state that it has already been inserted into the application.',
 'ORIGINAL LESSON NOTE:',toPlain(week.content)
 ].join('\n\n'),[project,week,task]);
 async function copyPrompt(){try{await navigator.clipboard.writeText(prompt);alert('Prompt copied. Paste it into ChatGPT.')}catch{const box=document.createElement('textarea');box.value=prompt;document.body.appendChild(box);box.select();document.execCommand('copy');box.remove();alert('Prompt copied if your browser permits it.')}}
 function insert(){if(!response.trim())return;if(!confirm('Append this reviewed content to the current week? Your existing text will remain.'))return;onInsert(toSafeHtml(response));setResponse('');setReview(false)}
 return <section className="ai-bridge" aria-label="ChatGPT transfer panel"><div className="ai-top"><div><strong>ChatGPT Lesson Assistant</strong><p>Use your existing ChatGPT account. No API key required.</p></div><button type="button" onClick={onClose}>Close</button></div>
 <label>Choose an AI task<select value={task} onChange={e=>setTask(e.target.value as Task)}>{(Object.keys(taskNames) as Task[]).map(k=><option key={k} value={k}>{taskNames[k]}</option>)}</select></label>
 <label>Prepared prompt<textarea readOnly rows={8} value={prompt}/></label>
 <div className="ai-actions"><button onClick={copyPrompt}>Copy prompt</button><button onClick={()=>window.open('https://chatgpt.com/','_blank','noopener,noreferrer')}>Open ChatGPT</button></div>
 <div className="ai-divider">AFTER CHATGPT GENERATES A RESPONSE</div>
 <label>Paste the generated response<textarea rows={9} value={response} onChange={e=>{setResponse(e.target.value);setReview(false)}} placeholder="Copy the answer from ChatGPT and paste it here. You can edit it before inserting."/></label>
 <button disabled={!response.trim()} onClick={()=>setReview(true)}>Preview suggested content</button>
 {review&&<div className="ai-preview"><h3>Review before inserting</h3><p>The response will be appended to this week's lesson content. It will not overwrite the original.</p><div className="ai-preview-text">{response}</div><button onClick={insert}>Approve and insert into lesson</button></div>}
 <small>ChatGPT does not automatically send its response to this application. The transfer is manual until an official integration is added.</small>
 </section>;
}
