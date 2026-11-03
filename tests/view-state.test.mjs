import test from 'node:test';
import assert from 'node:assert/strict';
import {captureView,restoreView} from '../dist/src/view-state.js';

class Node {
 constructor(tag,attributes={},children=[]){this.tagName=tag.toUpperCase();this.attributes=attributes;this.children=children;this.id=attributes.id||'';this.scrollLeft=0;this.scrollTop=0;for(const child of children)child.parent=this;}
 hasAttribute(name){return name in this.attributes;}
 getAttribute(name){return this.attributes[name]??null;}
 closest(selector){for(let node=this;node;node=node.parent)if(node.hasAttribute('data-scroll-key'))return node;return null;}
 contains(node){return this===node||this.children.some(child=>child.contains(node));}
 querySelectorAll(selector){const matches=node=>selector==='[data-scroll-key]'?node.hasAttribute('data-scroll-key'):selector==='details[data-disclosure-key]'?node.tagName==='DETAILS'&&node.hasAttribute('data-disclosure-key'):node.tagName.toLowerCase()===selector;return this.children.flatMap(child=>[...(matches(child)?[child]:[]),...child.querySelectorAll(selector)]);}
 focus(options){this.focusOptions=options;}
 scrollTo({left,top,behavior}){this.scrollLeft=left;this.scrollTop=top;this.scrollBehavior=behavior;}
}
const viewport=(x=0,y=0)=>({scrollX:x,scrollY:y,scrollTo({left,top,behavior}){this.scrollX=left;this.scrollY=top;this.behavior=behavior;}});
function fixture(){
 const row=new Node('input',{'data-kana-group':'g'}),rows=new Node('div',{'data-scroll-key':'kana-rows'},[row]);
 const chart=new Node('details',{'data-disclosure-key':'kana-chart'},[rows]);chart.open=true;
 const item=new Node('button',{'data-action':'study-select','data-kind':'vocabulary','data-item':'last'});
 const words=new Node('aside',{'data-scroll-key':'study-vocabulary'},[item]);
 const root=new Node('div',{},[chart,words]);root.ownerDocument={activeElement:row};return{root,row,rows,chart,item,words};
}
test('a replacement DOM keeps each table scroll, disclosure state, viewport and the same focused row',()=>{
 const before=fixture(),screen=viewport(7,640);before.rows.scrollTop=285;before.rows.scrollLeft=12;before.words.scrollTop=410;
 const saved=captureView(before.root,screen),after=fixture();after.chart.open=false;screen.scrollX=screen.scrollY=0;
 restoreView(after.root,saved,screen);
 assert.equal(after.rows.scrollTop,285);assert.equal(after.rows.scrollLeft,12);assert.equal(after.words.scrollTop,410);assert.equal(after.chart.open,true);
 assert.deepEqual(after.row.focusOptions,{preventScroll:true});assert.equal(screen.scrollY,640);assert.equal(screen.scrollX,7);assert.equal(screen.behavior,'instant');
});
test('focus stays inside its original table and closed disclosures remain closed on consecutive repaints',()=>{
 const before=fixture();before.chart.open=false;before.root.ownerDocument.activeElement=before.item;before.words.scrollTop=330;
 const after=fixture(),duplicate=new Node('button',before.item.attributes);after.root.children.unshift(duplicate);duplicate.parent=after.root;
 restoreView(after.root,captureView(before.root,viewport(0,900)),viewport());
 assert.equal(after.chart.open,false);assert.deepEqual(after.item.focusOptions,{preventScroll:true});assert.equal(duplicate.focusOptions,undefined);assert.equal(after.words.scrollTop,330);
 after.root.ownerDocument.activeElement=after.item;const third=fixture();restoreView(third.root,captureView(after.root,viewport(0,900)),viewport());assert.equal(third.words.scrollTop,330);assert.equal(third.chart.open,false);
});
test('removed rows and tables do not throw or steal focus outside the application',()=>{
 const before=fixture(),screen=viewport(0,120);before.root.ownerDocument.activeElement=new Node('button',{'data-action':'outside'});
 const saved=captureView(before.root,screen);assert.equal(saved.focus,null);
 const empty=new Node('div');assert.doesNotThrow(()=>restoreView(empty,saved,screen));assert.equal(screen.scrollY,120);
 const selected=captureView(fixture().root,viewport());assert.doesNotThrow(()=>restoreView(empty,selected,screen));assert.doesNotThrow(()=>restoreView(empty,null,screen));
});

test('personal, difficulty and listening filters keep keyboard focus after a saved selection repaints the page',()=>{
 for(const attribute of ['data-personal','data-weakness-filter','data-listening-setting']){
  const make=()=>{const first=new Node('select',{[attribute]:'first'}),selected=new Node('select',{[attribute]:'second'});const root=new Node('div',{},[first,selected]);root.ownerDocument={activeElement:selected};return{root,first,selected};};
  const before=make(),after=make(),screen=viewport(0,710);
  restoreView(after.root,captureView(before.root,screen),screen);
  assert.deepEqual(after.selected.focusOptions,{preventScroll:true});assert.equal(after.first.focusOptions,undefined);assert.equal(screen.scrollY,710);
 }
});
