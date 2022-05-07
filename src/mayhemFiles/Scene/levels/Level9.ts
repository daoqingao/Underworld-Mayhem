import mainScene from "../MainScene";
import {GameEventType} from "../../../Wolfie2D/Events/GameEventType";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import OrthogonalTilemap from "../../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import BattleManager from "../../GameSystems/BattleManager";
import BattlerAI from "../../AI/BattlerAI";
import PlayerController from "../../AI/PlayerController";
import Label from "../../../Wolfie2D/Nodes/UIElements/Label";
import {UIElementType} from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Color from "../../../Wolfie2D/Utils/Color";
import Button from "../../../Wolfie2D/Nodes/UIElements/Button";
import Won from "../Won";

export default class Level9 extends mainScene{
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
        this.load.tilemap("level", "mayhemAssets/tilemaps/level9.json");
        // this.load.spritesheet("enemy", "mayhemAssets/spritesheets/cave.json");
        this.load.image("checkpoint", "mayhemAssets/sprites/checkpoint2.png");
        super.mainLoadScene();
    }
    unloadScene() {}
    startScene() {
        this.currentLevel = "9";
        this.nextLevel = Level9;
        super.mainStartScene();
    }
    updateScene(deltaT: number) {
        super.updateScene(deltaT);
    }
}