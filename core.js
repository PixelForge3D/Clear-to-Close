// Shared lookup tables (built once instead of every frame).
const WALK_PHASES=new Set(["opening","apartment2","apartment3","office","town","downtown","realtorOffice","showingStreet","showingHome","closingStreet","closingRoom"]);
const DOOR_KINDS=new Set(["officeDoor","townBroker","townApartment","kwDoor","showingDoor"]);

class ClearToClose extends Phaser.Scene {
  constructor() {
    super("ClearToClose");
    this.speed = 100;
    this.near = null;
    this.dialogue = false;
    this.control = true;
    this.mobile = new Phaser.Math.Vector2();
    this.phase = "opening";
    this.eventStarted = false;
    this.noticeRead = false;
    this.searchIndex = 0;
    this.confusion = 0;
    this.mail = null;
    this.mailBarrier = null;
    this.officeStage = 0;
    this.townUnlocked = false;
    this.documents = {paystub:false,w2:false,id:false,statement:false};
    this.documentHuntStarted = false;
    this.reviewPage = 0;
    this.planChoice = 0;
    this.doorCooldownUntil = 0;
    this.statementHintTimer = null;
    this.statementHintShown = false;
    this.statementHintPending = false;
    this.doorRemarkArmed = true;
    this.sitting = false;
    this.realtorStage = 0;
    this.realtorPage = 0;
    this.realtorWelcomeSeen = false;
    this.daveIntroSeen = false;
    this.realtorSeated = false;
    this.agentInOffice = true;
    this.whiteboardDeliveryDone = false;
    this.teamChatSeen = false;
    this.homePreferences = {};
    this.showingVisited = [false,false,false];
    this.showingNotes = [[],[],[]];
    this.currentHome = -1;
    this.favoriteHome = -1;
    this.showingIntroSeen = false;
    this.showingAgentExited = [false,false,false];
    this.tourAgentReady = false;
    this.currentStop = 0;
    this.tourReadyChoice = 0;
    this.offerStage = 0;
    this.offerAgentInside = false;
    this.offerBriefed = false;
    this.offerPage = 0;
    this.offerView = "review";
    this.offerDecision = "payment";
    this.offerChoice = 0;
    this.offerClosingResult = "";
    this.inspectionDone = false;
    this.underwritingStage = 0;
    this.underwritingDocs = {deposit:false,insurance:false};
    this.conditionChoice = 0;
    this.closingStage = 0;
    this.storyPage = 0;
    this.storyPages = [];
    this.storyReturnPhase = "";
    this.storyDone = null;
  }

  create() {
    this.makeArt();
    this.buildApartment();
    this.buildUI();
    this.buildInternet();
    this.buildTown();
    this.buildOffice();
    this.buildDowntown();
    this.buildRealtorOffice();
    this.buildHouseHunting();
    this.buildOfferScene();
    this.buildFinalChapters();
    this.registerLocations();
    this.switchLocation("apartment");

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys("W,A,S,D,E,SPACE,ENTER");
    ["keydown-E", "keydown-SPACE", "keydown-ENTER"].forEach(evt => {
      this.input.keyboard.on(evt, () => this.action());
    });
    ["keydown-UP","keydown-W"].forEach(evt => this.input.keyboard.on(evt,()=>this.movePlanChoice(-1)));
    ["keydown-DOWN","keydown-S"].forEach(evt => this.input.keyboard.on(evt,()=>this.movePlanChoice(1)));

    this.touch();

    this.time.delayedCall(500, () => this.say(LINES.core.create_1));
    this.time.delayedCall(60000, () => this.rentEvent());
  }

  makeArt() {
    let g = this.make.graphics({ add: false });

    // Player placeholder sprite.
    g.fillStyle(0x493021); g.fillRect(5,1,10,6);
    g.fillStyle(0xe1a77c); g.fillRect(5,7,10,7);
    g.fillStyle(0x1764a3); g.fillRect(3,14,14,8);
    g.fillStyle(0x26374b); g.fillRect(5,22,4,6); g.fillRect(11,22,4,6);
    g.generateTexture("hero",20,30);
    g.destroy();

    // Seated pose uses the same size and collision footprint as the walking sprite.
    g = this.make.graphics({add:false});
    g.fillStyle(0x493021); g.fillRect(5,5,10,6);
    g.fillStyle(0xe1a77c); g.fillRect(5,11,10,7);
    g.fillStyle(0x1764a3); g.fillRect(2,18,16,9);
    g.fillStyle(0x26374b); g.fillRect(4,27,12,2);
    g.generateTexture("heroSitting",20,30);
    g.destroy();

    // Bucket sprite.
    g = this.make.graphics({ add: false });
    g.fillStyle(0x87979f); g.fillRect(1,4,20,12);
    g.fillStyle(0xb8c7ce); g.fillRect(3,5,16,3);
    g.lineStyle(2,0x3b454a); g.strokeRect(1,4,20,12);
    g.generateTexture("bucket",22,18);
    g.destroy();
  }

