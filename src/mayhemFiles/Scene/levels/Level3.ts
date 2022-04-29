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
import Level4 from "./Level4";

export default class Level3 extends mainScene{
    loadScene() {

    }
    updateScene(deltaT: number) {
        super.updateScene(deltaT);
    }
}