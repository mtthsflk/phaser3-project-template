export default {
  type: Phaser.AUTO,
  width: 500,
  height: 200,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: "arcade",
    arcade: {
      // options go here
    }
  }
};