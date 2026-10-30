import Image from '@tiptap/extension-image';
export const LayoutImage=Image.extend({
 addAttributes(){return {...this.parent?.(),width:{default:70,parseHTML:element=>Number(element.getAttribute('data-width'))||70,renderHTML:attributes=>({'data-width':attributes.width,style:'width:'+attributes.width+'%;'})},alignment:{default:'center',parseHTML:element=>element.getAttribute('data-alignment')||'center',renderHTML:attributes=>({'data-alignment':attributes.alignment,style:'display:block;width:'+attributes.width+'%;margin-left:'+(attributes.alignment==='center'?'auto':attributes.alignment==='right'?'auto':'0')+';margin-right:'+(attributes.alignment==='center'?'auto':attributes.alignment==='left'?'auto':'0')+';'})}}}
});