  wall(x,y,w,h) {
    const r = this.add.rectangle(x,y,w,h,0x000000,0);
    this.physics.add.existing(r,true);
    this.barriers.add(r);
    return r;
  }

  addInteraction(obj,text,radius=39,kind="normal") {
    obj.setData("text",text);
    obj.setData("radius",radius);
    obj.setData("kind",kind);
    this.items.push(obj);
  }

  buildUI() {
    this.objective = this.add.text(18,232,SCRIPT.core.buildUI_text_1,{
      fontFamily:"monospace",fontSize:"9px",color:"#f7d878",
      backgroundColor:"#11151ddd",padding:{x:7,y:5}
    }).setDepth(100);
    this.objective.setVisible(false);
    this.objective.setVisible = function() { return this; };

    this.docHud = this.add.container(0,0).setDepth(110).setVisible(false);
    this.docHud.add(this.add.rectangle(397,62,146,82,0x111f2d,.94)
      .setStrokeStyle(2,0xe6c98d));
    this.docHud.add(this.add.text(329,26,SCRIPT.core.buildUI_text_2,{
      fontFamily:"monospace",fontSize:"10px",color:"#f5d66f"
    }));
    this.docHudText = this.add.text(329,43,"",{
      fontFamily:"monospace",fontSize:"9px",color:"#fff",lineSpacing:3
    });
    this.docHud.add(this.docHudText);

    // A still, unobtrusive action cue appears only beside a usable object.
    this.prompt = this.add.text(0,0,SCRIPT.core.buildUI_text_3,{
      fontFamily:"monospace",fontSize:"8px",color:"#ffffff",
      stroke:"#173247",strokeThickness:3
    }).setOrigin(.5).setDepth(150).setVisible(false);

    this.box = this.add.rectangle(270,220,300,66,0x07162b,.97)
      .setStrokeStyle(3,0xc8e0ff).setDepth(200).setVisible(false);
    this.portrait = this.add.rectangle(150,220,42,49,0x315f86)
      .setStrokeStyle(2,0x8bc5f4).setDepth(201).setVisible(false);
    this.face = this.add.text(150,220,SCRIPT.core.buildUI_text_4,{fontSize:"25px"})
      .setOrigin(.5).setDepth(202).setVisible(false);
    this.loAvatar = this.add.container(150,220).setDepth(202).setVisible(false);
    this.loAvatar.add(this.add.rectangle(0,16,29,19,0x235a82));
    this.loAvatar.add(this.add.rectangle(0,20,5,10,0xe9e3d0));
    this.loAvatar.add(this.add.rectangle(0,23,3,7,0x9e3036));
    this.loAvatar.add(this.add.circle(0,-5,12,0xc99572));
    this.loAvatar.add(this.add.rectangle(0,-16,23,6,0x392d27));
    this.agentAvatar = this.add.container(150,220).setDepth(202).setVisible(false);
    this.agentAvatar.add(this.add.rectangle(0,16,29,19,0xb8202c));
    this.agentAvatar.add(this.add.circle(0,-5,12,0xc99572));
    this.agentAvatar.add(this.add.rectangle(0,-16,23,6,0x392d27));
    this.text = this.add.text(178,197,"",{
      fontFamily:"monospace",fontSize:"10px",color:"#fff",wordWrap:{width:230}
    }).setDepth(202).setVisible(false);

    // Interaction is discovered by standing beside an object and pressing action.
    this.spark = this.add.circle(0,0,1,0x000000,0).setVisible(false);

    this.notice = this.add.container(0,0).setDepth(260).setVisible(false);
    this.notice.add(this.add.rectangle(240,135,480,270,0x000000,.78));
    this.notice.add(this.add.rectangle(240,133,260,174,0xeee2c9).setStrokeStyle(4,0x41362b));
    this.notice.add(this.add.text(240,70,SCRIPT.core.buildUI_text_5,{
      fontFamily:"monospace",fontSize:"13px",color:"#241e18"
    }).setOrigin(.5));
    this.notice.add(this.add.text(240,102,
      SCRIPT.core.buildUI_text_6,{
      fontFamily:"monospace",fontSize:"11px",color:"#241e18"
    }).setOrigin(.5,0));
    this.notice.add(this.add.text(240,195,SCRIPT.core.buildUI_text_7,{
      fontFamily:"monospace",fontSize:"9px",color:"#5c5044"
    }).setOrigin(.5));

    this.title = this.add.container(0,0).setDepth(500).setVisible(false);
    this.title.add(this.add.rectangle(240,135,480,270,0x050b16));
    this.title.add(this.add.text(240,90,SCRIPT.core.buildUI_text_8,{
      fontFamily:"monospace",fontSize:"31px",color:"#f6fbff",
      stroke:"#315f86",strokeThickness:5
    }).setOrigin(.5));
    this.title.add(this.add.text(240,128,SCRIPT.core.buildUI_text_9,{
      fontFamily:"monospace",fontSize:"10px",color:"#9fc5e8"
    }).setOrigin(.5));
    this.startText = this.add.text(240,188,SCRIPT.core.buildUI_text_10,{
      fontFamily:"monospace",fontSize:"12px",color:"#f2d77d"
    }).setOrigin(.5);
    this.title.add(this.startText);
    this.tweens.add({targets:this.startText,alpha:.25,duration:650,yoyo:true,repeat:-1});

    this.questCompleteUI = this.add.container(0,0).setDepth(600).setVisible(false);
    this.questCompleteUI.add(this.add.rectangle(240,135,480,270,0x07101d,.94));
    this.questCompleteUI.add(this.add.rectangle(240,135,350,158,0x173047)
      .setStrokeStyle(4,0xf5d66f));
    this.questCompleteUI.add(this.add.text(240,91,SCRIPT.core.buildUI_text_11,{
      fontFamily:"monospace",fontSize:"20px",color:"#f5d66f"
    }).setOrigin(.5));
    this.questCompleteUI.add(this.add.text(240,132,SCRIPT.core.buildUI_text_12,{
      fontFamily:"monospace",fontSize:"11px",color:"#fff",align:"center"
    }).setOrigin(.5));
    this.questCompleteUI.add(this.add.text(240,191,SCRIPT.core.buildUI_text_13,{
      fontFamily:"monospace",fontSize:"9px",color:"#9fc5e8"
    }).setOrigin(.5));

    this.reviewUI = this.add.container(0,0).setDepth(610).setVisible(false);
    this.reviewUI.add(this.add.rectangle(240,135,480,270,0x07101d,.95));
    this.reviewUI.add(this.add.rectangle(240,128,374,199,0xe9e3d0)
      .setStrokeStyle(4,0x668298));
    this.reviewHeading = this.add.text(240,49,"",{
      fontFamily:"monospace",fontSize:"15px",color:"#19384a"
    }).setOrigin(.5,0);
    this.reviewBody = this.add.text(75,83,"",{
      fontFamily:"monospace",fontSize:"11px",color:"#19384a",
      wordWrap:{width:330},lineSpacing:5
    });
    this.reviewUI.add([this.reviewHeading,this.reviewBody]);
    this.reviewUI.add(this.add.text(240,212,SCRIPT.core.buildUI_text_14,{
      fontFamily:"monospace",fontSize:"10px",color:"#19384a"
    }).setOrigin(.5));
    this.reviewPages = SCRIPT.core.buildUI_reviewPages;

    this.planUI = this.add.container(0,0).setDepth(620).setVisible(false);
    this.planUI.add(this.add.rectangle(240,135,480,270,0x07101d,.96));
    this.planUI.add(this.add.rectangle(240,132,386,206,0xe9e3d0)
      .setStrokeStyle(4,0x668298));
    this.planUI.add(this.add.text(240,47,SCRIPT.core.buildUI_text_15,{
      fontFamily:"monospace",fontSize:"16px",color:"#19384a"
    }).setOrigin(.5));
    this.planUI.add(this.add.text(72,75,
      SCRIPT.core.buildUI_text_16,{
      fontFamily:"monospace",fontSize:"11px",color:"#19384a",lineSpacing:5
    }));
    this.planRows = [
      this.add.text(77,126,SCRIPT.core.buildUI_text_17,{
        fontFamily:"monospace",fontSize:"10px",color:"#19384a",backgroundColor:"#f5d66f",padding:{x:5,y:5}
      }),
      this.add.text(77,159,SCRIPT.core.buildUI_text_18,{
        fontFamily:"monospace",fontSize:"10px",color:"#19384a",padding:{x:5,y:5}
      })
    ];
    this.planRows.forEach((row,i)=>{
      row.setInteractive({useHandCursor:true}).on("pointerdown",()=>{
        if (this.phase!=="loanOptions") return;
        this.planChoice=i;
        this.renderPlanChoice();
        this.action();
      });
      this.planUI.add(row);
    });
    this.planHint = this.add.text(240,208,SCRIPT.core.buildUI_text_19,{
      fontFamily:"monospace",fontSize:"9px",color:"#19384a"
    }).setOrigin(.5);
    this.planUI.add(this.planHint);
  }

