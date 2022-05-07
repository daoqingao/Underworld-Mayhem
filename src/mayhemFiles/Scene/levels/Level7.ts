import mainScene from "../MainScene";
import Level8 from "./Level8";

export default class Level7 extends mainScene{
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
        this.load.tilemap("level", "mayhemAssets/tilemaps/level7.json");
        this.load.image("checkpoint", "mayhemAssets/sprites/checkpoint7.png");
        super.mainLoadScene();
    }
    unloadScene() {}
    startScene() {
        this.currentLevel = "7";
        this.nextLevel = Level8;
        super.mainStartScene();
    }
    updateScene(deltaT: number) {
        super.updateScene(deltaT);
    }
}