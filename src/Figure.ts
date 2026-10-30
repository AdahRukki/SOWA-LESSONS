import {Node,mergeAttributes} from '@tiptap/core';
export const Figure=Node.create({
 name:'figure',group:'block',atom:true,draggable:true,
 addAttributes(){return {src:{default:''},alt:{default:''},caption:{default:''},width:{default:70},alignment:{default:'center'}}},
 parseHTML(){return [{tag:'figure[data-sowa-figure]',getAttrs:dom=>{const el=dom as HTMLElement;const img=el.querySelector('img');return {src:img?.getAttribute('src')||'',alt:img?.getAttribute('alt')||'',caption:el.querySelector('figcaption')?.textContent||'',width:Number(el.getAttribute('data-width'))||70,alignment:el.getAttribute('data-alignment')||'center'}}}]},
 renderHTML({HTMLAttributes}){const a=HTMLAttributes;const width=Math.max(20,Math.min(100,Number(a.width)||70));return ['figure',mergeAttributes({'data-sowa-figure':'','data-width':width,'data-alignment':a.alignment,class:'sowa-figure'}),['img',{src:a.src,alt:a.alt,style:'width:'+width+'%;height:auto;display:block;margin-left:'+(a.alignment==='right'||a.alignment==='center'?'auto':'0')+';margin-right:'+(a.alignment==='left'||a.alignment==='center'?'auto':'0')}],['figcaption',{},a.caption||'Illustration']]}
});