  touch() {
    const mk = (x,y,label) => {
      const c = this.add.circle(x,y,16,0x101827,.58)
        .setStrokeStyle(2,0xe5edf6,.75).setDepth(700).setInteractive();
      const t = this.add.text(x,y,label,{
        fontFamily:"monospace",fontSize:"14px",color:"#fff"
      }).setOrigin(.5).setDepth(701);
      return [c,t];
    };

    // The action button must remain above full-screen story overlays on phones.
    this.touchUI = this.add.container(0,0).setDepth(1100);

    const [L,Lt] = mk(31,221,"◀");
    const [R,Rt] = mk(91,221,"▶");
    const [U,Ut] = mk(61,191,"▲");
    const [D,Dt] = mk(61,251,"▼");
    const [A,At] = mk(446,221,"!");

    [L,Lt,R,Rt,U,Ut,D,Dt,A,At].forEach(x=>this.touchUI.add(x));
    this.directionControls = [L,Lt,R,Rt,U,Ut,D,Dt];

    // Track each held pointer independently. Releasing ! (or a second D-pad
    // finger) must not cancel another finger that is still moving the player.
    const heldDirections = new Map();
    const updateDirection = () => {
      let x=0,y=0;
      for (const direction of heldDirections.values()) {
        x+=direction.x;y+=direction.y;
      }
      this.mobile.set(Math.sign(x),Math.sign(y));
    };
    const bind = (o,x,y) => {
      o.on("pointerdown",pointer=>{
        heldDirections.set(pointer.id,{x,y});
        updateDirection();
      });
      o.on("pointerup",pointer=>{
        heldDirections.delete(pointer.id);
        updateDirection();
      });
      o.on("pointerout",pointer=>{
        heldDirections.delete(pointer.id);
        updateDirection();
      });
    };

    bind(L,-1,0); bind(R,1,0); bind(U,0,-1); bind(D,0,1);
    A.on("pointerdown",()=>this.action());
    this.input.on("pointerup",pointer=>{
      heldDirections.delete(pointer.id);
      updateDirection();
    });
  }

