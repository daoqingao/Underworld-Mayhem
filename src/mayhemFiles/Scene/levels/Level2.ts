import mainScene from "../MainScene";
import Level3 from "./Level3";

export default class Level2 extends mainScene {


  //regular slime level
  changeEnemySpawnType(data:any):any{
    data.type = "slime"
    return data
  }

  loadScene() {
    this.load.audio("bgm", "mayhemAssets/music/bgm.mp3");
    this.load.tilemap("level", "mayhemAssets/tilemaps/level2.json");
    this.load.image("checkpoint", "mayhemAssets/sprites/checkpoint2.png");

    super.mainLoadScene();
  }
  unloadScene() {}
  startScene() {
    this.currentLevel = "2";
    this.nextLevel = Level3;
    super.mainStartScene();
  }
  updateScene(deltaT: number) {
    super.updateScene(deltaT);
  }
}
