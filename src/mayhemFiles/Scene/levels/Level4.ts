import mainScene from "../MainScene";
export default class Level4 extends mainScene {
  loadScene() {
    this.load.audio("bgm", "mayhemAssets/music/bgm.mp3");
    this.load.tilemap("level", "mayhemAssets/tilemaps/level4.json");
    this.load.spritesheet("enemy", "mayhemAssets/spritesheets/slime.json");
    this.load.image("checkpoint", "mayhemAssets/sprites/checkpoint2.png");

    super.mainLoadScene();
  }
  unloadScene() {}
  updateScene(deltaT: number) {
    super.updateScene(deltaT);
  }
  startScene() {
    this.nextLevel = Level4;
    super.mainStartScene();
  }
}