  update() {
    // The D-pad would cover the portrait during PixelSearch and other dialogue.
    const canWalk = WALK_PHASES.has(this.phase)
      && this.control && !this.dialogue && !this.notice.visible;
    if (this._dpadShown!==canWalk) {
      this._dpadShown=canWalk;
      this.directionControls.forEach(button=>button.setVisible(canWalk));
    }
    if (!canWalk) this.mobile.set(0,0);

    if (!WALK_PHASES.has(this.phase)) {
      this.player.setVelocity(0);
      return;
    }

    if (!this.control || this.dialogue || this.notice.visible) {
      this.player.setVelocity(0);
      return;
    }

    let dx=0,dy=0;
    if (this.cursors.left.isDown || this.keys.A.isDown) dx--;
    if (this.cursors.right.isDown || this.keys.D.isDown) dx++;
    if (this.cursors.up.isDown || this.keys.W.isDown) dy--;
    if (this.cursors.down.isDown || this.keys.S.isDown) dy++;

    if (!dx && !dy && this.mobile.lengthSq()) {
      dx=this.mobile.x; dy=this.mobile.y;
    }

    const v = (this._moveVec||(this._moveVec=new Phaser.Math.Vector2())).set(dx,dy);
    if (v.lengthSq()) v.normalize().scale(this.speed);
    this.player.setVelocity(v.x,v.y);
    if (this.autoDoor(v)) return;

    // Top-down RPG layering:
    // the player's sprite is drawn above nearby furniture/props while the
    // lower-body physics box handles actual floor clearance.
    const activeLayer = this.locations.get(this.currentLocation)?.layer();
    if (activeLayer && this.player && activeLayer.exists(this.player)) {
      activeLayer.bringToTop(this.player);
    }

    // Keep the visible character out of the upper wall without making
    // the entire head part of the furniture collision box.
    const inApartment=["opening","apartment2","apartment3"].includes(this.phase);
    // The doorway is reachable even before the street is unlocked. Previously the
    // closer top limit only applied after townUnlocked, which created the hard stop
    // several tiles below the door during the opening apartment scene.
    const atApartmentDoor=inApartment && Math.abs(this.player.x-265)<=18;
    const atWallPicture=inApartment && this.player.x>=105 && this.player.x<=210;
    const topLimit=(atApartmentDoor || atWallPicture) ? 72 : 87;
    if (this.player.y < topLimit) {
      this.player.y = topLimit;
      if (this.player.body.velocity.y < 0) this.player.body.velocity.y = 0;
    }

    // Before the street is unlocked, trying to walk through the apartment door
    // repeats the hallway remark. It re-arms after the player backs away, so the
    // line does not instantly retrigger when the dialogue box is dismissed.
    if (inApartment && !this.townUnlocked
        && (v.y>=0 || Math.abs(this.player.x-265)>25 || this.player.y>98)) {
      // Re-arm after the player releases Up (or backs away), so another distinct
      // attempt at the doorway can play the same remark again.
      this.doorRemarkArmed=true;
    }
    if (inApartment && !this.townUnlocked && this.doorRemarkArmed
        && v.y<0 && Math.abs(this.player.x-265)<=18 && this.player.y<=78) {
      this.doorRemarkArmed=false;
      this.say(LINES.core.update_1);
      return;
    }

    this.near = null;
    let best = 999;

    const sceneItems = this.locations.get(this.currentLocation)?.items?.() || [];
    for (const obj of sceneItems) {
      if (!obj || !obj.active || !obj.visible) continue;
      const kind = obj.getData("kind");
      if (DOOR_KINDS.has(kind)) continue;
      // The chair is used from its left or right edge, never from behind.
      if (kind==="buyerChair" && (this.realtorStage!==0 || !this.canUseConsultChair(obj))) continue;
      if (kind==="laptop" && (Math.abs(this.player.y-176)>12 ||
          Math.abs(this.player.x-413)<18 || Math.abs(this.player.x-413)>38)) continue;
      const spotX = obj.getData("interactX"), spotY = obj.getData("interactY");
      const bounds=obj.getData("interactBounds") || {
        x:obj.x,y:obj.y,w:obj.displayWidth||0,h:obj.displayHeight||0
      };
      const d = spotX!==undefined && spotY!==undefined
        ? Phaser.Math.Distance.Between(this.player.x,this.player.y,spotX,spotY)
        : Math.hypot(
          Math.max(0,Math.abs(this.player.x-bounds.x)-bounds.w/2),
          Math.max(0,Math.abs(this.player.y-bounds.y)-bounds.h/2));
      const radius=obj.getData("interactionMargin") || (spotX!==undefined ? 25 : 18);
      if (d < radius && d < best) {
        best = d;
        this.near = obj;
      }
    }

    if (this.near) {
      this.prompt.setPosition(
        Phaser.Math.Clamp(this.player.x,65,415),
        Math.max(36,this.player.y-28)).setVisible(true);
    } else this.prompt.setVisible(false);
    this.spark.setVisible(false);
  }

