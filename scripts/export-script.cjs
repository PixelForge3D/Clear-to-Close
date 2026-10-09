// Rebuild the review copy after editing dialogue.js: node scripts/export-script.cjs
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..');
const data=vm.runInNewContext(fs.readFileSync(path.join(root,'dialogue.js'),'utf8')+'\n({LINES,SCRIPT})');
const titles={apartment:'Apartment and internet',loan_office:'Loan office and documents',town:'Town and Cousin Dave',realtor_office:'Agent consultation',showings:'House hunting',offer:'Offer',closing:'Underwriting and closing',core:'Shared dialogue and UI'};
const dormant=new Set(['SCRIPT.core.buildUI_reviewPages','SCRIPT.realtor_office.buildRealtorOffice_realtorPages']);
let out='# Clear to Close — Script Review (r7)\n\nThis is a generated text inventory, grouped by location and source key. It is not a chronological screenplay: some entries are alternate branches, repeated interactions, or UI labels. The game reads `dialogue.js`, not this document. Use the keys below to identify edits.\n\nDynamic values appear as `{homeName}`, `{count}`, etc. Page lists show headings followed by bodies. Retained unused page collections are explicitly marked. Original wording is preserved.\n';
function render(value){
 if(typeof value==='function'){
  const params=value.toString().match(/^\(([^)]*)\)/)[1].split(',').map(x=>x.trim()).filter(Boolean);
  return render(value(...params.map(p=>'{'+p+'}')));
 }
 if(Array.isArray(value))return value.map((v,i)=>`[${i+1}]\n${render(v)}`).join('\n\n');
 if(value&&typeof value==='object')return Object.entries(value).map(([k,v])=>k+': '+render(v)).join('\n');
 return String(value);
}
for(const [group,title]of Object.entries(titles)){
 out+='\n## '+title+'\n';
 for(const section of ['LINES','SCRIPT']){
  out+='\n### '+(section==='LINES'?'Spoken lines':'Additional dialogue, page collections, objectives and screen text')+'\n';
  for(const [key,val]of Object.entries(data[section][group]||{})){
   const id=section+'.'+group+'.'+key;
   out+='\n**`'+id+'`**'+(dormant.has(id)?' — RETAINED, NOT DISPLAYED BY CURRENT FLOW':'')+'\n\n';
   out+=render(val).split('\n').map(line=>'> '+line).join('\n')+'\n';
  }
 }
}
fs.writeFileSync(path.join(root,'SCRIPT_REVIEW.md'),out);
console.log('Updated SCRIPT_REVIEW.md');
