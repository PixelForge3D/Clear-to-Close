// Run with: node tests/location-regression.cjs (no dependencies).
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const context = vm.createContext({ ClearToClose: class {} });
vm.runInContext(fs.readFileSync(path.join(__dirname, '../locations.js'), 'utf8'), context);
const scene = new context.ClearToClose();
const makeLayer = () => ({ visible: true, setVisible(v) { this.visible=v; return this; },
  add(player) { player.parentContainer=this; }, bringToTop() {} });
const makeGroup = () => { const objects=[{body:{enable:true}}, {body:{enable:true}}];
  return {objects, children:{iterate(fn) { objects.forEach(fn); }}}; };
for (const name of ['world','office','town','downtown','realtor','showingStreet','closingStreet','closingRoom'])
  scene[name+'Layer']=makeLayer();
for (const name of ['barriers','officeBarriers','townBarriers','downtownBarriers','realtorBarriers','closingStreetBarriers','closingRoomBarriers'])
  scene[name]=makeGroup();
scene.showingHomeLayers=Array.from({length:3},makeLayer);
scene.showingHomeBarriersByIndex=Array.from({length:3},makeGroup);
scene.showingStreetBarriersByIndex=Array.from({length:3},makeGroup);
scene.showingHomeLayer=scene.showingHomeLayers[0];
scene.showingHomeBarriers=scene.showingHomeBarriersByIndex[0];
scene.showingStreetBarriers=scene.showingStreetBarriersByIndex[0];
scene.player={x:31,y:72,visible:false,body:{enable:false},setVelocity(v){this.velocity=v;}};
scene.mobile={set(x,y){this.x=x;this.y=y;}};
scene.daveBarrier=scene.downtownBarriers.objects[0];
scene.tourAgentBarrier=scene.downtownBarriers.objects[1];
scene.boardBarrier=scene.officeBarriers.objects[0];
scene.setWhiteboardVisible=visible=>{scene.boardBarrier.body.enable=visible;};
scene.officeStage=0;scene.daveIntroSeen=false;scene.tourAgentReady=false;
scene.agentAvatar=makeLayer();scene.phase='storyCard';
scene.registerLocations();
const names=[...scene.locations.keys()];
function check(target){
  assert.equal(scene.currentLocation,target);
  for(const [name,loc]of scene.locations){
    for(const layer of loc.layers?.()||[loc.layer()])
      assert.equal(layer.visible,name===target&&layer===loc.layer(),`${name}: visibility`);
    const active=target===name?(loc.activeGroups?.()||loc.groups()):[];
    for(const group of loc.groups())if(!active.includes(group))
      assert(group.objects.every(o=>!o.body.enable),`${name}: inactive solids`);
  }
  if(target)assert.equal(scene.player.parentContainer,scene.locations.get(target).layer());
  assert.equal(scene.near,null);assert.equal(scene.agentAvatar.visible,false);
  assert.equal(scene.player.x,31);assert.equal(scene.player.y,72);
  assert.equal(scene.player.visible,false);assert.equal(scene.player.body.enable,false);
  assert.equal(scene.phase,'storyCard'); // location switching must not advance the script
}
let pairs=0;
for(let home=0;home<3;home++){
  scene.showingHomeLayer=scene.showingHomeLayers[home];
  scene.showingHomeBarriers=scene.showingHomeBarriersByIndex[home];
  scene.showingStreetBarriers=scene.showingStreetBarriersByIndex[home];
  for(const from of names)for(const to of [...names,null]){
    scene.switchLocation(from);scene.near={};scene.agentAvatar.visible=true;
    scene.switchLocation(to);check(to);pairs++;
  }
}
scene.switchLocation('office');assert.equal(scene.boardBarrier.body.enable,false);
scene.officeStage=1;scene.whiteboardDeliveryDone=true;
scene.switchLocation('office');assert.equal(scene.boardBarrier.body.enable,true);
scene.switchLocation('downtown');assert.equal(scene.daveBarrier.body.enable,false);
scene.daveIntroSeen=true;scene.tourAgentReady=true;
scene.switchLocation('downtown');assert.equal(scene.daveBarrier.body.enable,true);assert.equal(scene.tourAgentBarrier.body.enable,true);
scene.offerAgentInside=true;scene.switchLocation('downtown');assert.equal(scene.tourAgentBarrier.body.enable,false);
assert.throws(()=>scene.switchLocation('typo'),/Unknown location/);assert.equal(scene.currentLocation,'downtown');
assert.throws(()=>scene.registerLocation('town',{}),/Duplicate location/);
// Registering a new location requires no changes to other transition methods.
const bankLayer=makeLayer(),bankGroup=makeGroup();
scene.registerLocation('bank',{layer:()=>bankLayer,groups:()=>[bankGroup],items:()=>[]});
scene.switchLocation('bank');assert(bankLayer.visible);assert(bankGroup.objects.every(o=>o.body.enable));
scene.switchLocation('town');assert(!bankLayer.visible);assert(bankGroup.objects.every(o=>!o.body.enable));
console.log(`PASS: ${pairs} location transitions, all three home variants, conditional solids, new location, invalid name, and player/story preservation.`);
