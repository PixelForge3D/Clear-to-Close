"use strict";
// apartment: scene methods added onto ClearToClose (see HOW_TO_EXTEND.md).
Object.assign(ClearToClose.prototype, {

  buildApartment() {
    this.physics.world.setBounds(0,0,480,270);
    this.cameras.main.setBackgroundColor("#07101d");

    this.worldLayer = this.add.container(0,0);
    const A = obj => { this.worldLayer.add(obj); return obj; };

    // Shell / floor.
    A(this.add.rectangle(240,135,452,242,0x171a1f).setStrokeStyle(5,0x080b10));
    A(this.add.rectangle(240,145,430,208,0xb07142));
    for (let y=58; y<250; y+=16) {
      A(this.add.rectangle(240,y,428,2,0x895533,.45));
      for (let x=35+(y%32); x<455; x+=64) {
        A(this.add.rectangle(x,y,2,16,0x895533,.3));
      }
    }

    // Upper wall. This area is decorative and NOT walkable.
    A(this.add.rectangle(240,48,430,43,0xd1b184));
    A(this.add.rectangle(240,70,430,3,0x6e4a31));

    // Rugs / furniture.
    A(this.add.rectangle(193,171,150,92,0x31506d).setStrokeStyle(3,0x21384e));

    this.bed = A(this.add.rectangle(70,116,62,92,0x244366).setStrokeStyle(4,0x3a291f));
    A(this.add.rectangle(70,83,55,22,0xe5dccd));

    this.couch = A(this.add.rectangle(184,159,100,45,0x256f68).setStrokeStyle(4,0x123f3c));
    A(this.add.rectangle(184,145,90,15,0x32877e));

    this.table = A(this.add.rectangle(185,211,92,30,0x6e442b).setStrokeStyle(3,0x3d271b));
    this.wallet = A(this.add.rectangle(202,205,23,14,0x543627).setStrokeStyle(2,0x291d18));
    A(this.add.rectangle(202,205,4,3,0xd8ad61));

    // Entertainment center.
    this.tvStand = A(this.add.rectangle(43,183,36,65,0x5b3b28).setStrokeStyle(3,0x2c1d15));
    this.tv = A(this.add.rectangle(46,169,33,45,0x142c3c).setStrokeStyle(3,0x9aa8b2));
    this.ps5 = A(this.add.rectangle(61,196,7,28,0xe8edf2).setStrokeStyle(1,0x98a4ad));
    A(this.add.rectangle(61,196,2,22,0x202936));
    A(this.add.rectangle(63,188,2,3,0x4d79a8));

    // Dining area. Visual is larger than collision footprint so there is a comfortable path to kitchen.
    this.dining = A(this.add.rectangle(345,176,82,52,0x75482d).setStrokeStyle(3,0x3d271b));
    A(this.add.circle(326,174,12,0x3e7c46));
    // Chair on the right side of the table, facing the computer.
    this.chair = A(this.add.rectangle(413,176,25,28,0x604431).setStrokeStyle(2,0x35271f));
    A(this.add.rectangle(426,176,6,28,0x80543a));

    // Kitchen floor — walkable.
    A(this.add.rectangle(364,101,157,79,0xc8b49b).setStrokeStyle(3,0x725c49));

    this.fridge = A(this.add.rectangle(306,95,34,68,0xd4d7d7).setStrokeStyle(3,0x727b7f));
    this.counter = A(this.add.rectangle(368,82,78,26,0x6b3e25).setStrokeStyle(3,0x342014));
    this.sink = A(this.add.rectangle(349,82,28,15,0x7e9098).setStrokeStyle(2,0x3d4a50));
    this.stove = A(this.add.rectangle(415,100,39,61,0x30373c).setStrokeStyle(3,0x15191c));
    for (const [x,y] of [[405,82],[424,82],[405,96],[424,96]]) {
      A(this.add.circle(x,y,6,0x111518).setStrokeStyle(1,0x667177));
    }

    // Door / window / radiator.
    this.door = A(this.add.rectangle(265,48,34,39,0x55321f).setStrokeStyle(4,0x2b1a12));
    A(this.add.circle(275,54,2,0xd4aa45));

    this.windowObj = A(this.add.rectangle(141,51,84,30,0x5b9cc1).setStrokeStyle(4,0x3b2d25));
    A(this.add.rectangle(141,57,77,12,0x55646b));
    // Window mullion as a rectangle, so it cannot extend into the wall.
    A(this.add.rectangle(141,51,2,28,0xd8e3e8));

    this.radiator = A(this.add.rectangle(228,76,31,49,0xa7a7a1).setStrokeStyle(2,0x5e5e5a));
    for (let x=216; x<241; x+=6) A(this.add.rectangle(x,76,3,42,0xd3d3ca));

    // Ceiling leak: droplets fall vertically into the bucket in the open aisle.
    this.bucket = this.physics.add.staticSprite(285,207,"bucket");
    A(this.bucket);
    this.splash = A(this.add.ellipse(285,201,13,5,0x86def2,.85).setAlpha(0));
    this.drip = A(this.add.circle(285,0,2,0x69c4e0));
    this.tweens.add({
      targets:this.drip,y:201,duration:1000,repeat:-1,
      onRepeat:()=>{
        this.drip.y=0;
        this.splash.setAlpha(1).setScale(.6);
        this.tweens.add({targets:this.splash,alpha:0,scale:1.8,duration:360});
      }
    });

    // Laptop. The screen can pulse when the story wants the player to use it.
    this.laptopGlow = A(this.add.rectangle(367,176,27,34,0xf8e49a,0)
      .setStrokeStyle(3,0xf8e49a,1).setVisible(false));
    this.laptop = A(this.add.rectangle(366,176,17,29,0x253b4c).setStrokeStyle(3,0xaeb9c1));
    this.laptopScreen = A(this.add.rectangle(366,176,11,23,0x35627c));
    A(this.add.rectangle(380,176,9,21,0x9faeb6).setStrokeStyle(1,0x354c59));

    // The furniture is always present; the documents appear when the quest begins.
    this.payDrawer = A(this.add.rectangle(113,96,20,18,0x6d4731).setStrokeStyle(2,0x34241c));
    A(this.add.rectangle(113,99,14,5,0x533623).setStrokeStyle(1,0x2d201b));
    this.payPaper = A(this.add.rectangle(113,87,12,8,0xe9e5d6)
      .setStrokeStyle(1,0x6d7880).setVisible(false));

    this.fileCabinet = A(this.add.rectangle(98,221,24,26,0x62717a)
      .setStrokeStyle(2,0x273740));
    for (const y of [216,226]) A(this.add.rectangle(98,y,12,2,0xc2cbd0));
    this.w2Paper = A(this.add.rectangle(98,207,13,8,0xf1e9d8)
      .setStrokeStyle(1,0x687681).setVisible(false));
    this.idCard = A(this.add.rectangle(202,201,14,8,0xe7e7d8)
      .setStrokeStyle(1,0x315f86).setVisible(false));
    this.idPhoto = A(this.add.rectangle(198,201,3,4,0x7294a7).setVisible(false));

    this.docTargets = {paystub:this.payPaper,w2:this.w2Paper,id:this.idCard};
    this.docGlows = {};
    for (const [key,x,y,w,h] of [
      ["paystub",113,87,20,16],["w2",98,207,21,16],["id",202,201,28,20]
    ]) {
      const glow = A(this.add.rectangle(x,y,w,h,0x000000,0)
        .setStrokeStyle(2,0xf5d66f).setVisible(false));
      this.docGlows[key]=glow;
    }
    this.apartmentDoorGlow = A(this.add.rectangle(265,48,34,39,0x000000,0)
      .setStrokeStyle(3,0xf5d66f).setVisible(false));

    this.laptopGlowTween = {resume(){},pause(){}};

    this.photo = A(this.add.rectangle(198,51,18,18,0xd5c6a7).setStrokeStyle(2,0x543b2b));

    // Collision definitions. Visible wall/furniture footprints only.
    this.barriers = this.physics.add.staticGroup();

    // Interior boundary: the wall itself is solid, not just the outside canvas edge.
    this.wall(240,48,430,43);   // top wall
    this.wall(18,135,16,228);   // left wall
    this.wall(462,135,16,228);  // right wall
    this.wall(240,254,430,12);  // bottom wall

    this.wall(70,116,62,92);    // bed
    this.wall(184,159,100,45);  // couch
    this.wall(185,211,92,30);   // coffee table
    this.wall(43,183,36,65);    // TV stand
    this.wall(61,196,7,28);     // PS5

    // Smaller than the visual dining table to preserve clear walk paths.
    this.wall(345,176,82,52);
    this.wall(413,176,25,28); // chair blocks travel from behind

    // Kitchen fixtures; kitchen FLOOR remains walkable.
    this.wall(306,95,34,68);
    this.wall(368,82,78,26);
    this.wall(415,100,39,61);

    this.wall(265,48,34,39);    // door, contained in the upper wall
    this.wall(141,51,84,30);    // window
    this.wall(228,76,31,49);    // radiator
    this.wall(285,207,24,20);   // bucket; passage remains below it
    this.wall(113,96,20,18);    // bedside drawer
    this.wall(98,221,24,26);   // filing cabinet

    this.player = this.physics.add.sprite(268,169,"hero").setDepth(50);
    A(this.player);
    this.player.body.setSize(12,14).setOffset(4,14);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player,this.barriers);

    // Explicit interaction list. Radius can be different from visual/collision footprint.
    this.items = [];
    this.addInteraction(this.bucket,SCRIPT.apartment.buildApartment_text_1,25);
    this.addInteraction(this.radiator,SCRIPT.apartment.buildApartment_text_2,30);
    this.addInteraction(this.windowObj,SCRIPT.apartment.buildApartment_text_3,48);
    this.windowObj.setData("interactionMargin",14);
    this.addInteraction(this.laptop,SCRIPT.apartment.buildApartment_text_4,48,"laptop");
    this.laptop.setData("interactBounds",{x:413,y:176,w:25,h:28});
    this.addInteraction(this.tv,SCRIPT.apartment.buildApartment_text_5,56,"tv");
    this.addInteraction(this.ps5,SCRIPT.apartment.buildApartment_text_6,56,"tv");
    this.addInteraction(this.photo,SCRIPT.apartment.buildApartment_text_7,26);
    // The interaction spot is on clear floor directly in front of the wall picture.
    this.photo.setData("interactX",198).setData("interactY",75);
    this.photo.setData("interactionMargin",13);
    this.addInteraction(this.door,SCRIPT.apartment.buildApartment_text_8,48,"door");
    // The usable doorway spot is directly below the door so the player can stand
    // as close to it as they can to the window and wall photo.
    this.door.setData("interactX",265).setData("interactY",74);
    this.door.setData("interactionMargin",22);
    for (const [key,obj,radius] of [
      ["paystub",this.payPaper,43],["w2",this.w2Paper,43],["id",this.idCard,48]
    ]) {
      this.addInteraction(obj,SCRIPT.apartment.buildApartment_text_9,radius,"document");
      obj.setData("docKey",key);
    }
    this.payPaper.setData("interactBounds",{x:113,y:96,w:20,h:18});
    this.w2Paper.setData("interactBounds",{x:98,y:221,w:24,h:26});
    this.idCard.setData("interactBounds",{x:185,y:211,w:92,h:30});
  },

  buildInternet() {
    this.web = this.add.container(0,0).setDepth(400).setVisible(false);
    this.web.add(this.add.rectangle(240,135,480,270,0x07101d));
    this.web.add(this.add.rectangle(240,27,450,38,0x1b3851).setStrokeStyle(2,0x79b5dc));
    this.web.add(this.add.text(30,16,SCRIPT.apartment.buildInternet_text_1,{
      fontFamily:"monospace",fontSize:"13px",color:"#f5d66f"
    }));
    this.searchBar = this.add.text(145,16,SCRIPT.apartment.buildInternet_text_2,{
      fontFamily:"monospace",fontSize:"11px",color:"#fff",
      backgroundColor:"#0d1d2bdd",padding:{x:8,y:5}
    });
    this.web.add(this.searchBar);

    this.webTitle = this.add.text(28,58,SCRIPT.apartment.buildInternet_text_3,{
      fontFamily:"monospace",fontSize:"11px",color:"#9fc5e8"
    });
    this.web.add(this.webTitle);

    this.resultBox = this.add.rectangle(240,118,420,91,0x102337)
      .setStrokeStyle(2,0x315f86);
    this.web.add(this.resultBox);

    this.resultTitle = this.add.text(45,82,"",{
      fontFamily:"monospace",fontSize:"12px",color:"#f4d66d",wordWrap:{width:380}
    });
    this.web.add(this.resultTitle);

    this.resultBody = this.add.text(45,119,"",{
      fontFamily:"monospace",fontSize:"10px",color:"#e5edf5",wordWrap:{width:380}
    });
    this.web.add(this.resultBody);

    this.webPrompt = this.add.text(240,174,SCRIPT.apartment.buildInternet_text_4,{
      fontFamily:"monospace",fontSize:"9px",color:"#fff"
    }).setOrigin(.5);
    this.web.add(this.webPrompt);

    // Confusion label is now anchored right above the meter.
    this.confusionLabel = this.add.text(130,192,SCRIPT.apartment.buildInternet_text_5,{
      fontFamily:"monospace",fontSize:"9px",color:"#fff"
    });
    this.web.add(this.confusionLabel);

    this.confusionBg = this.add.rectangle(130,212,190,13,0x18212a)
      .setOrigin(0,.5).setStrokeStyle(1,0x9aa8b2);
    this.web.add(this.confusionBg);

    this.confusionFill = this.add.rectangle(130,212,1,9,0xe3a84d)
      .setOrigin(0,.5);
    this.web.add(this.confusionFill);

    this.confusionText = this.add.text(329,206,SCRIPT.apartment.buildInternet_text_6,{
      fontFamily:"monospace",fontSize:"9px",color:"#fff"
    });
    this.web.add(this.confusionText);

    // Player reaction dialogue OVER PixelSearch — no apartment cutaway.
    this.webDialogue = this.add.container(0,0).setDepth(430).setVisible(false);
    this.webDialogue.add(this.add.rectangle(240,216,330,58,0x07162b,.98)
      .setStrokeStyle(3,0xc8e0ff));
    this.webDialogue.add(this.add.rectangle(108,216,40,43,0x315f86)
      .setStrokeStyle(2,0x8bc5f4));
    this.webDialogue.add(this.add.text(108,216,SCRIPT.apartment.buildInternet_text_7,{fontSize:"22px"}).setOrigin(.5));
    this.webReactionText = this.add.text(138,196,"",{
      fontFamily:"monospace",fontSize:"10px",color:"#fff",wordWrap:{width:245}
    });
    this.webDialogue.add(this.webReactionText);

    // Cousin Dave phone.
    this.phone = this.add.container(0,0).setDepth(1000).setVisible(false);
    this.phone.add(this.add.rectangle(240,135,520,310,0x07101d,1));
    this.phone.add(this.add.rectangle(365,137,196,224,0x10151d)
      .setStrokeStyle(4,0x93a4b2));
    this.phone.add(this.add.text(283,39,SCRIPT.apartment.buildInternet_text_8,{
      fontFamily:"monospace",fontSize:"11px",color:"#f5d66f"
    }));
    this.daveText = this.add.text(283,65,
      SCRIPT.apartment.buildInternet_text_9,{
      fontFamily:"monospace",fontSize:"9px",color:"#fff",wordWrap:{width:165}
    });
    this.phone.add(this.daveText);
    this.phone.add(this.add.text(365,224,SCRIPT.apartment.buildInternet_text_10,{
      fontFamily:"monospace",fontSize:"9px",color:"#9fc5e8"
    }).setOrigin(.5));

    // Incoming message alert.
    this.daveNotice = this.add.container(0,0).setDepth(990).setVisible(false);
    this.daveNotice.add(this.add.rectangle(240,135,520,310,0x07101d,1));
    this.daveNotice.add(this.add.rectangle(240,122,290,88,0x10151d)
      .setStrokeStyle(4,0x9fc5e8));
    this.daveNotice.add(this.add.text(240,96,SCRIPT.apartment.buildInternet_text_11,{
      fontFamily:"monospace",fontSize:"16px",color:"#f5d66f"
    }).setOrigin(.5));
    this.daveNotice.add(this.add.text(240,122,SCRIPT.apartment.buildInternet_text_12,{
      fontFamily:"monospace",fontSize:"10px",color:"#fff"
    }).setOrigin(.5));
    this.daveNotice.add(this.add.text(240,148,SCRIPT.apartment.buildInternet_text_13,{
      fontFamily:"monospace",fontSize:"9px",color:"#9fc5e8"
    }).setOrigin(.5));

    // Overload payoff.
    this.overloadUI = this.add.container(0,0).setDepth(1010).setVisible(false);
    this.overloadUI.add(this.add.rectangle(240,135,520,310,0x07101d,1));
    this.overloadUI.add(this.add.text(240,42,SCRIPT.apartment.buildInternet_text_14,{
      fontFamily:"monospace",fontSize:"14px",color:"#f5d66f"
    }).setOrigin(.5));
    this.overloadUI.add(this.add.text(240,80,SCRIPT.apartment.buildInternet_text_15,{
      fontFamily:"monospace",fontSize:"22px",color:"#fff",
      stroke:"#b84c4c",strokeThickness:4
    }).setOrigin(.5));
    const terms=SCRIPT.apartment.buildInternet_terms;
    this.overloadTerms=terms.map((term,i)=>{
      const label=this.add.text(0,0,term,{
        fontFamily:"monospace",fontSize:"11px",color:i<7 ? "#efb9b9" : "#d9bcc9"
      }).setOrigin(.5);
      this.overloadUI.add(label);
      return label;
    });
    this.overloadOrbit={angle:0};
    this.positionOverloadTerms();
    this.overloadContinue = this.add.text(240,225,"",{
      fontFamily:"monospace",fontSize:"10px",color:"#f5d66f"
    }).setOrigin(.5);
    this.overloadUI.add(this.overloadContinue);
  },

  positionOverloadTerms() {
    this.overloadTerms.forEach((label,i)=>{
      const outer=i<7, count=outer ? 7 : 4, slot=outer ? i : i-7;
      const direction=outer ? 1 : -1;
      const theta=(slot/count)*Math.PI*2+direction*this.overloadOrbit.angle*Math.PI/180;
      label.setPosition(240+Math.cos(theta)*(outer ? 160 : 76),
        150+Math.sin(theta)*(outer ? 43 : 22));
    });
  },

  seatAtComputer(next) {
    const returnPhase=this.phase;
    this.phase="computerSeating";
    this.control=false;
    this.computerApproachX=this.player.x<413 ? 392 : 439;
    this.player.body.enable=false;
    this.player.setVelocity(0).setPosition(413,176).setTexture("heroSitting");
    this.sitting=true;
    this.near=null;
    this.time.delayedCall(450,()=>{
      this.phase=returnPhase;
      this.control=true;
      next();
      if (this.phase==="internet") this.standFromComputer();
    });
  },

  standFromComputer() {
    if (!this.sitting) return;
    this.player.setTexture("hero").setPosition(this.computerApproachX,176).setVelocity(0);
    this.player.body.enable=true;
    this.sitting=false;
    this.control=["opening","apartment2","apartment3"].includes(this.phase);
  },

  rentEvent() {
    if (this.phase==="computerSeating" && !this.eventStarted) {
      this.time.delayedCall(600,()=>this.rentEvent());
      return;
    }
    if (this.eventStarted || this.phase!=="opening") return;

    this.eventStarted = true;
    this.control = false;
    this.player.setVelocity(0);

    const knock = this.add.text(265,90,SCRIPT.apartment.rentEvent_text_1,{
      fontFamily:"monospace",fontSize:"13px",color:"#fff",align:"center",
      stroke:"#000",strokeThickness:4
    }).setOrigin(.5).setDepth(180);

    this.cameras.main.shake(200,.006);

    this.time.delayedCall(850,()=>{
      knock.destroy();

      // Letter lands ON THE FLOOR, below the solid wall/door, where the player can reach it.
      this.mail = this.add.rectangle(265,101,23,12,0xf0e4c8)
        .setStrokeStyle(1,0x6d5e4b).setDepth(35);
      this.worldLayer.add(this.mail);
      this.worldLayer.bringToTop(this.player);

      // Make the letter a small solid object so the player cannot stand underneath/inside it.
      this.mailBarrier = this.wall(265,101,27,16);

      this.addInteraction(this.mail,SCRIPT.apartment.rentEvent_text_2,44,"mail");

      this.control = true;
      this.objective.setText(SCRIPT.apartment.rentEvent_text_3);
    });
  },

  pickUpMailAndShowNotice() {
    if (this.mail) {
      this.items = this.items.filter(x=>x!==this.mail);
      this.mail.destroy();
      this.mail = null;
    }

    if (this.mailBarrier) {
      this.barriers.remove(this.mailBarrier,true,true);
      this.mailBarrier = null;
    }

    this.spark.setVisible(false);
    this.prompt.setVisible(false);
    this.control = false;
    this.notice.setVisible(true);
  },

  crash() {
    this.control = false;

    this.time.delayedCall(400,()=>{
      this.cameras.main.shake(420,.018);

      for (let i=0;i<10;i++) {
        const b = this.add.rectangle(
          Phaser.Math.Between(218,252),
          Phaser.Math.Between(42,55),
          Phaser.Math.Between(4,10),
          Phaser.Math.Between(3,7),
          0x9a8066
        ).setDepth(30);

        this.worldLayer.add(b);

        this.tweens.add({
          targets:b,
          y:Phaser.Math.Between(105,130),
          duration:Phaser.Math.Between(420,720),
          ease:"Bounce.easeOut"
        });
      }

      this.time.delayedCall(1300,()=>{
        this.say(LINES.apartment.crash_1,()=>this.showTitle());
      });
    });
  },

  beginScene2() {
    this.switchLocation("apartment");
    this.title.setVisible(false);

    this.touchUI.setVisible(true);
    this.objective.setVisible(true);

    this.phase = "apartment2";
    this.control = true;
    this.player.setPosition(268,169);

    this.laptop.setData("text",SCRIPT.apartment.beginScene2_text_1);
    this.objective.setText(SCRIPT.apartment.beginScene2_text_2);

    // Story guidance: visually call attention to the computer only after this objective appears.
    this.laptopGlow.setVisible(false);
    this.laptopGlowTween.resume();
    this.laptopScreen.setFillStyle(0x66c7f2);

    // Give the player a clear story cue before they are expected to discover the laptop.
    // This uses the regular character dialogue box so it reads as the player's thought,
    // not as a floating gameplay label.
    this.say(LINES.apartment.beginScene2_1);
  },

  openInternet() {
    this.phase = "internet";
    this.control = false;

    // Objective reached: stop highlighting the computer.
    this.laptopGlowTween.pause();
    this.laptopGlow.setVisible(false);
    this.laptopScreen.setFillStyle(0x35627c);

    this.hideApartmentForOverlay();
    this.touchUI.setVisible(true);

    this.web.setVisible(true);
    this.searchIndex = 0;
    this.setConfusion(0);
    this.renderSearch();
  },

  searchResults() {
    return SCRIPT.apartment.searchResults;
  },

  renderSearch() {
    const result = this.searchResults()[this.searchIndex];
    this.resultTitle.setText(result.title);
    this.resultBody.setText(result.body);
    this.webPrompt.setText(SCRIPT.apartment.renderSearch_text_1);
  },

  reactToSearchResult() {
    const result = this.searchResults()[this.searchIndex];
    this.phase = "webReaction";
    this.webReactionText.setText(result.reaction+SCRIPT.apartment.reactToSearchResult_text_1);
    this.webDialogue.setVisible(true);
  },

  advanceAfterReaction() {
    const result = this.searchResults()[this.searchIndex];
    this.webDialogue.setVisible(false);
    this.setConfusion(result.confusion);

    if (this.searchIndex < this.searchResults().length-1) {
      this.searchIndex++;
      this.phase = "internet";
      this.renderSearch();
      return;
    }

    this.showDave();
  },

  setConfusion(value) {
    this.confusion = value;
    this.confusionFill.width = Math.max(1,190*(value/100));
    this.confusionText.setText(value+"%");
  },

  showDave() {
    this.webDialogue.setVisible(false);
    this.web.setVisible(false);
    this.hideApartmentForOverlay();

    this.phase = "daveNotice";
    this.touchUI.setVisible(true);
    this.daveNotice.setVisible(true);

    this.cameras.main.shake(120,.004);
    this.time.delayedCall(180,()=>this.cameras.main.shake(120,.004));
  },

  finishInternet() {
    this.hideApartmentForOverlay();
    this.web.setVisible(false);
    this.phone.setVisible(false);
    this.daveNotice.setVisible(false);

    this.phase = "overload";
    this.setConfusion(100);
    this.overloadContinue.setText("");
    this.overloadUI.setVisible(true);
    this.touchUI.setVisible(true);
    this.overloadOrbit.angle=0;
    this.positionOverloadTerms();
    this.overloadSpin=this.tweens.add({targets:this.overloadOrbit,angle:360,
      duration:8500,ease:"Linear",repeat:-1,
      onUpdate:()=>this.positionOverloadTerms()});

    this.cameras.main.shake(350,.012);

    this.time.delayedCall(1300,()=>{
      if (this.phase==="overload") {
        this.overloadContinue.setText(SCRIPT.apartment.finishInternet_text_1);
      }
    });
  },

  finishOverload() {
    if (!this.overloadContinue.text) return;
    this.switchLocation("apartment");

    this.overloadUI.setVisible(false);
    if (this.overloadSpin) this.overloadSpin.stop();
    // Four character lines follow; phone players still need the action button.
    this.touchUI.setVisible(true);

    // Return to apartment only AFTER the player dismisses overload.

    this.phase = "transition";

    this.say(LINES.apartment.finishOverload_1,()=>{
      this.say(LINES.apartment.finishOverload_2,()=>{
        this.say(LINES.apartment.finishOverload_3,()=>{
          this.say(LINES.apartment.finishOverload_4,()=>this.finishInternetAtHome());
        });
      });
    });
  },

  finishInternetAtHome() {
    this.switchLocation("apartment");
    this.townUnlocked=true;
    this.phase="apartment2";
    this.control=true;

    this.touchUI.setVisible(true);
    this.objective.setVisible(true).setText(SCRIPT.apartment.finishInternetAtHome_text_1);
    this.player.setVelocity(0);
  },

  hideApartmentForOverlay() {
    this.switchLocation(null);

    this.objective.setVisible(false);
    this.prompt.setVisible(false);
    this.spark.setVisible(false);

    this.box.setVisible(false);
    this.portrait.setVisible(false);
    this.face.setVisible(false);
    this.loAvatar.setVisible(false);
    this.text.setVisible(false);

    this.notice.setVisible(false);

    // Defensive: these are gameplay objects that must never leak through full-screen overlays.
    if (this.mail) this.mail.setVisible(false);
  },

});
