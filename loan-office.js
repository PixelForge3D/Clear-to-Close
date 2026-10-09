"use strict";
// loan-office: scene methods added onto ClearToClose (see HOW_TO_EXTEND.md).
Object.assign(ClearToClose.prototype, {

  buildOffice() {
    this.officeLayer = this.add.container(0,0).setVisible(false);
    const A = obj => { this.officeLayer.add(obj); return obj; };
    A(this.add.rectangle(240,135,452,242,0x324b5a).setStrokeStyle(5,0x0a1925));
    A(this.add.rectangle(240,49,430,43,0xb3c5c7));
    A(this.add.rectangle(240,70,430,3,0x48616d));
    for (let x=40;x<450;x+=38) A(this.add.rectangle(x,167,2,172,0x3e5967,.35));
    A(this.add.rectangle(240,173,428,2,0x3e5967,.35));

    this.boardPanel = A(this.add.rectangle(104,112,134,86,0xe6e0c8)
      .setStrokeStyle(5,0x566775).setVisible(false));
    this.boardTitle = A(this.add.text(43,72,SCRIPT.loan_office.buildOffice_text_1,{
      fontFamily:"monospace",fontSize:"11px",color:"#1d3646"
    }).setVisible(false));
    this.board = A(this.add.text(51,93,SCRIPT.loan_office.buildOffice_text_2,{
      fontFamily:"monospace",fontSize:"10px",color:"#24475a",lineSpacing:8
    }).setVisible(false));

    // Assistant is normally offstage. The LO calls them in to physically deliver the whiteboard.
    this.assistantBody = A(this.add.rectangle(-24,138,20,30,0x5d6d78).setStrokeStyle(2,0x293843).setVisible(false));
    this.assistantHead = A(this.add.circle(-24,119,10,0xd2a07c).setStrokeStyle(2,0x49352c).setVisible(false));
    this.assistantLabel = A(this.add.text(-24,98,SCRIPT.loan_office.buildOffice_text_3,{
      fontFamily:"monospace",fontSize:"7px",color:"#fff",backgroundColor:"#3b4f5acc",padding:{x:2,y:1}
    }).setOrigin(.5).setVisible(false));

    A(this.add.rectangle(253,153,120,31,0x795238).setStrokeStyle(3,0x362b2a));
    A(this.add.rectangle(253,146,44,8,0xa5b3bd));
    this.officer = A(this.add.rectangle(253,110,22,33,0x235a82).setStrokeStyle(2,0x163347));
    this.officer.setData("interactBounds",{x:253,y:153,w:120,h:31});
    A(this.add.circle(253,91,11,0xc99572).setStrokeStyle(2,0x392d27));
    A(this.add.text(253,67,SCRIPT.loan_office.buildOffice_text_4,{
      fontFamily:"monospace",fontSize:"8px",color:"#fff",
      backgroundColor:"#173247bb",padding:{x:3,y:2}
    }).setOrigin(.5));

    this.qualificationPapers=[224,251,278].map((x,i)=>
      A(this.add.rectangle(x,147,14,18,[0xf3efdc,0xe8e2d2,0xfaf4e8][i])
        .setStrokeStyle(1,0x617888).setVisible(false)));
    this.qualificationStatus=this.add.text(240,24,"",{
      fontFamily:"monospace",fontSize:"10px",color:"#f5d66f",
      backgroundColor:"#173247dd",padding:{x:7,y:4}
    }).setOrigin(.5).setDepth(180).setVisible(false);

    A(this.add.rectangle(399,137,60,46,0x758690).setStrokeStyle(3,0x293843));
    this.printer = A(this.add.rectangle(399,122,44,21,0xbfcbd0).setStrokeStyle(2,0x41525d));
    this.printer.setData("interactBounds",{x:399,y:137,w:60,h:46});
    A(this.add.rectangle(399,110,31,5,0x243746));
    // Separate sheets for the early document checklist and the later preapproval letter.
    // Keeping them separate lets the printer visibly produce each item at the right story beat.
    this.checklistPaper = A(this.add.rectangle(399,104,30,17,0xf3efdc)
      .setStrokeStyle(2,0x617888).setVisible(false));
    this.preapprovalPaper = A(this.add.rectangle(399,104,28,15,0xf3efdc)
      .setStrokeStyle(2,0x617888).setVisible(false));
    this.requestPaper = A(this.add.rectangle(399,104,30,17,0xf3efdc)
      .setStrokeStyle(2,0x617888).setVisible(false));
    this.appraisalPaper = A(this.add.rectangle(399,104,30,17,0xf3efdc)
      .setStrokeStyle(2,0x617888).setVisible(false));
    this.disclosurePaper = A(this.add.rectangle(399,104,30,17,0xf3efdc)
      .setStrokeStyle(2,0x617888).setVisible(false));
    this.printerGlow = A(this.add.rectangle(399,122,54,31,0x000000,0)
      .setStrokeStyle(3,0xf5d66f).setVisible(false));
    this.officeDoor = A(this.add.rectangle(240,245,48,18,0x684b37).setStrokeStyle(3,0xd3b88b));
    A(this.add.text(240,243,SCRIPT.loan_office.buildOffice_text_5,{
      fontFamily:"monospace",fontSize:"9px",color:"#fff"
    }).setOrigin(.5));

    this.officeBarriers = this.physics.add.staticGroup();
    const solid = (x,y,w,h) => {
      const r = this.add.rectangle(x,y,w,h,0x000000,0);
      this.physics.add.existing(r,true);
      this.officeBarriers.add(r);
      return r;
    };
    solid(240,48,430,43); solid(18,135,16,228); solid(462,135,16,228);
    solid(240,254,430,12);
    this.boardBarrier = solid(104,112,134,86);
    solid(253,153,120,31);
    solid(253,108,22,34); solid(399,137,60,46);
    this.officeBarriers.children.iterate(obj=>{obj.body.enable=false;});
    this.physics.add.collider(this.player,this.officeBarriers);

    this.officeItems = [];
    const interact = (obj,radius,kind,text) => {
      obj.setData("radius",radius).setData("kind",kind).setData("text",text);
      this.officeItems.push(obj);
    };
    interact(this.officer,74,"officer",SCRIPT.loan_office.buildOffice_text_6);
    interact(this.boardPanel,92,"board",SCRIPT.loan_office.buildOffice_text_7);
    interact(this.printer,61,"printer",SCRIPT.loan_office.buildOffice_text_8);
    interact(this.officeDoor,47,"officeDoor",SCRIPT.loan_office.buildOffice_text_9);

    this.loanBoard = this.add.container(0,0).setDepth(600).setVisible(false);
    this.loanBoard.add(this.add.rectangle(240,135,480,270,0x061322,.92));
    this.loanBoard.add(this.add.rectangle(240,130,360,192,0xe9e3d0).setStrokeStyle(5,0x668298));
    this.loanHeading = this.add.text(240,61,"",{
      fontFamily:"monospace",fontSize:"18px",color:"#19384a"
    }).setOrigin(.5);
    this.loanBody = this.add.text(92,103,"",{
      fontFamily:"monospace",fontSize:"12px",color:"#19384a",wordWrap:{width:300},lineSpacing:6
    });
    this.loanBoard.add([this.loanHeading,this.loanBody]);
    this.loanBoard.add(this.add.text(240,206,SCRIPT.loan_office.buildOffice_text_10,{
      fontFamily:"monospace",fontSize:"10px",color:"#19384a"
    }).setOrigin(.5));
    this.loanPages = SCRIPT.loan_office.buildOffice_loanPages;
  },

  talkToOfficer() {
    if (this.officeStage===0) {
      this.say(LINES.loan_office.talkToOfficer_1,()=>
        this.say(LINES.loan_office.talkToOfficer_2,()=>
          this.say(LINES.loan_office.talkToOfficer_3,()=>{
            this.officeStage=1;
            this.objective.setText(SCRIPT.loan_office.talkToOfficer_text_1);
            this.say(LINES.loan_office.talkToOfficer_4,()=>this.deliverWhiteboard());
          })));
      return;
    }
    if (this.officeStage===1) this.say(LINES.loan_office.talkToOfficer_5);
    else if (this.officeStage===2) this.say(LINES.loan_office.talkToOfficer_6);
    else if (this.officeStage===3 && this.allDocumentsCollected()) {
      this.handDocumentsToOfficer();
    } else if (this.officeStage===3) this.say(LINES.loan_office.talkToOfficer_7);
    else if (this.officeStage===4) this.startFinancialReview();
    else if (this.officeStage===5) this.startLoanOptions();
    else if (this.officeStage===6) this.say(LINES.loan_office.talkToOfficer_8);
    else if (this.offerStage===3 && !this.inspectionDone)
      this.say(LINES.loan_office.talkToOfficer_9);
    else if (this.offerStage===3) this.talkUnderwriting();
    else if (this.realtorStage>=2) this.say(LINES.loan_office.talkToOfficer_10,()=>
      this.say(LINES.loan_office.talkToOfficer_11));
    else this.say(LINES.loan_office.talkToOfficer_12);
  },

  startLoanOptions() {
    this.phase="loanOptions";
    this.player.setVelocity(0);
    this.prompt.setVisible(false);
    this.planChoice=0;
    this.planHint.setText(SCRIPT.loan_office.startLoanOptions_text_1);
    this.renderPlanChoice();
    this.planUI.setVisible(true);
  },

  movePlanChoice(direction) {
    if (this.phase==="tourReady") {
      this.tourReadyChoice=Phaser.Math.Clamp(this.tourReadyChoice+direction,0,1);
      this.renderTourReady();
      return;
    }
    if (this.phase==="showingChoice") {
      this.showingChoiceIndex=Phaser.Math.Clamp(this.showingChoiceIndex+direction,0,2);
      this.renderShowingChoice();
      return;
    }
    if (this.phase==="offerDecision") {
      this.offerChoice=Phaser.Math.Clamp(this.offerChoice+direction,0,1);
      this.renderOfferDecision();
      return;
    }
    if (this.phase==="conditionMenu") {
      this.conditionChoice=Phaser.Math.Clamp(this.conditionChoice+direction,0,2);
      this.renderConditionMenu();
      return;
    }
    if (this.phase!=="loanOptions") return;
    this.planChoice=Phaser.Math.Clamp(this.planChoice+direction,0,1);
    this.renderPlanChoice();
  },

  renderPlanChoice() {
    this.planRows.forEach((row,i)=>row.setBackgroundColor(i===this.planChoice ? "#f5d66f" : "#e9e3d0"));
  },

  collectPreapproval() {
    this.officeStage=7;
    this.preapprovalPaper.setVisible(false);
    this.downtownArrow.setVisible(true);
    this.objective.setText(SCRIPT.loan_office.collectPreapproval_text_1);
    this.say(LINES.loan_office.collectPreapproval_1);
  },

  beginQualificationReview() {
    this.phase="qualificationReview";
    this.control=false;
    this.near=null;
    this.player.setVelocity(0);
    this.prompt.setVisible(false);
    this.say(LINES.loan_office.beginQualificationReview_1,
      ()=>this.siftQualificationPapers(0));
  },

  siftQualificationPapers(index) {
    if (index===this.qualificationPapers.length) {
      this.qualificationStatus.setText(SCRIPT.loan_office.siftQualificationPapers_text_1);
      this.time.delayedCall(850,()=>{
        this.qualificationPapers.forEach(p=>p.setVisible(false));
        this.qualificationStatus.setVisible(false);
        this.say(LINES.loan_office.siftQualificationPapers_1,()=>
          this.say(LINES.loan_office.siftQualificationPapers_2,()=>
            this.say(LINES.loan_office.siftQualificationPapers_3,()=>
              this.say(LINES.loan_office.siftQualificationPapers_4,()=>
                this.say(LINES.loan_office.siftQualificationPapers_5,()=>this.printPreapprovalCinematic())))));
      });
      return;
    }
    const paper=this.qualificationPapers[index];
    paper.setPosition([224,251,278][index],147).setAngle(0).setVisible(true);
    this.qualificationStatus.setText(SCRIPT.loan_office.siftQualificationPapers_text_2(index+1)).setVisible(true);
    this.tweens.add({targets:paper,x:paper.x+13,y:138,angle:12,
      duration:260,ease:"Sine.easeInOut",yoyo:true,
      onComplete:()=>this.time.delayedCall(150,()=>this.siftQualificationPapers(index+1))});
  },

  printPreapprovalCinematic() {
    this.printStoryDocument(this.preapprovalPaper,SCRIPT.loan_office.printPreapprovalCinematic_text_1,()=>{
      this.officeStage=6;
      this.objective.setText(SCRIPT.loan_office.printPreapprovalCinematic_text_2);
    },SCRIPT.loan_office.printPreapprovalCinematic_text_3);
  },

  playPrinterBuzz() {
    const context=this.sound.context;
    if (!context || !context.createOscillator) return;
    try {
      if (context.state==="suspended") context.resume().catch(()=>{});
      const tone=context.createOscillator(), gain=context.createGain();
      tone.type="sawtooth";
      tone.frequency.setValueAtTime(150,context.currentTime);
      tone.frequency.linearRampToValueAtTime(95,context.currentTime+.38);
      gain.gain.setValueAtTime(.035,context.currentTime);
      gain.gain.linearRampToValueAtTime(0,context.currentTime+.42);
      tone.connect(gain).connect(context.destination);
      tone.start(); tone.stop(context.currentTime+.43);
    } catch (_) { /* Caption remains when audio is unavailable. */ }
  },

  printStoryDocument(paper,label,onReady,readyLine=null) {
    const playerSpot={x:this.player.x,y:this.player.y,visible:this.player.visible,bodyEnabled:this.player.body.enable};
    this.player.body.enable=false;
    this.phase="printerCutscene";
    this.control=false;
    this.player.setVelocity(0).setVisible(false);
    this.near=null;
    this.prompt.setVisible(false);
    paper.setVisible(false).setPosition(399,119);

    this.tweens.add({targets:this.officeLayer,x:-398,y:-85,scale:1.6,duration:440,
      ease:"Sine.easeInOut",onComplete:()=>{
        this.printerCaption.setText(SCRIPT.loan_office.printStoryDocument_text_1(label)).setVisible(true);
        this.playPrinterBuzz();
        this.time.delayedCall(520,()=>this.playPrinterBuzz());
        paper.setVisible(true);
        this.tweens.add({targets:paper,y:104,duration:1300,ease:"Linear"});
        this.tweens.add({targets:this.printer,x:397,duration:65,yoyo:true,repeat:17,
          onComplete:()=>this.printer.setX(399)});
        this.time.delayedCall(1900,()=>{
          this.printerCaption.setVisible(false);
          const returnToRoom=()=>this.tweens.add({targets:this.officeLayer,
            x:0,y:0,scale:1,duration:420,ease:"Sine.easeInOut",onComplete:()=>{
              this.player.setPosition(playerSpot.x,playerSpot.y).setVelocity(0).setVisible(playerSpot.visible);
              this.player.body.reset(playerSpot.x,playerSpot.y);
              this.player.body.enable=playerSpot.bodyEnabled;
              this.officeLayer.bringToTop(this.player);
              this.phase="office";
              this.control=true;
              this.objective.setPosition(18,232);
              onReady();
            }});
          if (readyLine) this.say(readyLine,returnToRoom,false);
          else returnToRoom();
        });
      }});
  },

  handDocumentsToOfficer() {
    this.control=false;
    this.player.setVelocity(0);
    this.say(LINES.loan_office.handDocumentsToOfficer_1,()=>
      this.say(LINES.loan_office.handDocumentsToOfficer_2,()=>{
        this.phase="documentHandoff";
        this.qualificationPapers.forEach(paper=>paper.setVisible(false));
        this.tweens.add({targets:this.officeLayer,x:-110,y:-38,scale:1.4,duration:430,
          onComplete:()=>this.spreadOfficerDocuments(0)});
      }));
  },

  spreadOfficerDocuments(index) {
    if(index===this.qualificationPapers.length) {
      this.time.delayedCall(450,()=>this.startFinancialReview());
      return;
    }
    const paper=this.qualificationPapers[index];
    paper.setPosition(253,130).setAngle(0).setVisible(true);
    this.tweens.add({targets:paper,x:[224,251,278][index],y:149,
      angle:[-5,0,5][index],duration:650,ease:"Sine.easeInOut",
      onComplete:()=>this.time.delayedCall(200,()=>this.spreadOfficerDocuments(index+1))});
  },

  startFinancialReview() {
    this.phase="reviewCutscene";
    this.control=false;
    this.player.setVelocity(0);
    this.prompt.setVisible(false);
    this.tweens.add({targets:this.officeLayer,x:-110,y:-38,scale:1.4,duration:430,
      onComplete:()=>this.say(LINES.loan_office.startFinancialReview_1,()=>
        this.say(LINES.loan_office.startFinancialReview_2,()=>
          this.say(LINES.loan_office.startFinancialReview_3,()=>
            this.say(LINES.loan_office.startFinancialReview_4,()=>
              this.say(LINES.loan_office.startFinancialReview_5,()=>
                this.say(LINES.loan_office.startFinancialReview_6,()=>
                  this.say(LINES.loan_office.startFinancialReview_7,()=>
                    this.collectReviewedDocuments())))))))});
  },

  collectReviewedDocuments() {
    this.control=false;
    this.phase="assistantPickup";
    this.near=null;
    this.tweens.add({targets:this.officeLayer,x:0,y:0,scale:1,duration:350,onComplete:()=>{
      this.say(LINES.loan_office.collectReviewedDocuments_1,()=>{
        const parts=[this.assistantBody,this.assistantHead,this.assistantLabel];
        this.assistantBody.setPosition(500,180);
        this.assistantHead.setPosition(500,161);
        this.assistantLabel.setPosition(500,140);
        parts.forEach(o=>{o.setVisible(true);this.officeLayer.bringToTop(o);});
        this.walkOfficeAssistant([{x:330,y:180,duration:1100},{x:330,y:118,duration:500}],false,()=>{
          this.qualificationPapers.forEach((paper,i)=>{
            this.officeLayer.bringToTop(paper);
            this.tweens.add({targets:paper,x:329+i,y:133-i,angle:0,duration:350,delay:i*220});
          });
          this.time.delayedCall(1100,()=>{
            this.walkOfficeAssistant([{x:330,y:180,duration:500},{x:500,y:180,duration:1100}],true,()=>{
              parts.forEach(o=>o.setVisible(false));
              this.qualificationPapers.forEach(p=>p.setVisible(false));
              this.time.delayedCall(350,()=>this.say(LINES.loan_office.collectReviewedDocuments_2,()=>{
                this.say(LINES.loan_office.collectReviewedDocuments_3,()=>{
                  this.face.setText(SCRIPT.loan_office.collectReviewedDocuments_text_1);
                  this.say(LINES.loan_office.collectReviewedDocuments_4,()=>{
                    this.phase="office";this.officeStage=5;this.control=true;
                  });
                });
                this.face.setText(SCRIPT.loan_office.collectReviewedDocuments_text_2);
              },false));
            });
          });
        });
      });
    }});
  },

  walkOfficeAssistant(steps,carrying,done) {
    const walk=i=>{
      if(i===steps.length) {done();return;}
      const {x,y,duration}=steps[i];
      this.tweens.add({targets:this.assistantBody,x,y,duration,ease:"Linear"});
      this.tweens.add({targets:this.assistantHead,x,y:y-19,duration,ease:"Linear"});
      if(carrying) this.qualificationPapers.forEach((paper,n)=>
        this.tweens.add({targets:paper,x:x-1+n,y:y+15-n,duration,ease:"Linear"}));
      this.tweens.add({targets:this.assistantLabel,x,y:y-40,duration,ease:"Linear",onComplete:()=>walk(i+1)});
    };
    walk(0);
  },

  allDocumentsCollected() {
    return Object.values(this.documents).every(Boolean);
  },

  setDocumentSceneVisible(active) {
    this.docHud.setVisible(active);
    for (const key of ["paystub","w2","id"]) {
      const visible = active && !this.documents[key];
      this.docTargets[key].setVisible(visible);
      this.docGlows[key].setVisible(false);
    }
    this.idPhoto.setVisible(active && !this.documents.id);
    const screenNeeded = active && !this.documents.statement;
    this.laptopGlow.setVisible(false);
    if (screenNeeded) this.laptopGlowTween.resume();
    else this.laptopGlowTween.pause();
    this.laptopScreen.setFillStyle(screenNeeded ? 0x66c7f2 : 0x35627c);
    this.apartmentDoorGlow.setVisible(false);
  },

  updateDocumentObjective() {
    const count = Object.values(this.documents).filter(Boolean).length;
    this.docHudText.setText([
      SCRIPT.loan_office.updateDocumentObjective_text_1(this.documents.paystub ? "[x]" : "[ ]"),
      SCRIPT.loan_office.updateDocumentObjective_text_2(this.documents.w2 ? "[x]" : "[ ]"),
      SCRIPT.loan_office.updateDocumentObjective_text_3(this.documents.id ? "[x]" : "[ ]"),
      SCRIPT.loan_office.updateDocumentObjective_text_4(this.documents.statement ? "[x]" : "[ ]")
    ].join("\n"));
    this.objective.setText(count===4
      ? SCRIPT.loan_office.updateDocumentObjective_text_5
      : SCRIPT.loan_office.updateDocumentObjective_text_6(count));
    this.apartmentDoorGlow.setVisible(false);
  },

  collectDocument(key) {
    if (this.officeStage!==3 || this.documents[key]) return;
    this.documents[key]=true;
    if (key==="statement" && this.statementHintTimer) {
      this.statementHintTimer.remove(false);
      this.statementHintTimer=null;
    }
    this.setDocumentSceneVisible(true);
    this.updateDocumentObjective();
    const lines = SCRIPT.loan_office.collectDocument_lines;
    this.say(lines[key],()=>{
      if (this.allDocumentsCollected()) this.say(LINES.loan_office.collectDocument_1);
    });
  },

  scheduleStatementHint() {
    if (this.statementHintShown || this.documents.statement) return;
    if (this.statementHintTimer) this.statementHintTimer.remove(false);
    this.statementHintTimer=this.time.delayedCall(30000,()=>{
      this.statementHintTimer=null;
      if (this.documents.statement || this.statementHintShown) return;
      this.statementHintPending=true;
      this.maybeShowStatementHint();
    });
  },

  maybeShowStatementHint() {
    if (!this.statementHintPending || this.statementHintShown || this.documents.statement
        || this.phase!=="apartment3" || this.dialogue) return;
    this.statementHintPending=false;
    this.statementHintShown=true;
    this.say(LINES.loan_office.maybeShowStatementHint_1);
  },

  showQuestComplete() {
    this.officeStage=4;
    this.startFinancialReview();
  },

  setWhiteboardVisible(visible) {
    this.boardPanel.setVisible(visible);
    this.boardTitle.setVisible(visible);
    this.board.setVisible(visible);
    this.boardBarrier.body.enable=visible;
  },

  deliverWhiteboard() {
    if (this.whiteboardDeliveryDone) {
      this.setWhiteboardVisible(true);
      this.say(LINES.loan_office.deliverWhiteboard_1);
      return;
    }
    this.whiteboardDeliveryDone=true;
    this.control=false;
    this.player.setVelocity(0);
    this.assistantBody.setPosition(-24,138).setVisible(true);
    this.assistantHead.setPosition(-24,119).setVisible(true);
    this.assistantLabel.setPosition(-24,98).setVisible(true);

    // The board travels in with the assistant, then stays in place while the assistant leaves.
    this.boardPanel.setPosition(-90,112).setVisible(true);
    this.boardTitle.setPosition(-151,72).setVisible(true);
    this.board.setPosition(-143,93).setVisible(true);
    this.boardBarrier.body.enable=false;

    this.tweens.add({targets:[this.assistantBody,this.assistantHead,this.assistantLabel],x:"+=92",duration:600,ease:"Sine.easeOut"});
    this.tweens.add({targets:this.boardPanel,x:104,duration:600,ease:"Sine.easeOut"});
    this.tweens.add({targets:this.boardTitle,x:43,duration:600,ease:"Sine.easeOut"});
    this.tweens.add({targets:this.board,x:51,duration:600,ease:"Sine.easeOut",onComplete:()=>{
      this.say(LINES.loan_office.deliverWhiteboard_2,()=>{
        this.boardBarrier.body.enable=true;
        this.tweens.add({targets:[this.assistantBody,this.assistantHead,this.assistantLabel],x:"-=120",duration:500,ease:"Sine.easeIn",onComplete:()=>{
          this.assistantBody.setVisible(false);
          this.assistantHead.setVisible(false);
          this.assistantLabel.setVisible(false);
          this.control=true;
          this.say(LINES.loan_office.deliverWhiteboard_3);
        }});
      });
    }});
  },

  startLoanBoard() {
    this.loanPage=0;
    this.phase="loanBoard";
    this.player.setVelocity(0);
    this.prompt.setVisible(false);
    this.spark.setVisible(false);
    this.renderLoanPage();
    this.loanBoard.setVisible(true);
  },

  renderLoanPage() {
    const [heading,body]=this.loanPages[this.loanPage];
    this.loanHeading.setText(heading+"  "+(this.loanPage+1)+"/4");
    this.loanBody.setText(body);
  },

  nextLoanPage() {
    if (this.loanPage<3) {
      this.loanPage++;
      this.renderLoanPage();
      return;
    }
    this.loanBoard.setVisible(false);
    this.phase="office";
    this.officeStage=2;
    this.objective.setText(SCRIPT.loan_office.nextLoanPage_text_1);
    this.printerGlow.setVisible(false);
    this.say(LINES.loan_office.nextLoanPage_1,
      ()=>this.printChecklistCinematic());
  },

  printChecklistCinematic() {
    this.printerGlow.setVisible(false);
    this.printStoryDocument(this.checklistPaper,SCRIPT.loan_office.printChecklistCinematic_text_1,()=>{
      this.officeStage=2;
      this.objective.setText(SCRIPT.loan_office.printChecklistCinematic_text_2);
      this.printerGlow.setVisible(false);
    },SCRIPT.loan_office.printChecklistCinematic_text_3);
  },

  printChecklist() {
    this.printerGlow.setVisible(false);
    this.checklistPaper.setVisible(false);
    this.say(LINES.loan_office.printChecklist_1,()=>
      this.say(LINES.loan_office.printChecklist_2,()=>{
        this.officeStage=3;
        this.objective.setText(SCRIPT.loan_office.printChecklist_text_1);
        this.say(LINES.loan_office.printChecklist_3);
      }));
  },

});