  autoDoor(velocity) {
    if (this.time.now<this.doorCooldownUntil || !this.townUnlocked) return false;
    let destination=null;
    if (this.phase==="town") {
      if (velocity.y<0) {
        if (Math.abs(this.player.x-117)<=13 && this.player.y<=169) destination="apartment";
        else if (Math.abs(this.player.x-362)<=13 && this.player.y<=169) destination="broker";
        if (destination) this.travel(destination);
      }
      // The city does not become relevant until the preapproval letter is in hand.
      if (!destination && this.officeStage>=7 && velocity.x>0 && this.player.x>=445 && this.player.y>=165) {
        this.showDowntown("town");
        destination="downtown";
      }
    } else if ((this.phase==="apartment2" || this.phase==="apartment3")
        && velocity.y<0 && Math.abs(this.player.x-265)<=13 && this.player.y<=90) {
      this.showTown("apartment"); destination="street";
    } else if (this.phase==="office" && velocity.y>0
        && Math.abs(this.player.x-240)<=19 && this.player.y>=227) {
      this.showTown("broker"); destination="street";
    } else if (this.phase==="downtown") {
      if (velocity.x<0 && this.player.x<=24 && this.player.y>=165) {
        this.showTown("downtown");
        destination="town";
      } else if (this.closingStage>=2 && velocity.x>0
          && this.player.x>=445 && this.player.y>=165) {
        this.showClosingStreet("downtown");
        destination="closingStreet";
      } else if (velocity.y<0 && Math.abs(this.player.x-272)<=17 && this.player.y<=157) {
        this.enterRealtorOffice();
        destination="realtorOffice";
      }
    } else if (this.phase==="realtorOffice" && velocity.y>0
        && Math.abs(this.player.x-240)<=20 && this.player.y>=227) {
      this.showDowntown("realtor");
      destination="downtown";
      if (this.realtorStage>=2 && !this.teamChatSeen) {
        this.teamChatSeen=true;
        this.time.delayedCall(250,()=>this.deployAgentToCar());
      }
    } else if (this.phase==="showingStreet" && velocity.y<0
        && Math.abs(this.player.x-240)<=17 && this.player.y<=177) {
      this.enterShowingHome(this.currentStop); destination="showingEnter";
    } else if (this.phase==="showingHome" && velocity.y>0
        && Math.abs(this.player.x-240)<=21 && this.player.y>=225) {
      if (this.showingAgentExited[this.currentHome]) {
        this.showShowingStreet(this.currentHome);
        destination="showingStreet";
      } else {
        this.leadShowingAgentOutside(this.currentHome);
        destination="showingExit";
      }
    } else if (this.phase==="closingStreet") {
      if (velocity.x<0 && this.player.x<=24 && this.player.y>=165) {
        this.showDowntown("closing");
        destination="downtown";
      } else if (velocity.y<0 && Math.abs(this.player.x-240)<=17 && this.player.y<=169) {
        this.enterClosingRoom();
        destination="closingRoom";
      }
    } else if (this.phase==="closingRoom" && velocity.y>0
        && Math.abs(this.player.x-240)<=21 && this.player.y>=227) {
      this.showClosingStreet("room");
      destination="closingStreet";
    }
    if (destination) {
      this.doorCooldownUntil=this.time.now+600;
      return true;
    }
    return false;
  }

