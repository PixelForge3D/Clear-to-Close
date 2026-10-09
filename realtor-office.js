"use strict";
// realtor-office: scene methods added onto ClearToClose (see HOW_TO_EXTEND.md).
Object.assign(ClearToClose.prototype, {

  buildRealtorOffice() {
    this.realtorLayer = this.add.container(0,0).setVisible(false);
    const A = obj => { this.realtorLayer.add(obj); return obj; };

    A(this.add.rectangle(240,135,452,242,0xd9d2c5).setStrokeStyle(5,0x191b1f));
    A(this.add.rectangle(240,48,430,44,0xf0ece5));
    A(this.add.rectangle(240,70,430,4,0xb8202c));
    for (let y=86;y<250;y+=28) A(this.add.rectangle(240,y,428,1,0xc8c0b4,.55));

    // Generic KW wall branding. Prototype geometry only; polished art comes later.
    A(this.add.rectangle(92,104,112,60,0xffffff).setStrokeStyle(3,0x9c9c9c));
    A(this.add.text(92,93,SCRIPT.realtor_office.buildRealtorOffice_text_1,{fontFamily:"Arial Black",fontSize:"28px",color:"#b8202c"}).setOrigin(.5));
    A(this.add.text(92,120,SCRIPT.realtor_office.buildRealtorOffice_text_2,{fontFamily:"monospace",fontSize:"7px",color:"#3a3a3a"}).setOrigin(.5));

    // Agent desk and workstation.
    A(this.add.rectangle(286,150,128,34,0x6e4b38).setStrokeStyle(3,0x33241d));
    A(this.add.rectangle(286,143,48,8,0xaab5bb));
    this.realtor = A(this.add.rectangle(286,109,24,35,0xb8202c).setStrokeStyle(2,0x551e24));
    this.realtor.setData("interactBounds",{x:286,y:150,w:128,h:34});
    this.realtorHead = A(this.add.circle(286,89,12,0xc99572).setStrokeStyle(2,0x392d27));
    this.realtorLabel = A(this.add.text(286,64,SCRIPT.realtor_office.buildRealtorOffice_text_3,{
      fontFamily:"monospace",fontSize:"8px",color:"#fff",
      backgroundColor:"#b8202ccc",padding:{x:4,y:2}
    }).setOrigin(.5));

    // A small buyer-consultation corner.
    // The consultation stays above the dialogue area, directly below the KW sign.
    this.consultTable = A(this.add.rectangle(100,154,72,36,0xb79a76).setStrokeStyle(3,0x5d4d3c));
    this.agentChair = A(this.add.rectangle(39,154,20,27,0x725746).setStrokeStyle(2,0x3e3028));
    this.buyerChair = A(this.add.rectangle(165,154,20,27,0x725746).setStrokeStyle(2,0x3e3028));
    A(this.add.rectangle(405,109,70,30,0x6e4b38).setStrokeStyle(2,0x33241d));
    A(this.add.rectangle(390,86,32,27,0x344854).setStrokeStyle(2,0x1d2d36));
    this.searchScreen=A(this.add.text(390,86,SCRIPT.realtor_office.buildRealtorOffice_text_4,{fontFamily:"monospace",fontSize:"7px",color:"#8ef0bf"}).setOrigin(.5));
    A(this.add.rectangle(390,110,29,7,0xb4bfc1));
    this.agentPrinter=A(this.add.rectangle(428,102,24,20,0xbfcbd0).setStrokeStyle(2,0x41525d));
    A(this.add.rectangle(428,94,18,3,0x243746));
    this.agentHomeList=A(this.add.rectangle(428,101,16,19,0xf3efdc).setStrokeStyle(1,0x617888).setVisible(false));
    this.typingHands=[A(this.add.rectangle(385,111,6,4,0xc99572).setVisible(false)),
      A(this.add.rectangle(397,111,6,4,0xc99572).setVisible(false))];

    this.realtorOfficeDoor=A(this.add.rectangle(240,245,48,18,0x8f3036).setStrokeStyle(3,0x4b2226));
    A(this.add.text(240,243,SCRIPT.realtor_office.buildRealtorOffice_text_5,{fontFamily:"monospace",fontSize:"9px",color:"#fff"}).setOrigin(.5));

    this.realtorBarriers=this.physics.add.staticGroup();
    const solid=(x,y,w,h)=>{
      const r=this.add.rectangle(x,y,w,h,0x000000,0);
      this.physics.add.existing(r,true);
      this.realtorBarriers.add(r);
      return r;
    };
    solid(240,48,430,43); solid(18,135,16,228); solid(462,135,16,228); solid(240,254,430,12);
    solid(286,150,128,34); solid(100,154,72,36); solid(39,154,20,27);
    solid(165,154,20,27); solid(405,99,70,50);
    this.realtorBarriers.children.iterate(obj=>{obj.body.enable=false;});
    this.physics.add.collider(this.player,this.realtorBarriers);

    this.realtorItems=[];
    this.realtor.setData("kind","realtor").setData("text",SCRIPT.realtor_office.buildRealtorOffice_text_6).setData("interactionMargin",18);
    this.realtorItems.push(this.realtor);
    for(const chair of [this.buyerChair,this.agentChair]) {
      chair.setData("kind","buyerChair").setData("text",SCRIPT.realtor_office.buildRealtorOffice_text_7).setData("interactionMargin",28);
      this.realtorItems.push(chair);
    }

    // Buyer consultation presentation.
    this.realtorConsultUI=this.add.container(0,0).setDepth(640).setVisible(false);
    this.realtorConsultUI.add(this.add.rectangle(240,135,480,270,0x07101d,.95));
    this.realtorConsultUI.add(this.add.rectangle(240,131,384,205,0xf0ece5).setStrokeStyle(4,0xb8202c));
    this.realtorConsultHeading=this.add.text(240,48,"",{
      fontFamily:"monospace",fontSize:"15px",color:"#7a1e27"
    }).setOrigin(.5,0);
    this.realtorConsultBody=this.add.text(73,82,"",{
      fontFamily:"monospace",fontSize:"11px",color:"#26343c",wordWrap:{width:334},lineSpacing:5
    });
    this.realtorConsultUI.add([this.realtorConsultHeading,this.realtorConsultBody]);
    this.realtorConsultUI.add(this.add.text(240,216,SCRIPT.realtor_office.buildRealtorOffice_text_8,{
      fontFamily:"monospace",fontSize:"10px",color:"#7a1e27"
    }).setOrigin(.5));
    this.realtorPages=SCRIPT.realtor_office.buildRealtorOffice_realtorPages;

    this.teamChatUI=this.add.container(0,0).setDepth(650).setVisible(false);
    this.teamChatUI.add(this.add.rectangle(240,135,480,270,0x06101d,.96));
    this.teamChatUI.add(this.add.rectangle(240,132,330,208,0x16283b).setStrokeStyle(3,0x8db4ce));
    this.teamChatUI.add(this.add.text(240,45,SCRIPT.realtor_office.buildRealtorOffice_text_9,{
      fontFamily:"monospace",fontSize:"14px",color:"#f5d66f"
    }).setOrigin(.5));
    this.teamChatUI.add(this.add.text(95,78,
      SCRIPT.realtor_office.buildRealtorOffice_text_10,{
      fontFamily:"monospace",fontSize:"10px",color:"#ffffff",wordWrap:{width:290},lineSpacing:4
    }));
    this.teamChatUI.add(this.add.text(240,225,SCRIPT.realtor_office.buildRealtorOffice_text_11,{
      fontFamily:"monospace",fontSize:"9px",color:"#9fc5e8"
    }).setOrigin(.5));
  },

  setOfficeAgentVisible(visible) {
    this.realtor.setVisible(visible);
    this.realtorHead.setVisible(visible);
    if (visible && this.offerAgentInside && !this.realtorSeated)
      this.realtorLabel.setPosition(286,64);
    this.realtorLabel.setVisible(visible && !this.realtorSeated);
  },

  enterRealtorOffice() {
    if (this.phase!=="downtown") return;
    this.switchLocation("realtorOffice");

    this.setOfficeAgentVisible(this.agentInOffice);
    this.player.setPosition(240,215).setVelocity(0);

    this.objective.setText(this.offerStage===3
      ? this.lateQuestObjective("realtorOffice")
      : this.offerStage===1 ? SCRIPT.realtor_office.enterRealtorOffice_text_1
      : !this.agentInOffice ? SCRIPT.realtor_office.enterRealtorOffice_text_2
      : this.realtorStage>=2
      ? (this.favoriteHome>=0 ? SCRIPT.realtor_office.enterRealtorOffice_text_3 : SCRIPT.realtor_office.enterRealtorOffice_text_4)
      : SCRIPT.realtor_office.enterRealtorOffice_text_5);
    this.control=true;
    this.near=null;
    this.phase="realtorOffice";
    if (!this.realtorWelcomeSeen) {
      this.realtorWelcomeSeen=true;
      this.control=false;
      this.time.delayedCall(250,()=>
        this.say(LINES.realtor_office.enterRealtorOffice_1,()=>
          this.say(LINES.realtor_office.enterRealtorOffice_2,()=>
            this.say(LINES.realtor_office.enterRealtorOffice_3,()=>
              this.say(LINES.realtor_office.enterRealtorOffice_4,()=>
                { this.control=true; this.objective.setText(SCRIPT.realtor_office.enterRealtorOffice_text_6); })))));
    }
  },

  canUseConsultChair(chair) {
    const dx=Math.abs(this.player.x-chair.x),dy=this.player.y-chair.y;
    return (Math.abs(dy)<=10 && dx>=14 && dx<=43) || (dy>=14 && dy<=38 && dx<=22);
  },

  seatBuyerAndAgent(chair=this.buyerChair) {
    if (this.phase!=="realtorOffice" || this.realtorStage!==0 || !this.canUseConsultChair(chair)) return;
    this.buyerSeatX=chair.x;
    this.agentSeatX=chair===this.buyerChair ? this.agentChair.x : this.buyerChair.x;
    this.control=false;
    this.player.setVelocity(0);
    this.player.body.enable=false;
    this.prompt.setVisible(false);
    // Draw both seated people over the chairs and the table.
    this.realtorLayer.bringToTop(this.realtor);
    this.realtorLayer.bringToTop(this.realtorHead);
    this.realtorLayer.bringToTop(this.player);
    this.realtorLabel.setVisible(false);
    this.tweens.add({targets:this.player,x:this.buyerSeatX,y:154,duration:450,ease:"Sine.easeInOut",
      onComplete:()=>this.player.setTexture("heroSitting")});
    this.walkAgentPath([
      {x:197,y:109,duration:380},
      {x:197,y:190,duration:480},
      {x:this.agentSeatX,y:190,duration:650},
      {x:this.agentSeatX,y:154,duration:220}
    ],()=>{
      this.realtorHead.setY(137);
      this.realtor.setDisplaySize(24,22);
      this.realtorSeated=true;
      this.say(LINES.realtor_office.seatBuyerAndAgent_1,()=>
        this.say(LINES.realtor_office.seatBuyerAndAgent_2,()=>{
          this.realtorStage=1;
          this.startRealtorConsultation();
        }));
    });
  },

  walkAgentPath(steps,onComplete) {
    this.realtor.setDisplaySize(24,35);
    const walk=(index)=>{
      if (index===steps.length) {
        if (onComplete) onComplete();
        return;
      }
      const {x,y,duration}=steps[index];
      this.tweens.add({targets:this.realtor,x,y,duration,ease:"Linear"});
      this.tweens.add({targets:this.realtorHead,x,y:y-19,duration,ease:"Linear",
        onComplete:()=>walk(index+1)});
    };
    walk(0);
  },

  talkToRealtor() {
    if (!this.agentInOffice) return;
    if (this.realtorStage===0) {
      this.say(LINES.realtor_office.talkToRealtor_1);
      return;
    }
    if (this.realtorStage===1) {
      this.startRealtorConsultation();
      return;
    }
    if (this.offerStage===3) {
      if(!this.inspectionDone) this.reviewInspection();
      else this.say(LINES.realtor_office.talkToRealtor_2);
    } else if (this.favoriteHome>=0) {
      this.offerAgentInside=true;
      this.offerStage=1;
      this.tourAgentPieces.forEach(o=>o.setVisible(false));
      this.tourAgentBarrier.body.enable=false;
      this.startOfferReview();
    } else {
      this.say(LINES.realtor_office.talkToRealtor_3);
    }
  },

  startRealtorConsultation() {
    this.realtorPage=0;
    this.player.setVelocity(0);
    this.control=false;
    this.phase="realtorOffice";
    this.continueRealtorDialogue();
  },

  continueRealtorDialogue() {
    const lines=SCRIPT.realtor_office.continueRealtorDialogue_lines;
    if (this.realtorPage<lines.length) {
      this.say(lines[this.realtorPage++],()=>this.continueRealtorDialogue());
      return;
    }
    this.homePreferences.consulted=true;
    this.homePreferences.searchBudget="comfortable LO target";
    this.say(LINES.realtor_office.continueRealtorDialogue_1,()=>this.prepareHomeSearch());
  },

  prepareHomeSearch() {
    this.phase="agentSearch";
    this.control=false;
    this.realtorSeated=false;
    this.walkAgentPath([
      {x:this.agentSeatX || 39,y:190,duration:280},{x:197,y:190,duration:650},
      {x:197,y:110,duration:450},{x:365,y:110,duration:650},
      {x:365,y:145,duration:250},{x:390,y:145,duration:300}
    ],()=>{
      this.typingHands.forEach((hand,i)=>{
        hand.setVisible(true);
        this.tweens.add({targets:hand,y:108,duration:90+i*25,yoyo:true,repeat:25});
      });
      let tick=0;
      this.time.addEvent({delay:230,repeat:10,callback:()=>this.searchScreen.setText([SCRIPT.realtor_office.prepareHomeSearch_text_1,SCRIPT.realtor_office.prepareHomeSearch_text_2,SCRIPT.realtor_office.prepareHomeSearch_text_3][tick++%3])});
      this.time.delayedCall(3200,()=>{
        this.typingHands.forEach(hand=>hand.setVisible(false));
        this.searchScreen.setText(SCRIPT.realtor_office.prepareHomeSearch_text_4);
        this.printerCaption.setText(SCRIPT.realtor_office.prepareHomeSearch_text_5).setPosition(240,165).setVisible(true);
        this.playPrinterBuzz();
        this.time.delayedCall(500,()=>this.playPrinterBuzz());
        this.agentHomeList.setVisible(true);
        this.tweens.add({targets:this.agentHomeList,y:82,duration:1100});
        this.tweens.add({targets:this.agentPrinter,x:426,duration:65,yoyo:true,repeat:13,
          onComplete:()=>this.agentPrinter.setX(428)});
        this.time.delayedCall(1900,()=>{
          this.printerCaption.setVisible(false);
          this.say(LINES.realtor_office.prepareHomeSearch_1,()=>this.returnAgentWithTourList(),false);
        });
      });
    });
  },

  returnAgentWithTourList() {
    this.tweens.add({targets:this.agentHomeList,x:400,y:139,duration:400,ease:"Sine.easeInOut",onComplete:()=>{
      this.agentHomeList.setVisible(false);
      this.tourListCollected=true;
      this.returnAgentToDesk();
    }});
  },

  returnAgentToDesk() {
          this.walkAgentPath([{x:365,y:145,duration:300},{x:365,y:109,duration:250},
            {x:286,y:109,duration:450}],()=>{
            this.realtorHead.setY(89);
            this.realtorLabel.setPosition(286,64).setVisible(true);
            this.player.setTexture("hero");
            this.walkPlayerPath([{x:this.buyerSeatX || 165,y:190,duration:250},{x:197,y:190,duration:500},
              {x:286,y:190,duration:500}],()=>{
              this.phase="realtorOffice";
              this.realtorStage=2;
              this.player.body.enable=true;
              this.say(LINES.realtor_office.returnAgentToDesk_1,()=>{this.control=true;});
            });
          });
  },

  walkPlayerPath(steps,done) {
    this.player.setVelocity(0);
    this.player.body.enable=false;
    const walk=i=>{
      if(i===steps.length) {done();return;}
      this.tweens.add({targets:this.player,...steps[i],ease:"Linear",onComplete:()=>walk(i+1)});
    };
    walk(0);
  },

  seatForOffer(done) {
    this.control=false;
    this.phase="offerSeating";
    this.realtorLabel.setVisible(false);
    let arrived=0;
    const ready=()=>{if(++arrived===2) {
      this.realtorSeated=true;
      this.phase="realtorOffice";
      done();
    }};
    this.walkPlayerPath([{x:197,y:190,duration:450},{x:this.buyerSeatX || 165,y:190,duration:500},
      {x:this.buyerSeatX || 165,y:154,duration:250}],()=>{this.player.setTexture("heroSitting");ready();});
    this.walkAgentPath([{x:197,y:109,duration:450},{x:197,y:190,duration:450},
      {x:this.agentSeatX || 39,y:190,duration:650},{x:this.agentSeatX || 39,y:154,duration:250}],()=>{
      this.realtorHead.setY(137);this.realtor.setDisplaySize(24,22);ready();
    });
  },

  leaveOfferTable(done) {
    this.player.setTexture("hero");
    this.realtorSeated=false;
    this.walkPlayerPath([{x:this.buyerSeatX || 165,y:190,duration:250},{x:197,y:190,duration:500}],()=>{
      this.player.body.enable=true;
      this.walkAgentPath([{x:this.agentSeatX || 39,y:190,duration:250},{x:197,y:190,duration:650},
        {x:197,y:109,duration:450},{x:286,y:109,duration:450}],()=>{
        this.realtorHead.setY(89);this.realtorLabel.setVisible(true);this.control=true;done();
      });
    });
  },

  showTeamChat() {
    if (this.phase!=="downtown") return;
    this.player.setVelocity(0);
    this.control=false;
    this.phase="teamChat";
    this.teamChatUI.setVisible(true);
  },

});
