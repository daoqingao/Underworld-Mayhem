import mainScene from "../MainScene";
import Level3 from "./Level3";

export default class Level2 extends mainScene {
  loadScene() {
    this.load.audio("bgm", "mayhemAssets/music/bgm.mp3");
    this.load.tilemap("level", "mayhemAssets/tilemaps/level2.json");
    this.load.spritesheet("imp", "mayhemAssets/spritesheets/slime.json");
    this.load.image("checkpoint", "mayhemAssets/sprites/checkpoint2.png");

    super.mainLoadScene();
  }
  unloadScene() {}
  startScene() {
    this.nextLevel = Level3;
    super.mainStartScene();
  }
  updateScene(deltaT: number) {
    super.updateScene(deltaT);
  }
}