  action() {
    if (this.phase==="computerSeating") return;
    if (this.phase==="questComplete") {
      this.questCompleteUI.setVisible(false);
      this.phase="office";
      this.objective.setText(SCRIPT.core.action_text_1);
      return;
    }

    if (this.phase==="loanOptions") {
      if (this.planChoice===0) {
        this.planChoice=1;
        this.renderPlanChoice();
        this.planHint.setText(SCRIPT.core.action_text_2);
      } else {
        this.planUI.setVisible(false);
        this.beginQualificationReview();
      }
      return;
    }

    if (this.phase==="loanBoard") {
      this.nextLoanPage();
      return;
    }

    if (this.phase==="showingChoice") {
      this.chooseShowingFavorite();
      return;
    }

    if (this.phase==="offerReview") {
      this.advanceOfferView();
      return;
    }

    if (this.phase==="offerDecision") {
      this.confirmOfferDecision();
      return;
    }

    if (this.phase==="storyCard") {
      this.advanceStoryCard();
      return;
    }

    if (this.phase==="conditionMenu") {
      this.chooseConditionItem();
      return;
    }

    if (this.phase==="homeowner") {
      window.location.reload();
      return;
    }

    if (this.phase==="tourReady") {
      this.confirmTourReady();
      return;
    }

    if (this.phase==="teamChat") {
      this.teamChatUI.setVisible(false);
      this.phase="downtown";
      this.control=true;
      this.objective.setText(SCRIPT.core.action_text_3);
      this.say(LINES.core.action_1,()=>
        this.deployAgentToCar());
      return;
    }

    if (this.phase==="title") {
      this.beginScene2();
      return;
    }

    if (this.phase==="internet") {
      this.reactToSearchResult();
      return;
    }

    if (this.phase==="webReaction") {
      this.advanceAfterReaction();
      return;
    }

    if (this.phase==="daveNotice") {
      this.daveNotice.setVisible(false);
      this.phone.setVisible(true);
      this.phase="dave";
      return;
    }

    if (this.phase==="dave") {
      this.phone.setVisible(false);
      this.phase="overloadPending";
      this.time.delayedCall(250,()=>this.finishInternet());
      return;
    }

    if (this.phase==="overload") {
      this.finishOverload();
      return;
    }

    if (this.notice.visible) {
      this.notice.setVisible(false);
      this.noticeRead = true;
      this.say(LINES.core.action_2,()=>this.crash());
      return;
    }

    if (this.dialogue) {
      this.closeDialogue();
      return;
    }

    if (!this.control || ["qualificationReview","showingEnter","showingExit"].includes(this.phase)) return;

    if (!this.near) return;

    const kind = this.near.getData("kind");

    if (kind==="mail" && this.eventStarted && !this.noticeRead) {
      this.pickUpMailAndShowNotice();
      return;
    }

    // The apartment doorway can also be used with the action button. Before the
    // street is unlocked it repeats the same character remark; afterward it exits.
    if (kind==="door") {
      if (this.townUnlocked && (this.phase==="apartment2" || this.phase==="apartment3")) {
        this.showTown("apartment");
        this.doorCooldownUntil=this.time.now+600;
      } else {
        this.doorRemarkArmed=false;
        this.say(LINES.core.action_3);
      }
      return;
    }

    if (this.phase==="opening" && kind==="laptop") {
      this.seatAtComputer(()=>this.say(LINES.core.action_4));
      return;
    }

    if (this.phase==="apartment2" && kind==="laptop") {
      this.seatAtComputer(()=>{
        if (this.townUnlocked) this.say(LINES.core.action_5);
        else this.openInternet();
      });
      return;
    }

    if (this.phase==="office") {
      if (kind==="officer") { this.talkToOfficer(); return; }
      if (kind==="printer" && this.underwritingStage===1) { this.readUnderwritingRequest(); return; }
      if (kind==="printer" && this.underwritingStage===4) { this.readAppraisal(); return; }
      if (kind==="printer" && this.closingStage===1) { this.readClosingDisclosure(); return; }
      if (kind==="board" && this.officeStage===1) { this.startLoanBoard(); return; }
      if (kind==="printer" && this.officeStage===2) { this.printChecklist(); return; }
      if (kind==="printer" && this.officeStage===6) { this.collectPreapproval(); return; }
    }
    if (this.phase==="apartment3") {
      if (kind==="document") { this.collectDocument(this.near.getData("docKey")); return; }
      if (kind==="laptop") {
        this.seatAtComputer(()=>{
          if (this.underwritingStage===2) this.showConditionMenu();
          else if (this.officeStage===3 && !this.documents.statement) this.collectDocument("statement");
          else this.say(LINES.core.action_6);
        });
        return;
      }
    }
    if (this.phase==="closingRoom") {
      if (kind==="closingAgent") {
        this.say(LINES.core.action_7);
        return;
      }
      if (kind==="closingPapers") { this.reviewClosingDay(); return; }
      if (kind==="closingHost") {
        this.say(LINES.core.action_8);
        return;
      }
      if (kind==="closingOfficer") {
        this.say(LINES.core.action_9);
        return;
      }
    }
    if (this.phase==="downtown") {
      if (kind==="discountDoor") {
        this.say(LINES.core.action_10,()=>
          this.say(LINES.core.action_11));
        return;
      }
      if (kind==="realtorCar") {
        if (this.realtorStage>=2) this.askTourReady();
        else this.say(LINES.core.action_12);
        return;
      }
      if (kind==="tourAgent") { this.askTourReady(); return; }
    }
    if (this.phase==="realtorOffice" && kind==="realtor") {
      this.talkToRealtor();
      return;
    }
    if (this.phase==="realtorOffice" && kind==="buyerChair") {
      this.seatBuyerAndAgent(this.near);
      return;
    }
    if (this.phase==="downtown" && kind==="cousinDave") {
      if (this.realtorStage>=2) this.say(LINES.core.action_13,()=>
        this.say(LINES.core.action_14));
      else this.say(LINES.core.action_15,()=>
        this.say(LINES.core.action_16));
      return;
    }
    if (this.phase==="showingStreet") {
      if (kind==="showingAgent") { this.talkShowingAgent(); return; }
      if (kind==="showingCar") { this.boardShowingCar(); return; }
    }
    if (this.phase==="showingHome" && kind==="homeClue") {
      this.inspectShowingClue(this.near.getData("clueIndex"));
      return;
    }
    if (this.phase==="showingHome" && kind==="homeAgent") {
      this.inspectShowingClue(1);
      return;
    }
    this.say(this.near.getData("text"));
  }

