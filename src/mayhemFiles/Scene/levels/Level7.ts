import mainScene from "../MainScene";
import Level8 from "./Level8";

export default class Level7 extends mainScene{
    changeEnemySpawnType(data:any):any{
        let enemySpawnType = (this.totalEnemiesKilled % 4);
        console.log(enemySpawnType)
        if(enemySpawnType === 1){
            data.type = "imp"
        }
        else if(enemySpawnType === 2){
            data.type = "slime"

        }
        else if(enemySpawnType === 3) {
            data.type = "gemstone"

        }
        else{
            data.type = "caveEnemy"
        }
        return data
    }

    loadScene() {
        this.load.audio("bgm", "mayhemAssets/music/bgm.mp3");
        this.load.tilemap("level", "mayhemAssets/tilemaps/level5.json");
        this.load.image("checkpoint", "mayhemAssets/sprites/checkpoint2.png");
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