"use strict";
// town: scene methods added onto ClearToClose (see HOW_TO_EXTEND.md).
Object.assign(ClearToClose.prototype, {

  buildTown() {
    this.townLayer = this.add.container(0,0).setVisible(false);
    const A = obj => { this.townLayer.add(obj); return obj; };
    A(this.add.rectangle(240,135,480,270,0x708e8d));
    A(this.add.rectangle(240,30,480,58,0x30566b));
    A(this.add.rectangle(240,225,480,68,0x344553));
    A(this.add.rectangle(240,184,480,48,0xaeb9aa));
    A(this.add.rectangle(240,207,480,3,0xe9d4a3));
    for (let x=16;x<480;x+=56) A(this.add.rectangle(x,225,25,2,0xe9d4a3));

    // Both buildings are one short walk apart. Empty edges leave room for expansion.
    A(this.add.rectangle(117,96,150,110,0x845c43).setStrokeStyle(4,0x382b2b));
    A(this.add.rectangle(117,53,154,24,0x543b37));
    A(this.add.text(117,55,SCRIPT.town.buildTown_text_1,{
      fontFamily:"monospace",fontSize:"11px",color:"#fff"
    }).setOrigin(.5));
    for (const x of [72,162]) A(this.add.rectangle(x,94,24,30,0x84b2c2).setStrokeStyle(3,0x3e5361));
    this.townApartmentDoor = A(this.add.rectangle(117,129,31,43,0x452d26)
      .setStrokeStyle(3,0xd6b994));
    A(this.add.circle(127,132,2,0xe3cd82));

    A(this.add.rectangle(362,96,155,110,0x416c88).setStrokeStyle(4,0x1d3e55));
    A(this.add.rectangle(362,53,159,24,0x22485e));
    A(this.add.text(362,55,SCRIPT.town.buildTown_text_2,{
      fontFamily:"monospace",fontSize:"10px",color:"#fff"
    }).setOrigin(.5));
    for (const x of [315,409]) A(this.add.rectangle(x,96,27,30,0x9fc8db).setStrokeStyle(3,0x23475a));
    this.townBrokerDoor = A(this.add.rectangle(362,129,33,43,0x294654)
      .setStrokeStyle(3,0xe5d6a9));
    A(this.add.circle(373,133,2,0xf3de97));
    this.townDoorGlow = A(this.add.rectangle(362,129,42,51,0x000000,0)
      .setStrokeStyle(3,0xf5d66f).setVisible(false));

    // Small street props make the transition feel like a place, not another menu.
    this.townBench = A(this.add.rectangle(236,126,43,13,0x674835).setStrokeStyle(2,0x382d2a));
    A(this.add.rectangle(224,140,4,18,0x384851));
    A(this.add.rectangle(248,140,4,18,0x384851));
    this.streetLamp = A(this.add.rectangle(266,75,5,71,0x314b55));
    A(this.add.circle(266,41,11,0xf2d794).setStrokeStyle(3,0x405867));

    // Once preapproval is collected, the city opens to the east. The player still
    // walks there naturally instead of selecting a location from a menu.
    this.downtownArrow = A(this.add.text(463,190,SCRIPT.town.buildTown_text_3,{
      fontFamily:"monospace",fontSize:"8px",color:"#f5d66f",
      backgroundColor:"#173247cc",padding:{x:4,y:3}
    }).setOrigin(1,.5).setVisible(false));

    this.townBarriers = this.physics.add.staticGroup();
    const solid = (x,y,w,h) => {
      const r = this.add.rectangle(x,y,w,h,0x000000,0);
      this.physics.add.existing(r,true);
      this.townBarriers.add(r);
    };
    solid(240,17,480,34); solid(8,135,16,270); solid(472,135,16,270);
    solid(240,264,480,12);
    solid(117,96,150,110); solid(362,96,155,110);
    solid(236,126,43,13); solid(266,75,10,71);
    this.townBarriers.children.iterate(obj=>{obj.body.enable=false;});
    this.physics.add.collider(this.player,this.townBarriers);

    this.townItems=[];
    for (const [obj,kind,text,radius] of [
      [this.townApartmentDoor,"townApartment",SCRIPT.town.buildTown_text_4,52],
      [this.townBrokerDoor,"townBroker",SCRIPT.town.buildTown_text_5,54],
      [this.townBench,"normal",SCRIPT.town.buildTown_text_6,46]
    ]) {
      obj.setData("kind",kind).setData("text",text).setData("radius",radius);
      this.townItems.push(obj);
    }
  },

  buildDowntown() {
    this.downtownLayer = this.add.container(0,0).setVisible(false);
    const A = obj => { this.downtownLayer.add(obj); return obj; };

    // A simple playable city block for now. Art can be upgraded later without
    // changing the scene logic or collision map.
    A(this.add.rectangle(240,135,480,270,0x687f86));
    A(this.add.rectangle(240,225,480,90,0x374550));
    A(this.add.rectangle(240,178,480,54,0xb8b6aa));
    A(this.add.rectangle(240,206,480,3,0xe9d4a3));
    for (let x=20;x<480;x+=58) A(this.add.rectangle(x,229,30,2,0xe9d4a3));

    // A marked pull-in bay keeps the showing car beside the office instead of
    // leaving it parked across the walking route.
    A(this.add.rectangle(422,119,76,66,0x485a62));
    A(this.add.rectangle(422,86,76,2,0xe8dfbf));
    A(this.add.rectangle(384,119,2,66,0xe8dfbf));
    A(this.add.rectangle(460,119,2,66,0xe8dfbf));

    // Comedic decoy from the approved story outline.
    A(this.add.rectangle(76,99,112,112,0x78644f).setStrokeStyle(4,0x342c27));
    A(this.add.rectangle(76,52,116,24,0x51463a));
    A(this.add.text(76,52,SCRIPT.town.buildDowntown_text_1,{
      fontFamily:"monospace",fontSize:"8px",color:"#fff"
    }).setOrigin(.5));
    this.discountWindow=A(this.add.rectangle(76,97,56,30,0xa7c1c7).setStrokeStyle(3,0x3c5159));
    // Leave a visible strip of facade between the window and the door.
    this.discountDoor = A(this.add.rectangle(76,136,31,38,0x4e382c).setStrokeStyle(3,0xc7aa75));

    // Cousin Dave enters dynamically from the right the first time this block loads.
    this.daveNpc = A(this.add.rectangle(500,218,18,27,0x5a6e8b).setStrokeStyle(2,0x2c3747).setVisible(false));
    this.daveHead = A(this.add.circle(500,199,9,0xd2a07c).setStrokeStyle(2,0x49352c).setVisible(false));
    this.daveLabel = A(this.add.text(500,179,SCRIPT.town.buildDowntown_text_2,{
      fontFamily:"monospace",fontSize:"7px",color:"#fff",backgroundColor:"#34485acc",padding:{x:2,y:1}
    }).setOrigin(.5).setVisible(false));
    this.davePieces=[this.daveNpc,this.daveHead,this.daveLabel];

    // Keller Williams is its own building on the city block. Keep the logo simple
    // and generic for the prototype: red "kw" + Keller Williams wordmark.
    A(this.add.rectangle(272,91,220,126,0xe7e3dc).setStrokeStyle(4,0x3b4147));
    A(this.add.rectangle(272,45,224,30,0xb8202c));
    A(this.add.text(272,43,SCRIPT.town.buildDowntown_text_3,{
      fontFamily:"Arial Black",fontSize:"24px",color:"#ffffff"
    }).setOrigin(.5));
    A(this.add.text(272,69,SCRIPT.town.buildDowntown_text_4,{
      fontFamily:"monospace",fontSize:"8px",color:"#b8202c"
    }).setOrigin(.5));
    for (const x of [210,334]) A(this.add.rectangle(x,102,48,40,0x8cb4c5).setStrokeStyle(3,0x52646c));
    this.kwDoor = A(this.add.rectangle(272,129,33,43,0x9a2c35).setStrokeStyle(3,0x5b1f25));
    A(this.add.rectangle(272,124,20,22,0xbdd4db));
    A(this.add.circle(283,133,2,0xe9d77b));

    // The realtor's car is intentionally present now so it can become the showing
    // vehicle later without appearing out of nowhere.
    this.realtorCarPieces=[];
    const C=o=>{this.realtorCarPieces.push(A(o));return o;};
    this.realtorCar = C(this.add.rectangle(422,117,68,34,0x872d2f).setStrokeStyle(3,0x321c20));
    C(this.add.rectangle(422,110,44,17,0x263d4b).setStrokeStyle(2,0xa7bdc8));
    C(this.add.rectangle(395,117,9,16,0xb7c6cc));
    C(this.add.rectangle(449,117,9,16,0xb7c6cc));
    C(this.add.circle(402,135,8,0x20242a).setStrokeStyle(2,0x667078));
    C(this.add.circle(442,135,8,0x20242a).setStrokeStyle(2,0x667078));
    this.realtorCarPieces.forEach(o=>o.setData("parkX",o.x).setData("parkY",o.y));

    this.tourAgentBody=A(this.add.rectangle(272,145,20,28,0xb8202c).setStrokeStyle(2,0x551e24).setVisible(false));
    this.tourAgentHead=A(this.add.circle(272,122,10,0xc99572).setStrokeStyle(2,0x392d27).setVisible(false));
    this.tourAgentLabel=A(this.add.text(272,105,SCRIPT.town.buildDowntown_text_5,{fontFamily:"monospace",fontSize:"8px",
      color:"#fff",backgroundColor:"#7a1e27",padding:{x:3,y:2}}).setOrigin(.5).setVisible(false));
    this.tourAgentPieces=[this.tourAgentBody,this.tourAgentHead,this.tourAgentLabel];

    A(this.add.text(18,190,SCRIPT.town.buildDowntown_text_6,{
      fontFamily:"monospace",fontSize:"8px",color:"#f5d66f",
      backgroundColor:"#173247cc",padding:{x:4,y:3}
    }).setOrigin(0,.5));

    this.downtownBarriers = this.physics.add.staticGroup();
    const solid = (x,y,w,h) => {
      const r=this.add.rectangle(x,y,w,h,0x000000,0);
      this.physics.add.existing(r,true);
      this.downtownBarriers.add(r);
      return r;
    };
    solid(240,10,480,20); solid(240,264,480,12); solid(472,135,16,270);
    // Discount office is not enterable in this prototype.
    solid(76,99,112,112);
    // Keller Williams facade, carved around the actual entrance.
    solid(272,77,220,98);
    solid(204,137,82,28); solid(340,137,82,28);
    solid(422,117,68,34);
    this.daveBarrier=solid(147,129,22,35);
    this.tourAgentBarrier=solid(399,177,22,32);
    this.downtownBarriers.children.iterate(obj=>{obj.body.enable=false;});
    this.physics.add.collider(this.player,this.downtownBarriers);

    this.downtownItems=[];
    const interact=(obj,kind,text,margin=18)=>{
      obj.setData("kind",kind).setData("text",text).setData("interactionMargin",margin);
      this.downtownItems.push(obj);
    };
    interact(this.discountDoor,"discountDoor",SCRIPT.town.buildDowntown_text_7,20);
    this.daveNpc.setData("kind","cousinDave").setData("text",SCRIPT.town.buildDowntown_text_8)
      .setData("interactionMargin",19);
    this.downtownItems.push(this.daveNpc);
    interact(this.realtorCar,"realtorCar",SCRIPT.town.buildDowntown_text_9,20);
    interact(this.tourAgentBody,"tourAgent",SCRIPT.town.buildDowntown_text_10,20);
    // The KW door uses automatic doorway travel and is deliberately omitted from
    // manual interaction discovery, matching the other building doors.
    this.kwDoor.setData("kind","kwDoor").setData("interactionMargin",18);
    this.downtownItems.push(this.kwDoor);
  },

  showTown(from) {
    this.switchLocation("town");
    this.objective.setPosition(18,232);
    this.townUnlocked=true;
    this.statementHintPending=false;
    if (this.statementHintTimer) {
      this.statementHintTimer.remove(false);
      this.statementHintTimer=null;
    }
    this.setDocumentSceneVisible(false);
    this.box.setVisible(false);
    this.portrait.setVisible(false);
    this.face.setVisible(false);
    this.loAvatar.setVisible(false);
    this.text.setVisible(false);
    this.dialogue = false;

    this.loanBoard.setVisible(false);
    this.realtorConsultUI.setVisible(false);
    this.teamChatUI.setVisible(false);

    // Spawn beside the doorway/edge the player actually came from.
    const x = from==="broker" ? 362 : from==="downtown" ? 432 : 117;
    const y = from==="downtown" ? 198 : 170;
    this.player.setPosition(x,y).setVelocity(0);

    this.touchUI.setVisible(true);
    const lateObjective = this.realtorStage>=2
      ? this.lateQuestObjective("town")
      : SCRIPT.town.showTown_text_1;
    this.objective.setVisible(true).setText(this.officeStage>=4
      ? (this.officeStage===4 ? SCRIPT.town.showTown_text_2 : this.officeStage===5 ? SCRIPT.town.showTown_text_3 : this.officeStage===6 ? SCRIPT.town.showTown_text_4 : lateObjective)
      : this.officeStage===3 && this.allDocumentsCollected()
        ? SCRIPT.town.showTown_text_5
        : this.officeStage>=3
          ? SCRIPT.town.showTown_text_6
          : SCRIPT.town.showTown_text_7);
    this.downtownArrow.setVisible(this.officeStage>=7);
    this.townDoorGlow.setVisible(false);
    this.control=true;
    this.near=null;
    this.phase="town";
  },

  showDowntown(from) {
    this.switchLocation("downtown");
    this.objective.setPosition(18,232);
    this.box.setVisible(false);
    this.portrait.setVisible(false);
    this.face.setVisible(false);
    this.loAvatar.setVisible(false);
    this.text.setVisible(false);
    this.dialogue=false;
    this.near=null;

    // Once the agent heads out to the car, the desk must stay empty on re-entry.
    if (from==="realtor" && this.realtorStage>=2 && !this.offerAgentInside) {
      this.agentInOffice=false;
      this.setOfficeAgentVisible(false);
    }

    this.realtorConsultUI.setVisible(false);

    this.daveBarrier.body.enable=this.daveIntroSeen;
    if(this.daveIntroSeen) {
      this.positionDave(147,129);
      this.davePieces.forEach(p=>this.downtownLayer.bringToTop(p));
    }
    this.tourAgentBarrier.body.enable=this.tourAgentReady && !this.offerAgentInside;
    this.realtorCarPieces.forEach(o=>o.setPosition(o.getData("parkX"),o.getData("parkY")));
    if (this.tourAgentReady && !this.offerAgentInside) {
      this.positionTourAgent(399,177);
      this.tourAgentPieces.forEach(o=>o.setVisible(true).setAlpha(1));
    } else {
      this.tourAgentPieces.forEach(o=>o.setVisible(false));
    }

    if (from==="realtor") this.player.setPosition(272,170);
    else if (from==="showing") this.player.setPosition(370,210);
    else if (from==="closing") this.player.setPosition(432,198);
    else this.player.setPosition(34,194);
    this.player.setVelocity(0);

    this.touchUI.setVisible(true);
    this.closingArrow.setVisible(this.closingStage>=2);
    this.objective.setVisible(true).setText(this.realtorStage>=2
      ? this.lateQuestObjective("downtown")
      : SCRIPT.town.showDowntown_text_1);
    this.control=true;
    this.phase="downtown";
    if (from!=="realtor" && !this.daveIntroSeen) {
      this.time.delayedCall(180,()=>this.startDaveDowntownIntro());
    }
  },

  startDaveDowntownIntro() {
    if (this.phase!=="downtown" || this.daveIntroSeen) return;
    this.daveIntroSeen=true;
    this.control=false;
    this.player.setVelocity(0);
    this.davePieces.forEach(p=>{p.setVisible(true);this.downtownLayer.bringToTop(p);});
    // Dave meets the player's arrival spot, then stays by his storefront.
    const meetX=Math.min(118,this.player.x+28);
    const meetY=this.player.y;
    this.walkDavePath([{x:meetX,y:218,duration:2000},
      {x:meetX,y:Math.max(210,meetY+12),duration:550}],()=>{
      this.say(LINES.town.startDaveDowntownIntro_1,()=>
        this.say(LINES.town.startDaveDowntownIntro_2,()=>{
          this.walkDavePath([{x:147,y:211,duration:650},
            {x:147,y:129,duration:850}],()=>{
            this.daveBarrier.body.enable=true;
            this.control=true;
            this.near=null;
          });
        }));
    });
  },

  positionDave(x,y) {
    this.daveNpc.setPosition(x,y);
    this.daveHead.setPosition(x,y-19);
    this.daveLabel.setPosition(x,y-39);
  },

  walkDavePath(steps,done) {
    const walk=i=>{
      if (i>=steps.length) { if (done) done(); return; }
      const {x,y,duration}=steps[i];
      this.tweens.add({targets:this.daveNpc,x,y,duration,ease:"Linear"});
      this.tweens.add({targets:this.daveHead,x,y:y-19,duration,ease:"Linear"});
      this.tweens.add({targets:this.daveLabel,x,y:y-39,duration,ease:"Linear",
        onComplete:()=>walk(i+1)});
    };
    walk(0);
  },

});
