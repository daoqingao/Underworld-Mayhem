import mainScene from "../MainScene";
import Level6 from "./Level6";

export default class Level5 extends mainScene {


  //regular circle cave enemies
  changeEnemySpawnType(data:any):any{
    data.type = "caveEnemy"
    return data
  }

  loadScene() {
    this.load.audio("bgm", "mayhemAssets/music/bgm.mp3");
    this.load.tilemap("level", "mayhemAssets/tilemaps/level5.json");
    this.load.image("checkpoint", "mayhemAssets/sprites/checkpoint5.png");
    super.mainLoadScene();
  }
  unloadScene() {}
  startScene() {
    this.currentLevel = "5";
    this.nextLevel = Level6;
    super.mainStartScene();
  }
  updateScene(deltaT: number) {
    super.updateScene(deltaT);
  }
}
