import mainScene from "../MainScene";
import Level4 from "./Level4";
export default class Level3 extends mainScene {

  //SLIME SLOW with WATER level
  changeEnemySpawnType(data:any):any{
    data.type = "jellyfish"
    return data
  }
  loadScene() {
    this.load.audio("bgm", "mayhemAssets/music/bgm.mp3");
    this.load.tilemap("level", "mayhemAssets/tilemaps/level3.json");
    this.load.image("checkpoint", "mayhemAssets/sprites/checkpoint3.png");

    super.mainLoadScene();
  }
  unloadScene() {}
  updateScene(deltaT: number) {
    super.updateScene(deltaT);
  }
  startScene() {
    this.currentLevel = "3";
    this.nextLevel = Level4;
    super.mainStartScene();
  }
}