  say(text,cb=null,withPortrait=true) {
    this.dialogue = true;
    this._cb = cb;
    this.box.setVisible(true);
    this.portrait.setVisible(withPortrait);
    const loSpeaking=withPortrait && text.startsWith("LO:");
    const agentSpeaking=withPortrait && text.startsWith("AGENT:");
    this.face.setVisible(withPortrait && !loSpeaking && !agentSpeaking);
    this.loAvatar.setVisible(loSpeaking);
    this.agentAvatar.setVisible(agentSpeaking);
    this.text.setPosition(withPortrait ? 178 : 135,197);
    this.text.setWordWrapWidth(withPortrait ? 230 : 270);
    // Page long dialogue inside the box; each page retains its speaker portrait.
    const wrapped=this.text.getWrappedText(text);
    if(wrapped.length>3) {
      const speaker=(text.match(/^(LO|AGENT|ME|COUSIN DAVE):\s*/) || [""])[0];
      this._cb=()=>this.say(speaker+wrapped.slice(3).join(" "),cb,withPortrait);
      text=wrapped.slice(0,3).join("\n");
    }
    this.text.setText(text+"\n[E / !]").setVisible(true);
    this.spark.setVisible(false);
    this.prompt.setVisible(false);
  }

  closeDialogue() {
    this.dialogue = false;
    this.box.setVisible(false);
    this.portrait.setVisible(false);
    this.face.setVisible(false);
    this.loAvatar.setVisible(false);
    this.agentAvatar.setVisible(false);
    this.text.setVisible(false);
    // End the celebration at the exact moment its announcement is dismissed.
    if (this.clearCelebrationUI && this.clearCelebrationUI.visible)
      this.stopClearToCloseCelebration();

    const cb = this._cb;
    this._cb = null;
    if (cb) this.time.delayedCall(100,()=>{
      cb();
      if (!this.dialogue && this.sitting) this.standFromComputer();
      this.maybeShowStatementHint();
    });
    else {
      if (this.sitting) this.standFromComputer();
      this.maybeShowStatementHint();
    }
  }

