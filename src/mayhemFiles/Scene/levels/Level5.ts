import mainScene from "../MainScene";

export default class Level5 extends mainScene {
  loadScene() {
    this.load.audio("bgm", "mayhemAssets/music/bgm.mp3");
    this.load.tilemap("level", "mayhemAssets/tilemaps/level5.json");
    this.load.spritesheet("enemy", "mayhemAssets/spritesheets/gemstone.json");
    this.load.image("checkpoint", "mayhemAssets/sprites/checkpoint2.png");
    super.mainLoadScene();
  }
  unloadScene() {}
  startScene() {
    this.nextLevel = Level5;
    super.mainStartScene();
  }
  updateScene(deltaT: number) {
    super.updateScene(deltaT);
  }
}
