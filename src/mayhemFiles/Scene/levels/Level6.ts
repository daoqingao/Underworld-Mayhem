import mainScene from "../MainScene";
import Level7 from "./Level7";

export default class Level6 extends mainScene {

  //THIS IS where you left off, feel free to add enemy spawn types
  //at level 6 this is just a demo of how we can have multiple enemies be spawned together
  changeEnemySpawnType(data:any):any{
    let enemySpawnType = ((this.enemies.length + this.totalEnemiesKilled) % 5);
    if(enemySpawnType === 1){
      data.type = "imp"
    }
    else if(enemySpawnType === 2){
      data.type = "slime"

    }
    else if(enemySpawnType === 3) {
      data.type = "gemstone"

    }
    else if (enemySpawnType ===4){
      data.type = "jellyfish"
    }
    else{
      data.type = "caveEnemy"
    }
    return data
  }
  loadScene() {
    this.load.audio("bgm", "mayhemAssets/music/bgm.mp3");
    this.load.tilemap("level", "mayhemAssets/tilemaps/level6.json");
    this.load.image("checkpoint", "mayhemAssets/sprites/checkpoint6.png");
    super.mainLoadScene();
  }
  unloadScene() {}
  startScene() {
    this.currentLevel = "6";
    this.nextLevel = Level7;
    super.mainStartScene();
  }
  updateScene(deltaT: number) {
    super.updateScene(deltaT);
  }
}
