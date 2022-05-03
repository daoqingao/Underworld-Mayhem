import mainScene from "../MainScene";
import Level2 from "./Level2";

export default class Level1 extends mainScene {
  loadScene() {
    this.load.audio("bgm", "mayhemAssets/music/bgm.mp3");
    this.load.spritesheet("enemy", "mayhemAssets/spritesheets/imp.json");
    this.load.tilemap("level", "mayhemAssets/tilemaps/mayhemTileJson.json");
    this.load.image("checkpoint", "mayhemAssets/sprites/checkpoint1.png");
    super.mainLoadScene();
  }
  unloadScene() {}
  startScene() {
    this.nextLevel = Level2;
    super.mainStartScene();
  }
  updateScene(deltaT: number) {
    super.updateScene(deltaT);
  }
}
