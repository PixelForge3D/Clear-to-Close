// Game config and startup. Add new scenes to the list only if you later convert locations to real Phaser Scenes.
new Phaser.Game({
  type:Phaser.AUTO,
  parent:"game",
  width:480,
  height:270,
  pixelArt:true,
  roundPixels:true,
  physics:{
    default:"arcade",
    arcade:{gravity:{y:0},debug:false}
  },
  scale:{
    mode:Phaser.Scale.FIT,
    autoCenter:Phaser.Scale.CENTER_BOTH,
    width:480,
    height:270
  },
  scene:[ClearToClose]
});
