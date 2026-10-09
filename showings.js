"use strict";
// showings: scene methods added onto ClearToClose (see HOW_TO_EXTEND.md).
Object.assign(ClearToClose.prototype, {

  buildHouseHunting() {
    this.showingHouses=SCRIPT.showings.buildHouseHunting_showingHouses;
    this.showingStreetLayer=this.add.container(0,0).setVisible(false);
    const S=o=>{this.showingStreetLayer.add(o);return o;};
    S(this.add.rectangle(240,135,480,270,0x9cc4c8));
    S(this.add.rectangle(240,188,480,68,0x7b9c75));
    S(this.add.rectangle(240,212,480,30,0xcac7b9));
    S(this.add.rectangle(240,253,480,35,0x42525b));
    for(let x=30;x<480;x+=80) S(this.add.rectangle(x,252,38,2,0xe3d6ab));
    this.showingExteriors=[];
    for(let i=0;i<3;i++) {
      const layer=this.add.container(0,0).setVisible(false);
      this.showingStreetLayer.add(layer);
      const A=o=>{layer.add(o);return o;};
      if(i===0) {
        A(this.add.rectangle(240,116,224,102,0x9b7057).setStrokeStyle(3,0x3e3737));
        const roof=this.add.graphics();roof.fillStyle(0x54434a);roof.fillTriangle(116,84,364,84,240,27);
        roof.lineStyle(3,0x3e3737);roof.strokeTriangle(116,84,364,84,240,27);A(roof);
        A(this.add.rectangle(148,142,28,33,0x446879).setStrokeStyle(3,0xd6ccb4));
        A(this.add.rectangle(332,142,28,33,0x446879).setStrokeStyle(3,0xd6ccb4));
        A(this.add.rectangle(318,189,40,12,0x795139).setStrokeStyle(2,0x48352f));
        A(this.add.circle(345,178,9,0x57774e));
      } else if(i===1) {
        A(this.add.rectangle(240,101,312,132,0x8e9da6).setStrokeStyle(3,0x3f5360));
        A(this.add.rectangle(240,33,320,12,0x465e6d).setStrokeStyle(2,0x324450));
        for(const x of [120,175,305,360]) {
          A(this.add.rectangle(x,83,30,26,0x9fcad4).setStrokeStyle(3,0x526c77));
          A(this.add.rectangle(x,132,30,24,0x9fcad4).setStrokeStyle(3,0x526c77));
        }
        A(this.add.rectangle(52,169,75,30,0xe3dfc8).setStrokeStyle(3,0x546a63));
        A(this.add.text(52,168,SCRIPT.showings.buildHouseHunting_text_1,{fontFamily:"monospace",fontSize:"11px",color:"#325b60"}).setOrigin(.5));
        A(this.add.rectangle(52,193,3,20,0x546a63));
        A(this.add.rectangle(326,171,78,8,0x54717b));
      } else {
        A(this.add.rectangle(240,127,276,80,0xb6986a).setStrokeStyle(3,0x57483a));
        const roof=this.add.graphics();roof.fillStyle(0x605042);roof.fillTriangle(88,96,392,96,240,39);
        roof.lineStyle(3,0x453a34);roof.strokeTriangle(88,96,392,96,240,39);A(roof);
        for(const x of [134,345]) A(this.add.rectangle(x,128,38,27,0x9cc6cb).setStrokeStyle(3,0xe0d4b8));
        A(this.add.rectangle(375,189,72,8,0x785c40));
        A(this.add.circle(405,178,12,0x567849));
        A(this.add.circle(102,177,13,0x5c7b4f));
      }
      // Each door is flush with the base of its building and sits beneath its roof.
      A(this.add.rectangle(240,145,31,42,0x684d3c).setStrokeStyle(3,0xe9d2a0));
      A(this.add.rectangle(240,139,19,18,0xa8c6cd).setStrokeStyle(1,0x475d66));
      A(this.add.circle(250,150,2,0xf4d589));
      this.showingExteriors.push(layer);
    }
    this.showingAgentBody=S(this.add.rectangle(341,189,20,28,0xb8202c).setStrokeStyle(2,0x551e24));
    this.showingAgentHead=S(this.add.circle(341,166,10,0xc99572).setStrokeStyle(2,0x392d27));
    this.showingAgentLabel=S(this.add.text(341,149,SCRIPT.showings.buildHouseHunting_text_2,{fontFamily:"monospace",fontSize:"8px",
      color:"#fff",backgroundColor:"#7a1e27",padding:{x:3,y:2}}).setOrigin(.5));
    this.showingAgentPieces=[this.showingAgentBody,this.showingAgentHead,this.showingAgentLabel];
    this.showingCarPieces=[];
    const C=o=>{this.showingCarPieces.push(S(o));return o;};
    this.showingCar=C(this.add.rectangle(410,224,72,29,0x872d2f).setStrokeStyle(3,0x321c20));
    C(this.add.rectangle(410,216,43,15,0x263d4b).setStrokeStyle(2,0xa7bdc8));
    C(this.add.rectangle(382,225,7,12,0xc1d2d5));
    C(this.add.rectangle(438,225,7,12,0xc1d2d5));
    C(this.add.circle(389,241,7,0x20242a).setStrokeStyle(2,0x667078));
    C(this.add.circle(431,241,7,0x20242a).setStrokeStyle(2,0x667078));
    this.showingCarPieces.forEach(o=>o.setData("parkX",o.x).setData("parkY",o.y));
    const solid=(group,x,y,w,h)=>{
      const obj=this.add.rectangle(x,y,w,h,0x000000,0);
      this.physics.add.existing(obj,true);group.add(obj);return obj;
    };
    this.showingStreetBarriersByIndex=[];
    const widths=[224,312,276],tops=[65,35,87];
    for(let i=0;i<3;i++) {
      const group=this.physics.add.staticGroup();
      this.showingStreetBarriersByIndex.push(group);
      solid(group,240,12,480,24);
      solid(group,8,135,16,270);solid(group,472,135,16,270);
      solid(group,240,265,480,10);
      solid(group,240,(tops[i]+143)/2,widths[i],143-tops[i]);
      const sideWidth=widths[i]/2-16;
      solid(group,240-widths[i]/4-8,155,sideWidth,25);
      solid(group,240+widths[i]/4+8,155,sideWidth,25);
      solid(group,341,190,23,31);solid(group,410,224,72,29);
      group.children.iterate(o=>{o.body.enable=false;});
      this.physics.add.collider(this.player,group);
    }
    this.showingStreetBarriers=this.showingStreetBarriersByIndex[0];
    this.showingStreetItems=[this.showingAgentBody,this.showingCar];
    this.showingAgentBody.setData("kind","showingAgent").setData("interactionMargin",20);
    this.showingCar.setData("kind","showingCar").setData("interactionMargin",22);

    this.showingHomeLayers=[];
    this.showingHomeBarriersByIndex=[];
    this.showingHomeItemsByIndex=[];
    this.homeAgentPiecesByIndex=[];
    this.homeAgentBarriers=[];
    for(let i=0;i<3;i++) {
      const layer=this.add.container(0,0).setVisible(false);
      this.showingHomeLayers.push(layer);
      const H=o=>{layer.add(o);return o;};
      const barriers=this.physics.add.staticGroup();
      this.showingHomeBarriersByIndex.push(barriers);
      const F=(x,y,w,h,color)=>{
        H(this.add.rectangle(x,y,w,h,color).setStrokeStyle(2,0x4b4843));
        solid(barriers,x,y,w,h);
      };
      const plant=(x,y)=>{
        H(this.add.rectangle(x,y+9,17,13,0x986b49).setStrokeStyle(2,0x644a35));
        H(this.add.circle(x,y-3,11,0x628451));
        H(this.add.circle(x-6,y-7,6,0x72945c));
        solid(barriers,x,y+3,26,32);
      };
      const floor=[0xb18e70,0x9faeb1,0xbda37a][i];
      H(this.add.rectangle(240,135,452,242,floor).setStrokeStyle(5,0x33383b));
      for(let y=87;y<244;y+=24) H(this.add.rectangle(240,y,426,1,0x6b594b,.25));
      H(this.add.rectangle(240,48,430,43,[0xe1cbb0,0xe6e9e4,0xdccca9][i]));
      H(this.add.rectangle(240,70,430,3,0x665747));
      // Furnish each floor plan differently, keeping an open route from the entrance.
      let feature,bounds;
      if(i===0) {
        H(this.add.rectangle(105,93,124,32,0xddd6bf).setStrokeStyle(3,0x685849));
        solid(barriers,105,97,124,41);
        F(105,121,104,38,0x8a6046);
        H(this.add.rectangle(65,111,23,20,0x41474a));
        H(this.add.rectangle(128,110,20,16,0xb3b9af));
        H(this.add.rectangle(171,103,18,62,0xc5c8b8).setStrokeStyle(2,0x737568));
        solid(barriers,171,103,18,62);
        feature=H(this.add.rectangle(104,112,42,17,0xd5c9ad).setStrokeStyle(2,0x725940));
        bounds={x:105,y:121,w:104,h:38};
        F(354,140,84,31,0x677d77);
        H(this.add.rectangle(353,143,54,12,0xadc1b8));
        F(366,194,43,13,0x6e4e3b);
        plant(411,102);
        H(this.add.rectangle(54,189,22,26,0xa8764d));
      } else if(i===1) {
        H(this.add.rectangle(335,91,149,35,0x8cb9c4).setStrokeStyle(3,0x59747b));
        solid(barriers,335,99,149,48);
        H(this.add.rectangle(337,90,3,33,0xe4e7de));
        H(this.add.rectangle(240,171,145,75,0xb8c9c3,.6));
        F(110,126,101,33,0x476c7a);
        H(this.add.rectangle(110,121,80,15,0xaac5c7));
        feature=H(this.add.rectangle(109,131,48,14,0x7497a1).setStrokeStyle(2,0x385766));
        bounds={x:110,y:126,w:101,h:33};
        F(361,138,94,29,0xe5dfce);
        H(this.add.rectangle(352,127,45,12,0x748b8d));
        F(380,185,28,28,0x927d60);
        plant(412,170);
        H(this.add.rectangle(74,188,30,34,0x687e85));
      } else {
        H(this.add.rectangle(343,93,116,36,0x9fc5ba).setStrokeStyle(3,0x5c7765));
        solid(barriers,343,108,116,52);
        H(this.add.rectangle(343,98,96,15,0x6f9a62));
        H(this.add.circle(384,89,9,0x688755));
        feature=H(this.add.rectangle(344,113,90,20,0xd3bb8d).setStrokeStyle(2,0x6c7658));
        bounds={x:343,y:104,w:116,h:45};
        F(95,125,75,42,0x75584a);
        H(this.add.rectangle(95,119,50,19,0xc38a53));
        H(this.add.rectangle(148,177,74,46,0x927453,.5));
        F(148,177,51,24,0x725945);
        plant(410,179);
        H(this.add.rectangle(58,199,26,16,0x8e7b59));
      }
      // The agent is a character to approach, not a paper or printer prop.
      const agent=H(this.add.rectangle(241,130,20,29,0xb8202c).setStrokeStyle(2,0x551e24));
      const agentHead=H(this.add.circle(241,106,10,0xc99572).setStrokeStyle(2,0x392d27));
      const agentLabel=H(this.add.text(241,87,SCRIPT.showings.buildHouseHunting_text_3,{fontFamily:"monospace",fontSize:"8px",color:"#fff",
        backgroundColor:"#7a1e27",padding:{x:3,y:2}}).setOrigin(.5));
      this.homeAgentPiecesByIndex.push([agent,agentHead,agentLabel]);
      this.homeAgentBarriers.push(solid(barriers,241,119,30,58));
      H(this.add.rectangle(240,246,48,18,0x755843).setStrokeStyle(3,0x44392f));
      H(this.add.text(240,244,SCRIPT.showings.buildHouseHunting_text_4,{fontFamily:"monospace",fontSize:"9px",color:"#fff"}).setOrigin(.5));
      solid(barriers,240,48,430,43);
      solid(barriers,18,135,16,228);solid(barriers,462,135,16,228);
      solid(barriers,240,255,430,11);
      barriers.children.iterate(o=>{o.body.enable=false;});
      this.physics.add.collider(this.player,barriers);
      feature.setData("kind","homeClue").setData("clueIndex",0)
        .setData("interactionMargin",22).setData("interactBounds",bounds);
      agent.setData("kind","homeAgent").setData("interactionMargin",23);
      this.showingHomeItemsByIndex.push([feature,agent]);
    }
    this.showingHomeLayer=this.showingHomeLayers[0];
    this.showingHomeBarriers=this.showingHomeBarriersByIndex[0];
    this.showingHomeItems=this.showingHomeItemsByIndex[0];

    this.driveLayer=this.add.container(0,0).setDepth(450).setVisible(false);
    const D=o=>{this.driveLayer.add(o);return o;};
    D(this.add.rectangle(240,135,480,270,0x95b9c4));
    D(this.add.rectangle(240,173,480,70,0x7e9e76));
    D(this.add.rectangle(240,229,480,82,0x43535c));
    for(let x=22;x<480;x+=95) D(this.add.rectangle(x,238,49,3,0xe4d6a3));
    this.driveScenery=D(this.add.container(0,0));
    this.driveCar=D(this.add.container(232,204));
    this.driveCar.add(this.add.rectangle(0,0,111,45,0x872d2f).setStrokeStyle(3,0x321c20));
    this.driveCar.add(this.add.rectangle(0,-14,64,25,0x263d4b).setStrokeStyle(2,0xa7bdc8));
    this.driveCar.add(this.add.circle(-38,27,11,0x20242a).setStrokeStyle(3,0x69747b));
    this.driveCar.add(this.add.circle(38,27,11,0x20242a).setStrokeStyle(3,0x69747b));
    this.driveCar.add(this.add.circle(-13,-15,6,0xd2a07c));
    this.driveCar.add(this.add.circle(19,-15,6,0xd2a07c));
    this.driveCaption=D(this.add.text(240,18,"",{fontFamily:"monospace",fontSize:"11px",color:"#fff",
      backgroundColor:"#263d4bdd",padding:{x:6,y:4}}).setOrigin(.5,0));

    this.tourReadyUI=this.add.container(0,0).setDepth(660).setVisible(false);
    this.tourReadyUI.add(this.add.rectangle(240,135,480,270,0x07101d,.94));
    this.tourReadyUI.add(this.add.rectangle(240,134,356,171,0xeee9dd).setStrokeStyle(4,0xb8202c));
    this.tourReadyUI.add(this.add.text(240,73,SCRIPT.showings.buildHouseHunting_text_5,{
      fontFamily:"monospace",fontSize:"13px",color:"#7a1e27"}).setOrigin(.5));
    this.tourReadyRows=[SCRIPT.showings.buildHouseHunting_text_6,SCRIPT.showings.buildHouseHunting_text_7].map((label,i)=>{
      const row=this.add.text(240,117+i*37,label,{fontFamily:"monospace",fontSize:"12px",
        color:"#26343c",backgroundColor:"#eee9dd",padding:{x:10,y:5}}).setOrigin(.5).setInteractive();
      row.on("pointerdown",()=>{if(this.phase!=="tourReady") return;
        this.tourReadyChoice=i;this.confirmTourReady();});
      this.tourReadyUI.add(row);return row;
    });
    this.tourReadyUI.add(this.add.text(240,198,SCRIPT.showings.buildHouseHunting_text_8,{
      fontFamily:"monospace",fontSize:"9px",color:"#7a1e27"}).setOrigin(.5));

    this.showingChoiceUI=this.add.container(0,0).setDepth(660).setVisible(false);
    this.showingChoiceUI.add(this.add.rectangle(240,135,480,270,0x07101d,.96));
    this.showingChoiceUI.add(this.add.rectangle(240,132,418,218,0xeee9dd).setStrokeStyle(4,0xb8202c));
    this.showingChoiceUI.add(this.add.text(240,39,SCRIPT.showings.buildHouseHunting_text_9,{
      fontFamily:"monospace",fontSize:"13px",color:"#7a1e27"}).setOrigin(.5));
    this.showingChoiceRows=this.showingHouses.map((h,i)=>{
      const row=this.add.text(49,78+i*42,SCRIPT.showings.buildHouseHunting_text_10(i+1, h.name, h.summary),{
        fontFamily:"monospace",fontSize:"10px",color:"#26343c",lineSpacing:2,
        backgroundColor:"#eee9dd",padding:{x:5,y:3}
      }).setInteractive({useHandCursor:true});
      row.on("pointerdown",()=>{if(this.phase!=="showingChoice") return;
        this.showingChoiceIndex=i;this.chooseShowingFavorite();});
      this.showingChoiceUI.add(row);return row;
    });
    this.showingChoiceUI.add(this.add.text(240,227,SCRIPT.showings.buildHouseHunting_text_11,{
      fontFamily:"monospace",fontSize:"9px",color:"#7a1e27"}).setOrigin(.5));
  },

  positionTourAgent(x,y) {
    this.tourAgentBody.setPosition(x,y);
    this.tourAgentHead.setPosition(x,y-23);
    this.tourAgentLabel.setPosition(x,y-40);
  },

  deployAgentToCar() {
    if (this.phase!=="downtown" || this.tourAgentReady) return;
    this.control=false;this.player.setVelocity(0);
    this.positionTourAgent(272,145);
    this.tourAgentPieces.forEach(o=>o.setVisible(true));
    const step=(x,y,duration,next)=>{
      this.tweens.add({targets:this.tourAgentBody,x,y,duration,ease:"Linear"});
      this.tweens.add({targets:this.tourAgentHead,x,y:y-23,duration,ease:"Linear"});
      this.tweens.add({targets:this.tourAgentLabel,x,y:y-40,duration,ease:"Linear",onComplete:next});
    };
    step(272,186,400,()=>step(399,177,900,()=>{
      this.tourAgentReady=true;
      this.tourAgentBarrier.body.enable=true;
      this.control=true;
      this.say(LINES.showings.deployAgentToCar_1);
    }));
  },

  askTourReady() {
    if(this.realtorStage<2) return;
    if(this.favoriteHome>=0) {
      if(this.offerStage===0) {
        this.say(SCRIPT.showings.askTourReady_text_1(this.showingHouses[this.favoriteHome].name),()=>
          this.guideOfferAgentInside());
      } else if(this.offerStage===1) {
        this.say(LINES.showings.askTourReady_1);
      } else if(this.offerStage===3) {
        this.say(LINES.showings.askTourReady_2);
      }
      return;
    }
    if(!this.tourAgentReady) {
      this.say(LINES.showings.askTourReady_3);return;
    }
    this.phase="tourReady";this.player.setVelocity(0);
    this.tourReadyChoice=0;this.renderTourReady();this.prompt.setVisible(false);
    this.tourReadyUI.setVisible(true);
  },

  renderTourReady() {
    this.tourReadyRows.forEach((row,i)=>row.setBackgroundColor(
      i===this.tourReadyChoice ? "#f5d66f" : "#eee9dd"));
  },

  confirmTourReady() {
    this.tourReadyUI.setVisible(false);
    this.phase="downtown";
    if(this.tourReadyChoice===1) {
      this.control=true;
      this.say(LINES.showings.confirmTourReady_1);
    } else {
      this.currentStop=0;
      this.boardShowingCar(true);
    }
  },

  walkToCar(carX,carY,agentBody,agentHead,agentLabel,done) {
    this.control=false;this.player.setVelocity(0);this.player.body.enable=false;
    this.phase="showingBoard";this.prompt.setVisible(false);
    this.tweens.add({targets:this.player,x:carX-18,duration:440,ease:"Linear",onComplete:()=>{
      this.tweens.add({targets:this.player,y:carY-7,duration:220,ease:"Linear",onComplete:()=>{
        this.player.setVisible(false);
      }});
    }});
    this.tweens.add({targets:agentBody,x:carX+17,duration:430,ease:"Linear",onComplete:()=>{
      this.tweens.add({targets:agentBody,y:carY-7,duration:220,ease:"Linear"});
      this.tweens.add({targets:agentHead,y:carY-30,duration:220,ease:"Linear"});
      this.tweens.add({targets:agentLabel,y:carY-47,duration:220,ease:"Linear",onComplete:()=>{
        agentBody.setVisible(false);agentHead.setVisible(false);agentLabel.setVisible(false);
        this.time.delayedCall(120,done);
      }});
    }});
    this.tweens.add({targets:agentHead,x:carX+17,duration:430,ease:"Linear"});
    this.tweens.add({targets:agentLabel,x:carX+17,duration:430,ease:"Linear"});
  },

  boardShowingCar(fromDowntown=false) {
    if(fromDowntown) {
      this.tourAgentBarrier.body.enable=false;
      this.walkToCar(422,117,this.tourAgentBody,this.tourAgentHead,this.tourAgentLabel,()=>{
        let remaining=this.realtorCarPieces.length;
        this.realtorCarPieces.forEach(o=>this.tweens.add({targets:o,y:o.y+105,duration:1150,ease:"Sine.easeInOut",
          onComplete:()=>{if(--remaining===0) this.driveParkedCar(this.realtorCarPieces,()=>this.driveToShowing(0));}}));
      });
      return;
    }
    if(!this.showingVisited[this.currentStop]) {
      this.say(LINES.showings.boardShowingCar_1);return;
    }
    if(this.currentStop===2 && this.favoriteHome<0) {
      this.talkShowingAgent();return;
    }
    this.showingStreetBarriers.children.iterate(o=>{o.body.enable=false;});
    this.walkToCar(410,224,this.showingAgentBody,this.showingAgentHead,this.showingAgentLabel,()=>{
      this.driveParkedCar(this.showingCarPieces,()=>this.driveToShowing(this.currentStop<2 ? this.currentStop+1 : 3));
    });
  },

  driveParkedCar(pieces,done) {
    let remaining=pieces.length;
    pieces.forEach(o=>this.tweens.add({targets:o,x:o.x+110,duration:850,ease:"Sine.easeIn",
      onComplete:()=>{if(--remaining===0)done();}}));
  },

  setDriveLandmarks(index) {
    this.driveScenery.removeAll(true);
    const L=o=>{this.driveScenery.add(o);return o;};
    const sign=(x,label)=>{
      L(this.add.rectangle(x,140,108,36,0xe7debb).setStrokeStyle(3,0x4c6258));
      L(this.add.text(x,140,label,{fontFamily:"monospace",fontSize:"10px",
        color:"#315158",align:"center"}).setOrigin(.5));
      L(this.add.rectangle(x,174,4,31,0x4c6258));
    };
    if(index===0) {
      L(this.add.rectangle(0,126,130,92,0x798d92).setStrokeStyle(3,0x405861));
      L(this.add.text(0,108,SCRIPT.showings.setDriveLandmarks_text_1,{fontFamily:"monospace",fontSize:"12px",color:"#fff"}).setOrigin(.5));
      sign(250,SCRIPT.showings.setDriveLandmarks_text_2);
      L(this.add.circle(450,144,19,0xe5cd92));
      L(this.add.text(450,144,SCRIPT.showings.setDriveLandmarks_text_3,{fontFamily:"monospace",fontSize:"8px",color:"#473e33",align:"center"}).setOrigin(.5));
    } else if(index===1) {
      sign(0,SCRIPT.showings.setDriveLandmarks_text_4);
      L(this.add.rectangle(285,125,178,81,0x8b9fa9).setStrokeStyle(3,0x4d6570));
      L(this.add.text(285,104,SCRIPT.showings.setDriveLandmarks_text_5,{fontFamily:"monospace",fontSize:"16px",color:"#fff"}).setOrigin(.5));
      sign(515,SCRIPT.showings.setDriveLandmarks_text_6);
    } else if(index===2) {
      sign(0,SCRIPT.showings.setDriveLandmarks_text_7);
      L(this.add.circle(240,149,16,0xd9cdb4));
      L(this.add.text(240,149,SCRIPT.showings.setDriveLandmarks_text_8,{fontFamily:"monospace",fontSize:"8px",color:"#473e33"}).setOrigin(.5));
      sign(515,SCRIPT.showings.setDriveLandmarks_text_9);
    } else {
      sign(50,SCRIPT.showings.setDriveLandmarks_text_10);
      L(this.add.rectangle(340,132,125,80,0x84959a).setStrokeStyle(3,0x3b515b));
      L(this.add.rectangle(320,123,29,29,0xb4d0d4).setStrokeStyle(2,0x536f78));
      L(this.add.rectangle(360,123,29,29,0xb4d0d4).setStrokeStyle(2,0x536f78));
      sign(545,SCRIPT.showings.setDriveLandmarks_text_11);
    }
  },

  driveToShowing(index) {
    this.switchLocation(null);
    this.currentStop=index<3 ? index : 2;

    this.player.setVisible(false);this.player.body.enable=false;
    this.objective.setVisible(false);this.prompt.setVisible(false);
    this.phase="showingDrive";this.control=false;
    this.touchUI.setVisible(false);
    this.driveLayer.setVisible(true);
    this.driveCaption.setText(index===3 ? SCRIPT.showings.driveToShowing_text_1 : SCRIPT.showings.driveToShowing_text_2(index+1));
    this.setDriveLandmarks(index);
    this.driveScenery.setX(550);
    this.tweens.add({targets:this.driveCar,y:201,duration:180,yoyo:true,repeat:-1});
    this.tweens.add({targets:this.driveScenery,x:-650,duration:index===2?6500:5500,ease:"Linear",
      onComplete:()=>{
        this.tweens.killTweensOf(this.driveCar);this.driveCar.setY(204);
        this.driveLayer.setVisible(false);
        this.player.setVisible(true);this.player.body.enable=true;
        this.objective.setVisible(true);
        if(index===3) {
          this.showDowntown("showing");
          this.say(LINES.showings.driveToShowing_1);
        } else {
          this.showShowingStreet(index);
          if(index===2 && !this.showingVisited[2]) {
            this.say(LINES.showings.driveToShowing_2);
          } else if(index===0 && !this.showingIntroSeen) {
            this.showingIntroSeen=true;
            this.say(LINES.showings.driveToShowing_3);
          }
        }
      }});
  },

  showShowingStreet(index) {
    this.objective.setPosition(18,232);
    this.currentStop=index;

    this.daveBarrier.body.enable=false;

    this.showingStreetBarriers=this.showingStreetBarriersByIndex[index];
    this.switchLocation("showingStreet");

    this.showingExteriors.forEach((layer,i)=>layer.setVisible(i===index));
    this.showingCarPieces.forEach(o=>o.setPosition(o.getData("parkX"),o.getData("parkY")));
    this.showingAgentBody.setPosition(341,189).setVisible(true);
    this.showingAgentHead.setPosition(341,166).setVisible(true);
    this.showingAgentLabel.setPosition(341,149).setVisible(true);

    this.player.setPosition(365,196).setVelocity(0);

    this.touchUI.setVisible(true);
    this.near=null;this.prompt.setVisible(false);
    this.objective.setText(this.favoriteHome>=0 ? SCRIPT.showings.showShowingStreet_text_1
      : this.showingVisited[index] && index===2 ? SCRIPT.showings.showShowingStreet_text_2
      : this.showingVisited[index] ? SCRIPT.showings.showShowingStreet_text_3
      : SCRIPT.showings.showShowingStreet_text_4);
    this.phase="showingStreet";this.control=true;
  },

  walkShowingAgent(pieces,steps,onComplete) {
    const [body,head,label]=pieces;
    const headOffset=head.y-body.y, labelOffset=label.y-body.y;
    const next=index=>{
      if (index===steps.length) { if (onComplete) onComplete(); return; }
      const {x,y,duration}=steps[index];
      this.tweens.add({targets:body,x,y,duration,ease:"Linear"});
      this.tweens.add({targets:head,x,y:y+headOffset,duration,ease:"Linear"});
      this.tweens.add({targets:label,x,y:y+labelOffset,duration,ease:"Linear",
        onComplete:()=>next(index+1)});
    };
    next(0);
  },

  enterShowingHome(index) {
    if (this.phase!=="showingStreet") return;
    this.phase="showingEnter";
    this.control=false;
    this.near=null;
    this.prompt.setVisible(false);
    this.player.setVelocity(0);
    this.player.body.enable=false;
    this.showingStreetBarriers.children.iterate(o=>{o.body.enable=false;});
    this.objective.setText(SCRIPT.showings.enterShowingHome_text_1);
    this.tweens.add({targets:this.player,x:225,y:173,duration:710,ease:"Linear"});
    this.walkShowingAgent(this.showingAgentPieces,[
      {x:266,y:189,duration:520},
      {x:255,y:173,duration:190}
    ],()=>{
      this.showingAgentPieces.forEach(o=>o.setVisible(false));
      this.arriveShowingHome(index);
    });
  },

  arriveShowingHome(index) {
    this.control=false;
    this.objective.setPosition(18,232);
    this.currentHome=index;
    this.showingAgentExited[index]=false;

    this.showingHomeLayer=this.showingHomeLayers[index];
    this.showingHomeBarriers=this.showingHomeBarriersByIndex[index];
    this.showingHomeItems=this.showingHomeItemsByIndex[index];
    this.switchLocation("showingHome");

    this.homeAgentBarriers[index].body.enable=false;

    this.player.setPosition(225,211).setVelocity(0);

    const [body,head,label]=this.homeAgentPiecesByIndex[index];
    body.setPosition(265,211);
    head.setPosition(265,187);
    label.setPosition(265,168);
    this.homeAgentPiecesByIndex[index].forEach(o=>o.setVisible(true));
    this.objective.setText(this.showingVisited[index] ? SCRIPT.showings.arriveShowingHome_text_1
      : SCRIPT.showings.arriveShowingHome_text_2);
    this.near=null;this.prompt.setVisible(false);
    this.walkShowingAgent(this.homeAgentPiecesByIndex[index],[
      {x:265,y:174,duration:360},
      {x:241,y:130,duration:400}
    ],()=>{
      this.homeAgentBarriers[index].body.enable=true;
      this.player.body.enable=true;
      this.phase="showingHome";
      const invitations=SCRIPT.showings.arriveShowingHome_invitations;
      this.say(invitations[index],()=>{this.control=true;});
    });
  },

  leadShowingAgentOutside(index) {
    if (this.phase!=="showingHome" || this.showingAgentExited[index]) return;
    this.phase="showingExit";
    this.control=false;
    this.near=null;
    this.prompt.setVisible(false);
    this.player.setVelocity(0);
    this.homeAgentBarriers[index].body.enable=false;
    this.walkShowingAgent(this.homeAgentPiecesByIndex[index],[
      {x:265,y:174,duration:390},
      {x:265,y:211,duration:340},
      {x:250,y:240,duration:230}
    ],()=>{
      this.homeAgentPiecesByIndex[index].forEach(o=>o.setVisible(false));
      this.showingAgentExited[index]=true;
      this.objective.setText(SCRIPT.showings.leadShowingAgentOutside_text_1);
      this.phase="showingHome";
      this.control=true;
    });
  },

  inspectShowingClue(index) {
    const home=this.currentHome;
    const line=index===0 ? this.showingHouses[home].feature : this.showingHouses[home].agent;
    this.showingNotes[home][index]=true;
    this.say(line,()=>{
      if(this.showingNotes[home][0] && this.showingNotes[home][1] && !this.showingVisited[home]) {
        this.showingVisited[home]=true;
        this.objective.setText(SCRIPT.showings.inspectShowingClue_text_1);
        this.say(LINES.showings.inspectShowingClue_1,
          ()=>this.leadShowingAgentOutside(home));
      }
    });
  },

  talkShowingAgent() {
    if(this.currentStop===2 && this.showingVisited.every(Boolean) && this.favoriteHome<0) {
      this.showingChoiceIndex=0;this.renderShowingChoice();
      this.showingChoiceUI.setVisible(true);this.phase="showingChoice";
      this.player.setVelocity(0);this.prompt.setVisible(false);
    } else if(this.favoriteHome>=0) {
      this.say(SCRIPT.showings.talkShowingAgent_text_1(this.showingHouses[this.favoriteHome].name));
    } else if(this.showingVisited[this.currentStop]) {
      this.say(this.currentStop===1
        ? SCRIPT.showings.talkShowingAgent_text_2
        : SCRIPT.showings.talkShowingAgent_text_3);
    } else {
      this.say(LINES.showings.talkShowingAgent_1);
    }
  },

  renderShowingChoice() {
    this.showingChoiceRows.forEach((row,i)=>row.setBackgroundColor(
      i===this.showingChoiceIndex ? "#f5d66f" : "#eee9dd"));
  },

  chooseShowingFavorite() {
    this.favoriteHome=this.showingChoiceIndex;
    this.homePreferences.favorite=this.showingHouses[this.favoriteHome].name;
    this.showingChoiceUI.setVisible(false);
    this.phase="showingStreet";
    this.objective.setText(SCRIPT.showings.chooseShowingFavorite_text_1);
    this.say(SCRIPT.showings.chooseShowingFavorite_text_2(this.homePreferences.favorite));
  },

});