  showTitle() {
    this.control = false;
    this.phase = "title";
    this.hideApartmentForOverlay();
    this.touchUI.setVisible(true);
    this.title.setVisible(true);
  }

  travel(destination) {
    if (this.phase!=="town") return;

    this.townDoorGlow.setVisible(false);

    this.near = null;
    this.prompt.setVisible(false);
    this.spark.setVisible(false);
    this.touchUI.setVisible(true);
    this.objective.setVisible(true);
    this.control = true;

    if (destination==="broker") {
      this.switchLocation("office");

      this.setWhiteboardVisible(this.officeStage>=1 && this.whiteboardDeliveryDone);

      this.player.setPosition(240,215).setVelocity(0);

      this.phase = "office";
      this.objective.setText(this.officeStage===0
        ? SCRIPT.core.travel_text_1
        : this.officeStage===1 ? SCRIPT.core.travel_text_2
        : this.officeStage===2 ? SCRIPT.core.travel_text_3
        : this.officeStage===3 ? (this.allDocumentsCollected()
          ? SCRIPT.core.travel_text_4
          : SCRIPT.core.travel_text_5)
        : this.officeStage===4 ? SCRIPT.core.travel_text_6
        : this.officeStage===5 ? SCRIPT.core.travel_text_7
        : this.officeStage===6 ? SCRIPT.core.travel_text_8
        : this.officeStage>=7
          ? this.lateQuestObjective("office")
          : SCRIPT.core.travel_text_9);
    } else {
      this.switchLocation("apartment");

      // Re-enter directly at the inside edge of the apartment doorway. The door
      // cooldown prevents a held Up key from immediately sending the player outside.
      this.player.setPosition(265,76).setVelocity(0);

      this.phase = this.officeStage>=3 ? "apartment3" : "apartment2";
      this.setDocumentSceneVisible(this.officeStage===3);
      if (this.officeStage===3) {
        this.updateDocumentObjective();
        this.scheduleStatementHint();
        if (!this.documentHuntStarted) {
          this.documentHuntStarted=true;
          this.say(LINES.core.travel_1);
        }
      } else this.objective.setText(this.officeStage>=4
        ? (this.officeStage===4 ? SCRIPT.core.travel_text_10 : this.officeStage===5 ? SCRIPT.core.travel_text_11 : this.officeStage===6 ? SCRIPT.core.travel_text_12 : this.lateQuestObjective("apartment"))
        : SCRIPT.core.travel_text_13);
    }
  }
}
