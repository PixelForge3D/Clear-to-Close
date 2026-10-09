"use strict";
// offer: scene methods added onto ClearToClose (see HOW_TO_EXTEND.md).
Object.assign(ClearToClose.prototype, {

  buildOfferScene() {
    this.offerReviewUI=this.add.container(0,0).setDepth(670).setVisible(false);
    this.offerReviewUI.add(this.add.rectangle(240,135,480,270,0x07101d,.96));
    this.offerReviewUI.add(this.add.rectangle(240,132,390,207,0xf0ece5).setStrokeStyle(4,0xb8202c));
    this.offerHeading=this.add.text(240,48,"",{
      fontFamily:"monospace",fontSize:"14px",color:"#7a1e27",align:"center"
    }).setOrigin(.5,0);
    this.offerBody=this.add.text(68,83,"",{
      fontFamily:"monospace",fontSize:"10px",color:"#26343c",
      wordWrap:{width:345},lineSpacing:4
    });
    this.offerFooter=this.add.text(240,218,SCRIPT.offer.buildOfferScene_text_1,{
      fontFamily:"monospace",fontSize:"9px",color:"#7a1e27",
      backgroundColor:"#f5d66f",padding:{x:8,y:4}
    }).setOrigin(.5).setInteractive({useHandCursor:true});
    this.offerFooter.on("pointerdown",()=>{if(this.phase==="offerReview") this.advanceOfferView();});
    this.offerReviewUI.add([this.offerHeading,this.offerBody,this.offerFooter]);

    this.offerDecisionUI=this.add.container(0,0).setDepth(675).setVisible(false);
    this.offerDecisionUI.add(this.add.rectangle(240,219,402,94,0xf0ece5).setStrokeStyle(4,0xb8202c));
    this.offerDecisionHeading=this.add.text(240,185,"",{
      fontFamily:"monospace",fontSize:"14px",color:"#7a1e27"
    }).setOrigin(.5);
    this.offerDecisionBody=this.add.text(59,72,"",{
      fontFamily:"monospace",fontSize:"10px",color:"#26343c",
      wordWrap:{width:362},lineSpacing:3
    });
    this.offerChoiceRows=[0,1].map((i)=>{
      const row=this.add.text(240,208+i*24,"",{
        fontFamily:"monospace",fontSize:"10px",color:"#26343c",
        backgroundColor:"#f0ece5",padding:{x:8,y:5}
      }).setOrigin(.5).setInteractive({useHandCursor:true});
      row.on("pointerdown",()=>{
        if(this.phase!=="offerDecision") return;
        this.offerChoice=i;
        this.confirmOfferDecision();
      });
      this.offerDecisionUI.add(row);
      return row;
    });
    this.offerDecisionHint=this.add.text(240,255,SCRIPT.offer.buildOfferScene_text_2,{
      fontFamily:"monospace",fontSize:"9px",color:"#7a1e27"
    }).setOrigin(.5);
    this.offerDecisionUI.add([
      this.offerDecisionHeading,this.offerDecisionBody,this.offerDecisionHint
    ]);
  },

  guideOfferAgentInside() {
    if(this.offerStage!==0 || this.favoriteHome<0) return;
    this.control=false;
    this.player.setVelocity(0);
    this.prompt.setVisible(false);
    this.tourAgentBarrier.body.enable=false;
    const step=(x,y,duration,next)=>{
      this.tweens.add({targets:this.tourAgentBody,x,y,duration,ease:"Linear"});
      this.tweens.add({targets:this.tourAgentHead,x,y:y-23,duration,ease:"Linear"});
      this.tweens.add({targets:this.tourAgentLabel,x,y:y-40,duration,ease:"Linear",onComplete:next});
    };
    step(307,186,460,()=>step(272,186,350,()=>step(272,149,420,()=>{
      this.tourAgentPieces.forEach(o=>o.setVisible(false));
      this.offerAgentInside=true;
      this.agentInOffice=true;
      this.setOfficeAgentVisible(true);
      this.offerStage=1;
      this.control=true;
      this.objective.setPosition(18,232).setText(SCRIPT.offer.guideOfferAgentInside_text_1);
    })));
  },

  startOfferReview() {
    if(this.favoriteHome<0) return;
    const home=this.showingHouses[this.favoriteHome];
    const concerns=SCRIPT.offer.startOfferReview_concerns;
    this.offerPages=SCRIPT.offer.startOfferReview_pages(home.name, concerns[this.favoriteHome]);
    this.control=false;
    this.player.setVelocity(0);
    this.prompt.setVisible(false);
    this.say(LINES.offer.startOfferReview_1,()=>
      this.seatForOffer(()=>this.discussOfferLines([
        concerns[this.favoriteHome],
        SCRIPT.offer.startOfferReview_text_1,
        SCRIPT.offer.startOfferReview_text_2,
        SCRIPT.offer.startOfferReview_text_3,
        SCRIPT.offer.startOfferReview_text_4
      ],()=>this.showOfferDecision("payment"))));
  },

  discussOfferLines(lines,done,index=0) {
    this.phase="realtorOffice";
    this.control=false;
    if(index===lines.length) {done();return;}
    this.say(lines[index],()=>this.discussOfferLines(lines,done,index+1));
  },

  renderOfferView() {
    let heading,body,footer;
    if(this.offerView==="review") {
      [heading,body]=this.offerPages[this.offerPage];
      heading+=SCRIPT.offer.renderOfferView_text_1(this.offerPage+1, this.offerPages.length);
      footer=SCRIPT.offer.renderOfferView_text_2;
    } else if(this.offerView==="draft") {
      heading=SCRIPT.offer.renderOfferView_text_3;
      body=SCRIPT.offer.renderOfferView_text_4(this.homePreferences.favorite);
      footer=SCRIPT.offer.renderOfferView_text_5;
    } else if(this.offerView==="sent") {
      heading=SCRIPT.offer.renderOfferView_text_6;
      body=SCRIPT.offer.renderOfferView_text_7(this.homePreferences.favorite);
      footer=SCRIPT.offer.renderOfferView_text_8;
    } else {
      heading=SCRIPT.offer.renderOfferView_text_9;
      body=SCRIPT.offer.renderOfferView_text_10(this.offerClosingResult);
      footer=SCRIPT.offer.renderOfferView_text_11;
    }
    this.offerHeading.setText(heading);
    this.offerBody.setText(body);
    this.offerFooter.setText(footer);
  },

  advanceOfferView() {
    if(this.offerView==="review") {
      if(this.offerPage<this.offerPages.length-1) {
        this.offerPage++;
        this.renderOfferView();
      } else {
        this.showOfferDecision("payment");
      }
    } else if(this.offerView==="draft") {
      this.offerStage=2;
      this.offerView="sent";
      this.renderOfferView();
    } else if(this.offerView==="sent") {
      this.showOfferDecision("counter");
    } else {
      this.offerReviewUI.setVisible(false);
      this.offerStage=3;
      this.phase="realtorOffice";
      this.control=true;
      this.objective.setPosition(18,232).setText(SCRIPT.offer.advanceOfferView_text_1);
    }
  },

  showOfferDecision(mode) {
    this.offerReviewUI.setVisible(false);
    this.offerDecision=mode;
    this.offerChoice=0;
    this.phase="offerDecision";
    if(mode==="payment") {
      this.offerDecisionHeading.setText(SCRIPT.offer.showOfferDecision_text_1);
      this.offerDecisionBody.setText(
        SCRIPT.offer.showOfferDecision_text_2);
      this.offerChoiceRows[0].setText(SCRIPT.offer.showOfferDecision_text_3);
      this.offerChoiceRows[1].setText(SCRIPT.offer.showOfferDecision_text_4);
    } else if(mode==="counter") {
      this.offerDecisionHeading.setText(SCRIPT.offer.showOfferDecision_text_5);
      this.offerDecisionBody.setText(
        SCRIPT.offer.showOfferDecision_text_6);
      this.offerChoiceRows[0].setText(SCRIPT.offer.showOfferDecision_text_7);
      this.offerChoiceRows[1].setText(SCRIPT.offer.showOfferDecision_text_8);
    } else {
      this.offerDecisionHeading.setText(SCRIPT.offer.showOfferDecision_text_9);
      this.offerDecisionBody.setText(
        SCRIPT.offer.showOfferDecision_text_10);
      this.offerChoiceRows[0].setText(SCRIPT.offer.showOfferDecision_text_11);
      this.offerChoiceRows[1].setText(SCRIPT.offer.showOfferDecision_text_12);
    }
    this.offerDecisionHint.setText(SCRIPT.offer.showOfferDecision_text_13);
    this.renderOfferDecision();
    const context=this.offerDecisionBody.text;
    this.offerDecisionBody.setVisible(false);
    this.phase="realtorOffice";
    this.say(context,()=>{
      this.phase="offerDecision";
      this.offerDecisionUI.setVisible(true);
    });
  },

  renderOfferDecision() {
    this.offerChoiceRows.forEach((row,i)=>row.setBackgroundColor(
      i===this.offerChoice ? "#f5d66f" : "#f0ece5"));
  },

  confirmOfferDecision() {
    if(this.offerChoice===1 && this.offerDecision!=="response") {
      this.offerDecisionHint.setText(this.offerDecision==="payment"
        ? SCRIPT.offer.confirmOfferDecision_text_1
        : SCRIPT.offer.confirmOfferDecision_text_2);
      this.offerChoice=0;
      this.renderOfferDecision();
      return;
    }
    this.offerDecisionUI.setVisible(false);
    this.phase="realtorOffice";
    if(this.offerDecision==="response") {
      if(this.offerChoice===0) {
        this.offerClosingResult=SCRIPT.offer.confirmOfferDecision_text_3;
        this.say(LINES.offer.confirmOfferDecision_1,()=>
          this.showOfferAccepted());
      } else {
        this.offerClosingResult=SCRIPT.offer.confirmOfferDecision_text_4;
        this.say(LINES.offer.confirmOfferDecision_2,()=>
          this.say(LINES.offer.confirmOfferDecision_3,()=>
            this.showOfferAccepted()));
      }
    } else if(this.offerDecision==="payment") {
      this.say(LINES.offer.confirmOfferDecision_4,()=>
        this.say(LINES.offer.confirmOfferDecision_5,()=>
        this.say(LINES.offer.confirmOfferDecision_6,()=>{
          this.discussOfferLines([
            SCRIPT.offer.confirmOfferDecision_text_5,
            SCRIPT.offer.confirmOfferDecision_text_6,
            SCRIPT.offer.confirmOfferDecision_text_7,
            SCRIPT.offer.confirmOfferDecision_text_8
          ],()=>{this.offerStage=2;this.showOfferDecision("counter");});
        })));
    } else {
      this.say(LINES.offer.confirmOfferDecision_7,()=>
        this.say(LINES.offer.confirmOfferDecision_8,()=>
          this.showOfferDecision("response")));
    }
  },

  showOfferAccepted() {
    this.offerStage=3;
    this.discussOfferLines([
      SCRIPT.offer.showOfferAccepted_text_1,
      SCRIPT.offer.showOfferAccepted_text_2,
      SCRIPT.offer.showOfferAccepted_text_3
    ],()=>this.leaveOfferTable(()=>{}));
  },

});
