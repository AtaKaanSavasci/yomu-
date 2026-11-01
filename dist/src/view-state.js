// Preserve a same-page repaint without scrolling the user back to the first row.
const named=(root,selector,attribute,key)=>[...root.querySelectorAll(selector)].find(node=>node.getAttribute(attribute)===key);
function focusIdentity(root,node){
 if(!node||!root.contains(node))return null;
 const attributes=node.id?['id']:node.hasAttribute('aria-label')?['aria-label']:['data-kana-group','data-lab','data-study','data-study-kind','data-anime','data-setting','data-action','data-item','data-kind','data-level','data-script','data-quote','data-lang'];
 const values=attributes.filter(name=>node.hasAttribute(name)).map(name=>[name,node.getAttribute(name)]);
 if(!values.length)return null;
 return {tag:node.tagName.toLowerCase(),values,scope:node.closest('[data-scroll-key]')?.getAttribute('data-scroll-key')||null};
}
export function captureView(root,viewport=window){
 return {left:viewport.scrollX,top:viewport.scrollY,
  panes:[...root.querySelectorAll('[data-scroll-key]')].map(node=>({key:node.getAttribute('data-scroll-key'),left:node.scrollLeft,top:node.scrollTop})),
  disclosures:[...root.querySelectorAll('details[data-disclosure-key]')].map(node=>({key:node.getAttribute('data-disclosure-key'),open:node.open})),
  focus:focusIdentity(root,root.ownerDocument.activeElement)};
}
export function restoreView(root,snapshot,viewport=window){
 if(!snapshot)return;
 for(const saved of snapshot.disclosures){const node=named(root,'details[data-disclosure-key]','data-disclosure-key',saved.key);if(node)node.open=saved.open;}
 if(snapshot.focus){
  const {tag,values,scope}=snapshot.focus,container=scope?named(root,'[data-scroll-key]','data-scroll-key',scope):root;
  const target=container&&[...container.querySelectorAll(tag)].find(node=>values.every(([name,value])=>node.getAttribute(name)===value));
  if(target&&!target.disabled)target.focus({preventScroll:true});
 }
 // Apply scroll last: focusing and opening disclosures must not reset it.
 for(const saved of snapshot.panes){const node=named(root,'[data-scroll-key]','data-scroll-key',saved.key);node?.scrollTo({left:saved.left,top:saved.top,behavior:'instant'});}
 viewport.scrollTo({left:snapshot.left,top:snapshot.top,behavior:'instant'});
}
