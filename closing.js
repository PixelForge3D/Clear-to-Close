"use strict";
// closing: scene methods added onto ClearToClose (see HOW_TO_EXTEND.md).
Object.assign(ClearToClose.prototype, {

  buildFinalChapters() {
    this.storyUI=this.add.container(0,0).setDepth(670).setVisible(false);
    this.storyUI.add(this.add.rectangle(240,135,480,270,0x07101d,.96));
    this.storyUI.add(this.add.rectangle(240,132,392,208,0xe9e3d0)
      .setStrokeStyle(4,0x668298));
    this.storyHeading=this.add.text(240,47,"",{
      fontFamily:"monospace",fontSize:"14px",color:"#19384a",align:"center"
    }).setOrigin(.5);
    this.storyBody=this.add.text(69,80,"",{
      fontFamily:"monospace",fontSize:"10px",color:"#19384a",
      wordWrap:{width:342},lineSpacing:5
    });
    this.storyFooter=this.add.text(240,218,SCRIPT.closing.buildFinalChapters_text_1,{
      fontFamily:"monospace",fontSize:"9px",color:"#19384a",
      backgroundColor:"#f5d66f",padding:{x:8,y:4}
    }).setOrigin(.5).setInteractive({useHandCursor:true});
    this.storyFooter.on("pointerdown",()=>{
      if(this.phase==="storyCard") this.advanceStoryCard();
    });
    this.storyUI.add([this.storyHeading,this.storyBody,this.storyFooter]);

    this.conditionUI=this.add.container(0,0).setDepth(675).setVisible(false);
    this.conditionUI.add(this.add.rectangle(240,135,480,270,0x07101d,.96));
    this.conditionUI.add(this.add.rectangle(240,132,390,206,0xe9e3d0)
      .setStrokeStyle(4,0x668298));
    this.conditionUI.add(this.add.text(240,47,SCRIPT.closing.buildFinalChapters_text_2,{
      fontFamily:"monospace",fontSize:"14px",color:"#19384a"
    }).setOrigin(.5));
    this.conditionUI.add(this.add.text(68,75,SCRIPT.closing.buildFinalChapters_text_3,{
      fontFamily:"monospace",fontSize:"10px",color:"#19384a"
    }));
    this.conditionRows=[0,1,2].map(i=>{
      const row=this.add.text(79,103+i*37,"",{
        fontFamily:"monospace",fontSize:"10px",color:"#19384a",
        backgroundColor:"#e9e3d0",padding:{x:7,y:5}
      }).setInteractive({useHandCursor:true});
      row.on("pointerdown",()=>{
        if(this.phase!=="conditionMenu") return;
        this.conditionChoice=i;
        this.chooseConditionItem();
      });
      this.conditionUI.add(row);
      return row;
    });
    this.conditionHint=this.add.text(240,220,SCRIPT.closing.buildFinalChapters_text_4,{
      fontFamily:"monospace",fontSize:"9px",color:"#19384a"
    }).setOrigin(.5);
    this.conditionUI.add(this.conditionHint);

    this.clearCelebrationUI=this.add.container(0,0).setDepth(185).setVisible(false);
    this.clearCelebrationBits=[];
    this.clearCelebrationTweens=[];
    const confettiColors=[0xf5d66f,0x8bd5e4,0xef8491,0xa8df8a,0xffffff];
    for(let i=0;i<36;i++) {
      const bit=this.add.rectangle(16+(i*73)%448,-12-(i*17)%110,
        i%3===0 ? 6 : 4,7,confettiColors[i%confettiColors.length]);
      this.clearCelebrationUI.add(bit);
      this.clearCelebrationBits.push(bit);
    }
    this.clearCelebrationUI.add(this.add.rectangle(240,38,234,31,0x173247,.95)
      .setStrokeStyle(2,0xf5d66f));
    this.clearCelebrationUI.add(this.add.text(240,38,SCRIPT.closing.buildFinalChapters_text_5,{
      fontFamily:"monospace",fontSize:"17px",color:"#f5d66f",
      stroke:"#173247",strokeThickness:2
    }).setOrigin(.5));
    this.printerCaption=this.add.text(240,161,"",{
      fontFamily:"monospace",fontSize:"9px",color:"#f5d66f",
      backgroundColor:"#173247",padding:{x:7,y:4}
    }).setOrigin(.5).setDepth(205).setVisible(false);

    // Keep the route label above the parked car and away from the action button.
    this.closingArrow=this.add.text(463,146,SCRIPT.closing.buildFinalChapters_text_6,{
      fontFamily:"monospace",fontSize:"8px",color:"#f5d66f",
      backgroundColor:"#173247cc",padding:{x:4,y:3}
    }).setOrigin(1,.5).setVisible(false);
    this.downtownLayer.add(this.closingArrow);

    this.closingStreetLayer=this.add.container(0,0).setVisible(false);
    const S=o=>{this.closingStreetLayer.add(o);return o;};
    S(this.add.rectangle(240,135,480,270,0x91b7c4));
    S(this.add.rectangle(240,225,480,90,0x374550));
    S(this.add.rectangle(240,178,480,54,0xb8b6aa));
    S(this.add.rectangle(240,206,480,3,0xe9d4a3));
    for(let x=20;x<480;x+=58) S(this.add.rectangle(x,229,30,2,0xe9d4a3));
    S(this.add.rectangle(240,96,220,110,0x7c8e98).setStrokeStyle(4,0x354853));
    S(this.add.rectangle(240,45,224,28,0x31556b));
    S(this.add.text(240,44,SCRIPT.closing.buildFinalChapters_text_7,{
      fontFamily:"monospace",fontSize:"13px",color:"#ffffff"
    }).setOrigin(.5));
    for(const x of [172,308]) S(this.add.rectangle(x,97,34,36,0xafd0d9)
      .setStrokeStyle(3,0x435e6b));
    S(this.add.rectangle(240,130,33,42,0x5b3d2d).setStrokeStyle(3,0xe5d6a9));
    S(this.add.circle(250,135,2,0xf3de97));
    S(this.add.text(18,190,SCRIPT.closing.buildFinalChapters_text_8,{
      fontFamily:"monospace",fontSize:"8px",color:"#f5d66f",
      backgroundColor:"#173247cc",padding:{x:4,y:3}
    }).setOrigin(0,.5));

    const solid=(group,x,y,w,h)=>{
      const r=this.add.rectangle(x,y,w,h,0x000000,0);
      this.physics.add.existing(r,true);
      group.add(r);
      return r;
    };
    this.closingStreetBarriers=this.physics.add.staticGroup();
    solid(this.closingStreetBarriers,240,10,480,20);
    solid(this.closingStreetBarriers,8,135,16,270);
    solid(this.closingStreetBarriers,472,135,16,270);
    solid(this.closingStreetBarriers,240,264,480,12);
    solid(this.closingStreetBarriers,240,93,220,100);
    solid(this.closingStreetBarriers,176,151,94,26);
    solid(this.closingStreetBarriers,304,151,94,26);
    this.closingStreetBarriers.children.iterate(o=>{o.body.enable=false;});
    this.physics.add.collider(this.player,this.closingStreetBarriers);

    this.closingRoomLayer=this.add.container(0,0).setVisible(false);
    const R=o=>{this.closingRoomLayer.add(o);return o;};
    R(this.add.rectangle(240,135,452,242,0xd7cfbf).setStrokeStyle(5,0x202933));
    R(this.add.rectangle(240,48,430,43,0xf0ece5));
    R(this.add.rectangle(240,70,430,4,0x466579));
    for(let y=89;y<250;y+=27) R(this.add.rectangle(240,y,428,1,0xb8aa97,.4));
    R(this.add.rectangle(240,137,148,42,0x795238).setStrokeStyle(3,0x362b2a));
    this.closingPapers=R(this.add.rectangle(240,127,54,23,0xf3efdc)
      .setStrokeStyle(2,0x81959e));
    R(this.add.rectangle(240,124,33,2,0x81959e));
    R(this.add.rectangle(240,131,35,2,0x81959e));
    this.closingHost=R(this.add.rectangle(240,99,21,29,0x31556b)
      .setStrokeStyle(2,0x203c4d));
    R(this.add.circle(240,76,10,0xc99572).setStrokeStyle(2,0x392d27));
    R(this.add.text(240,56,SCRIPT.closing.buildFinalChapters_text_9,{
      fontFamily:"monospace",fontSize:"8px",color:"#fff",
      backgroundColor:"#31556bcc",padding:{x:3,y:2}
    }).setOrigin(.5));
    this.closingAgent=R(this.add.rectangle(95,133,19,28,0xb8202c).setStrokeStyle(2,0x551e24));
    R(this.add.circle(95,110,10,0xc99572).setStrokeStyle(2,0x392d27));
    R(this.add.text(95,88,SCRIPT.closing.buildFinalChapters_text_10,{
      fontFamily:"monospace",fontSize:"8px",color:"#fff",
      backgroundColor:"#7a1e27",padding:{x:3,y:2}
    }).setOrigin(.5));
    this.closingOfficer=R(this.add.rectangle(385,133,21,29,0x235a82)
      .setStrokeStyle(2,0x163347));
    R(this.add.circle(385,110,10,0xc99572).setStrokeStyle(2,0x392d27));
    R(this.add.text(385,88,SCRIPT.closing.buildFinalChapters_text_11,{
      fontFamily:"monospace",fontSize:"8px",color:"#fff",
      backgroundColor:"#173247bb",padding:{x:3,y:2}
    }).setOrigin(.5));
    R(this.add.rectangle(240,245,48,18,0x5b3d2d).setStrokeStyle(3,0xd3b88b));
    R(this.add.text(240,243,SCRIPT.closing.buildFinalChapters_text_12,{
      fontFamily:"monospace",fontSize:"9px",color:"#fff"
    }).setOrigin(.5));
    this.closingRoomBarriers=this.physics.add.staticGroup();
    solid(this.closingRoomBarriers,240,48,430,43);
    solid(this.closingRoomBarriers,18,135,16,228);
    solid(this.closingRoomBarriers,462,135,16,228);
    solid(this.closingRoomBarriers,240,254,430,12);
    solid(this.closingRoomBarriers,240,137,148,42);
    solid(this.closingRoomBarriers,240,99,24,39);
    solid(this.closingRoomBarriers,95,133,24,35);
    solid(this.closingRoomBarriers,385,133,24,35);
    this.closingRoomBarriers.children.iterate(o=>{o.body.enable=false;});
    this.physics.add.collider(this.player,this.closingRoomBarriers);
    this.closingPapers.setData("kind","closingPapers")
      .setData("interactBounds",{x:240,y:137,w:148,h:42})
      .setData("interactionMargin",24);
    this.closingHost.setData("kind","closingHost")
      .setData("interactBounds",{x:240,y:99,w:24,h:39})
      .setData("interactionMargin",20);
    this.closingOfficer.setData("kind","closingOfficer")
      .setData("interactionMargin",22);
    this.closingAgent.setData("kind","closingAgent").setData("interactionMargin",22);
    this.closingRoomItems=[this.closingPapers,this.closingHost,this.closingOfficer,this.closingAgent];

    this.closingCelebrationUI=this.add.container(0,0).setDepth(185).setVisible(false);
    this.closingCelebrationBits=[];
    this.closingCelebrationTweens=[];
    for(let i=0;i<34;i++) {
      const bit=this.add.rectangle(16+(i*83)%448,-10-(i*23)%105,
        i%3===0 ? 6 : 4,7,confettiColors[i%confettiColors.length]);
      this.closingCelebrationUI.add(bit);
      this.closingCelebrationBits.push(bit);
    }
    this.closingCelebrationUI.add(this.add.rectangle(240,32,190,30,0x173247,.95)
      .setStrokeStyle(2,0xf5d66f));
    this.closingCelebrationUI.add(this.add.text(240,32,SCRIPT.closing.buildFinalChapters_text_13,{
      fontFamily:"monospace",fontSize:"17px",color:"#f5d66f",
      stroke:"#173247",strokeThickness:2
    }).setOrigin(.5));

    this.homeownerUI=this.add.container(0,0).setDepth(950).setVisible(false);
    const H=o=>{this.homeownerUI.add(o);return o;};
    H(this.add.rectangle(240,135,480,270,0x0a2134));
    H(this.add.rectangle(240,202,480,136,0x426f55));
    H(this.add.rectangle(240,151,166,83,0xe7d5ad).setStrokeStyle(4,0x6d5948));
    // Draw the roof after the facade so the eaves visibly sit in front of it.
    const roof=this.add.graphics();
    roof.fillStyle(0xa3463c);roof.fillTriangle(136,119,344,119,240,59);
    roof.lineStyle(3,0x6c2d2a);roof.strokeTriangle(136,119,344,119,240,59);
    H(roof);
    H(this.add.rectangle(240,119,211,5,0x6c2d2a));
    H(this.add.rectangle(240,171,30,43,0x70533f).setStrokeStyle(2,0x332820));
    for(const x of [188,292]) H(this.add.rectangle(x,145,29,25,0x92c6d4)
      .setStrokeStyle(3,0x526c77));
    this.homeownerConfetti=[];
    this.homeownerTweens=[];
    for(let i=0;i<32;i++) {
      const bit=H(this.add.rectangle(240,108,i%3===0 ? 6 : 4,7,
        confettiColors[(i+2)%confettiColors.length]).setVisible(false));
      this.homeownerConfetti.push(bit);
    }
    H(this.add.text(240,22,SCRIPT.closing.buildFinalChapters_text_14,{
      fontFamily:"monospace",fontSize:"21px",color:"#f5d66f",
      stroke:"#173247",strokeThickness:4
    }).setOrigin(.5));
    this.homeownerLabel=H(this.add.text(240,211,SCRIPT.closing.buildFinalChapters_text_15,{
      fontFamily:"monospace",fontSize:"18px",color:"#fff",
      stroke:"#173247",strokeThickness:4
    }).setOrigin(.5));
    this.homeownerHome=H(this.add.text(240,234,"",{
      fontFamily:"monospace",fontSize:"9px",color:"#f5d66f"
    }).setOrigin(.5));
    this.homeownerRestart=H(this.add.text(240,254,SCRIPT.closing.buildFinalChapters_text_16,{
      fontFamily:"monospace",fontSize:"9px",color:"#fff",
      backgroundColor:"#173247",padding:{x:6,y:2}
    }).setOrigin(.5).setInteractive({useHandCursor:true}));
    this.homeownerRestart.on("pointerdown",()=>{
      if(this.phase==="homeowner") window.location.reload();
    });
  },

  lateQuestObjective(place) {
    if(this.closingStage>=2) {
      if(place==="closingStreet") return SCRIPT.closing.lateQuestObjective_text_1;
      if(place==="closingRoom") return SCRIPT.closing.lateQuestObjective_text_2;
      return SCRIPT.closing.lateQuestObjective_text_3;
    }
    if(this.closingStage===1) return place==="office"
      ? SCRIPT.closing.lateQuestObjective_text_4
      : SCRIPT.closing.lateQuestObjective_text_5;
    if(this.underwritingStage===5) return place==="office"
      ? SCRIPT.closing.lateQuestObjective_text_6
      : SCRIPT.closing.lateQuestObjective_text_7;
    if(this.underwritingStage===4) return place==="office"
      ? SCRIPT.closing.lateQuestObjective_text_8
      : SCRIPT.closing.lateQuestObjective_text_9;
    if(this.underwritingStage===3) return SCRIPT.closing.lateQuestObjective_text_10;
    if(this.underwritingStage===2) return place==="apartment"
      ? SCRIPT.closing.lateQuestObjective_text_11(Object.values(this.underwritingDocs).filter(Boolean).length)
      : SCRIPT.closing.lateQuestObjective_text_12;
    if(this.underwritingStage===1) return place==="office"
      ? SCRIPT.closing.lateQuestObjective_text_13
      : SCRIPT.closing.lateQuestObjective_text_14;
    if(this.offerStage===3 && !this.inspectionDone) return place==="realtorOffice"
      ? SCRIPT.closing.lateQuestObjective_text_15
      : SCRIPT.closing.lateQuestObjective_text_16;
    if(this.offerStage===3) return SCRIPT.closing.lateQuestObjective_text_17;
    if(this.offerStage===1) return SCRIPT.closing.lateQuestObjective_text_18;
    return this.favoriteHome>=0
      ? SCRIPT.closing.lateQuestObjective_text_19
      : SCRIPT.closing.lateQuestObjective_text_20;
  },

  showStoryCards(pages,done,lastLabel=SCRIPT.closing.showStoryCards_text_1) {
    this.storyPages=pages;
    this.storyPage=0;
    this.storyReturnPhase=this.phase;
    this.storyDone=done;
    this.storyLastLabel=lastLabel;
    this.phase="storyCard";
    this.control=false;
    this.player.setVelocity(0);
    this.prompt.setVisible(false);
    this.renderStoryCard();
    this.storyUI.setVisible(true);
  },

  renderStoryCard() {
    const [heading,body]=this.storyPages[this.storyPage];
    this.storyHeading.setText(SCRIPT.closing.renderStoryCard_text_1(heading, this.storyPage+1, this.storyPages.length));
    this.storyBody.setText(body);
    this.storyFooter.setText(this.storyPage===this.storyPages.length-1
      ? this.storyLastLabel : SCRIPT.closing.renderStoryCard_text_2);
  },

  advanceStoryCard() {
    if(this.storyPage<this.storyPages.length-1) {
      this.storyPage++;
      this.renderStoryCard();
      return;
    }
    this.storyUI.setVisible(false);
    this.phase=this.storyReturnPhase;
    this.control=true;
    const done=this.storyDone;
    this.storyDone=null;
    if(done) done();
  },

  reviewInspection() {
    const notes=SCRIPT.closing.reviewInspection_notes;
    this.showStoryCards(SCRIPT.closing.reviewInspection_pages(this.homePreferences.favorite, notes[this.favoriteHome]),()=>{
      this.inspectionDone=true;
      this.objective.setPosition(18,232).setText(this.lateQuestObjective("realtorOffice"));
      this.say(LINES.closing.reviewInspection_1);
    },SCRIPT.closing.reviewInspection_text_1);
  },

  talkUnderwriting() {
    if(this.underwritingStage===0) {
      this.say(LINES.closing.talkUnderwriting_1,()=>
        this.say(LINES.closing.talkUnderwriting_2,()=>{
          this.offerBriefed=true;
          this.printStoryDocument(this.requestPaper,SCRIPT.closing.talkUnderwriting_text_1,()=>{
            this.underwritingStage=1;
            this.objective.setText(this.lateQuestObjective("office"));
          },SCRIPT.closing.talkUnderwriting_text_2);
        }));
    } else if(this.underwritingStage===1) {
      this.say(LINES.closing.talkUnderwriting_3);
    } else if(this.underwritingStage===2) {
      this.say(LINES.closing.talkUnderwriting_4);
    } else if(this.underwritingStage===3) {
      this.say(LINES.closing.talkUnderwriting_5,()=>{
        this.printStoryDocument(this.appraisalPaper,SCRIPT.closing.talkUnderwriting_text_3,()=>{
          this.underwritingStage=4;
          this.objective.setText(this.lateQuestObjective("office"));
          this.say(LINES.closing.talkUnderwriting_6);
        });
      });
    } else if(this.underwritingStage===4) {
      this.say(LINES.closing.talkUnderwriting_7);
    } else if(this.underwritingStage===5) {
      this.say(LINES.closing.talkUnderwriting_8,()=>{
        this.say(LINES.closing.talkUnderwriting_9,()=>{
          this.underwritingStage=6;
          this.closingStage=1;
          this.printStoryDocument(this.disclosurePaper,SCRIPT.closing.talkUnderwriting_text_4,()=>{
            this.objective.setText(this.lateQuestObjective("office"));
            this.say(LINES.closing.talkUnderwriting_10);
          });
        });
        this.startClearToCloseCelebration();
      });
    } else if(this.closingStage===1) {
      this.say(LINES.closing.talkUnderwriting_11);
    } else {
      this.say(LINES.closing.talkUnderwriting_12);
    }
  },

  readUnderwritingRequest() {
    this.showStoryCards(SCRIPT.closing.readUnderwritingRequest_pages,()=>{
      this.underwritingStage=2;
      this.requestPaper.setVisible(false);
      this.objective.setPosition(18,232).setText(this.lateQuestObjective("office"));
      this.say(LINES.closing.readUnderwritingRequest_1);
    },SCRIPT.closing.readUnderwritingRequest_text_1);
  },

  showConditionMenu() {
    this.phase="conditionMenu";
    this.control=false;
    this.player.setVelocity(0);
    this.conditionChoice=this.underwritingDocs.deposit ? 1 : 0;
    this.conditionHint.setText(SCRIPT.closing.showConditionMenu_text_1);
    this.renderConditionMenu();
    this.conditionUI.setVisible(true);
  },

  renderConditionMenu() {
    const labels=[
      SCRIPT.closing.renderConditionMenu_text_1(this.underwritingDocs.deposit ? "[x]" : "[ ]"),
      SCRIPT.closing.renderConditionMenu_text_2(this.underwritingDocs.insurance ? "[x]" : "[ ]"),
      SCRIPT.closing.renderConditionMenu_text_3
    ];
    this.conditionRows.forEach((row,i)=>{
      row.setText(labels[i]).setBackgroundColor(
        i===this.conditionChoice ? "#f5d66f" : "#e9e3d0");
    });
  },

  chooseConditionItem() {
    if(this.conditionChoice===2) {
      this.conditionUI.setVisible(false);
      this.phase="apartment3";
      this.standFromComputer();
      return;
    }
    const key=this.conditionChoice===0 ? "deposit" : "insurance";
    if(this.underwritingDocs[key]) {
      this.conditionHint.setText(SCRIPT.closing.chooseConditionItem_text_1);
      return;
    }
    this.underwritingDocs[key]=true;
    this.conditionUI.setVisible(false);
    this.phase="apartment3";
    this.standFromComputer();
    if(Object.values(this.underwritingDocs).every(Boolean)) this.underwritingStage=3;
    this.objective.setPosition(18,232).setText(this.lateQuestObjective("apartment"));
    const line=key==="deposit"
      ? SCRIPT.closing.chooseConditionItem_text_2
      : SCRIPT.closing.chooseConditionItem_text_3;
    this.say(line,()=>{
      if(this.underwritingStage===3) this.say(LINES.closing.chooseConditionItem_1);
    });
  },

  readAppraisal() {
    this.showStoryCards(SCRIPT.closing.readAppraisal_pages,()=>{
      this.underwritingStage=5;
      this.appraisalPaper.setVisible(false);
      this.objective.setPosition(18,232).setText(this.lateQuestObjective("office"));
    },SCRIPT.closing.readAppraisal_text_1);
  },

  readClosingDisclosure() {
    this.showStoryCards(SCRIPT.closing.readClosingDisclosure_pages,()=>{
      this.closingStage=2;
      this.disclosurePaper.setVisible(false);
      this.agentInOffice=false;
      this.setOfficeAgentVisible(false);
      this.closingArrow.setVisible(true);
      this.objective.setPosition(18,232).setText(this.lateQuestObjective("office"));
      this.say(LINES.closing.readClosingDisclosure_1);
    },SCRIPT.closing.readClosingDisclosure_text_1);
  },

  showClosingStreet(from="downtown") {
    this.switchLocation("closingStreet");

    this.player.setPosition(from==="room" ? 240 : 35,from==="room" ? 177 : 194)
      .setVelocity(0);

    this.touchUI.setVisible(true);
    this.near=null;this.prompt.setVisible(false);
    this.objective.setVisible(true).setPosition(18,232)
      .setText(this.lateQuestObjective("closingStreet"));
    this.phase="closingStreet";
    this.control=true;
  },

  enterClosingRoom() {
    this.switchLocation("closingRoom");

    this.player.setPosition(240,213).setVelocity(0);

    this.near=null;this.prompt.setVisible(false);
    this.objective.setPosition(18,232).setText(this.lateQuestObjective("closingRoom"));
    this.phase="closingRoom";
    this.control=true;
    if(!this.closingAgentGreeted) {
      this.closingAgentGreeted=true;
      this.control=false;
      this.say(LINES.closing.enterClosingRoom_1,()=>{this.control=true;});
    }
  },

  reviewClosingDay() {
    if(this.closingStage!==2) return;
    this.showStoryCards(SCRIPT.closing.reviewClosingDay_pages,()=>{
      this.closingStage=3;
      this.startClosingCelebration();
      this.say(LINES.closing.reviewClosingDay_1,()=>
        this.say(LINES.closing.reviewClosingDay_2,()=>
          this.say(LINES.closing.reviewClosingDay_3,()=>
            this.say(LINES.closing.reviewClosingDay_4,()=>this.showHomeownerScreen()))));
    },SCRIPT.closing.reviewClosingDay_text_1);
  },

  showHomeownerScreen() {
    this.stopClosingCelebration();
    this.closingStage=4;
    this.phase="homeowner";
    this.control=false;
    this.player.setVelocity(0);
    this.prompt.setVisible(false);
    this.objective.setVisible(false);
    this.touchUI.setVisible(false);
    this.homeownerHome.setText(SCRIPT.closing.showHomeownerScreen_text_1(this.homePreferences.favorite || "YOUR NEW HOME"));
    this.homeownerUI.setVisible(true);
    this.homeownerConfetti.forEach((bit,i)=>{
      bit.setVisible(true).setAlpha(1).setPosition(240,108);
      const angle=(i*137.5)*Math.PI/180;
      const spread=85+(i*31)%170;
      this.homeownerTweens.push(this.tweens.add({
        targets:bit,
        x:240+Math.cos(angle)*spread,
        y:108+Math.sin(angle)*spread*.65+58,
        angle:i%2 ? 260 : -260,
        alpha:0,
        duration:1500+(i%5)*110,
        delay:(i%4)*65,
        ease:"Cubic.easeOut",
        repeat:-1,
        repeatDelay:550
      }));
    });
    this.homeownerTweens.push(this.tweens.add({
      targets:this.homeownerLabel,scale:1.1,duration:620,yoyo:true,repeat:-1,
      ease:"Sine.easeInOut"
    }));
  },

  startClosingCelebration() {
    this.stopClosingCelebration();
    this.phase="closingCelebration";
    this.control=false;
    this.near=null;
    this.player.setVelocity(0);
    this.prompt.setVisible(false);
    this.objective.setVisible(false);
    this.closingCelebrationUI.setVisible(true);
    this.closingCelebrationBits.forEach((bit,i)=>{
      bit.setPosition(16+(i*83)%448,-10-(i*23)%105).setAlpha(1);
      this.closingCelebrationTweens.push(this.tweens.add({targets:bit,
        x:bit.x+(i%2 ? 25 : -25),y:285,angle:i%2 ? 220 : -220,
        duration:1200+(i%7)*160,delay:(i%5)*85,repeat:-1,ease:"Linear"}));
    });
  },

  stopClosingCelebration() {
    this.closingCelebrationTweens.forEach(tween=>tween.stop());
    this.closingCelebrationTweens=[];
    this.closingCelebrationUI.setVisible(false);
  },

  startClearToCloseCelebration() {
    this.stopClearToCloseCelebration();
    this.clearCelebrationUI.setVisible(true);
    this.clearCelebrationBits.forEach((bit,i)=>{
      bit.setPosition(16+(i*73)%448,-12-(i*17)%110).setAlpha(1);
      this.clearCelebrationTweens.push(this.tweens.add({
        targets:bit,
        x:bit.x+(i%2 ? 21 : -21),y:285,angle:i%2 ? 220 : -220,
        duration:1250+(i%7)*170,delay:(i%6)*95,repeat:-1,
        ease:"Linear"
      }));
    });
  },

  stopClearToCloseCelebration() {
    this.clearCelebrationTweens.forEach(tween=>tween.stop());
    this.clearCelebrationTweens=[];
    this.clearCelebrationUI.setVisible(false);
  },

});
