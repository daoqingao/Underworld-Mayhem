import mainScene from "../MainScene";
export default class Level3 extends mainScene {
  loadScene() {
    this.load.audio("bgm", "mayhemAssets/music/bgm.mp3");
    this.load.tilemap("level", "mayhemAssets/tilemaps/level4.json");
    this.load.spritesheet("imp", "mayhemAssets/spritesheets/slime.json");
    this.load.image("checkpoint", "mayhemAssets/sprites/checkpoint2.png");

    super.mainLoadScene();
  }
  unloadScene() {}
  updateScene(deltaT: number) {
    super.updateScene(deltaT);
  }
  startScene() {
    this.nextLevel = Level3;
    super.mainStartScene();
  }
}
