import React from 'react';
import type {Editor} from '@tiptap/core';
type Props={editor:Editor|null};
export default function ImageLayoutControls({editor}:Props){
 const selected=editor?.isActive('image')??false;
 const attrs=selected?editor?.getAttributes('image'):{};
 function change(width:number,alignment:'left'|'center'|'right'){if(!editor||!selected)return;editor.chain().focus().updateAttributes('image',{width,alignment}).run()}
 const width=Number(attrs?.width)||70,alignment=(attrs?.alignment||'center') as 'left'|'center'|'right';
 return <div className="image-layout-controls"><strong>Image layout</strong><span>{selected?'Selected image':'Click an image in the editor'}</span><label>Width <input type="range" min="20" max="100" step="5" disabled={!selected} value={width} onChange={e=>change(Number(e.target.value),alignment)}/>{width}%</label><div className="image-align">{(['left','center','right'] as const).map(a=><button type="button" disabled={!selected} aria-pressed={selected&&a===alignment} key={a} onClick={()=>change(width,a)}>{a}</button>)}</div></div>
}
