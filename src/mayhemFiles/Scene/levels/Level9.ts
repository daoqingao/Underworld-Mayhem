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
        data.type = "devil";
        return data
    }

    loadScene() {
        this.load.audio("bgm", "mayhemAssets/music/bgm.mp3");
        this.load.tilemap("level", "mayhemAssets/tilemaps/level9.json");
        // this.load.spritesheet("enemy", "mayhemAssets/spritesheets/cave.json");
        this.load.image("checkpoint", "mayhemAssets/sprites/checkpoint9.png");
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