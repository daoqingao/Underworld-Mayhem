import mainScene from "../MainScene";
import Level5 from "./Level5";
export default class Level4 extends mainScene {

  //regular gemstone level
  changeEnemySpawnType(data:any):any{
    data.type = "gemstone"
    return data
  }
  loadScene() {
    this.load.audio("bgm", "mayhemAssets/music/bgm.mp3");
    this.load.tilemap("level", "mayhemAssets/tilemaps/level4.json");
    this.load.image("checkpoint", "mayhemAssets/sprites/checkpoint2.png");

    super.mainLoadScene();
  }
  unloadScene() {}
  updateScene(deltaT: number) {
    super.updateScene(deltaT);
  }
  startScene() {
    this.currentLevel = "4";
    this.nextLevel = Level5;
    super.mainStartScene();
  }
}
