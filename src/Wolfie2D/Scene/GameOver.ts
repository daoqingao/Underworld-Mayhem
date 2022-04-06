import Vec2 from "../DataTypes/Vec2";
import Input from "../Input/Input";
import Label from "../Nodes/UIElements/Label";
import { UIElementType } from "../Nodes/UIElements/UIElementTypes";
import Scene from "./Scene";
import Color from "../Utils/Color";

export default class GameOver extends Scene {

    startScene() {
        const center = this.viewport.getCenter();

        this.addUILayer("primary");

        const gameOver = <Label>this.add.uiElement(UIElementType.LABEL, "primary", {position: new Vec2(center.x, center.y), text: "Game Over"});
        gameOver.textColor = Color.WHITE;
    }
}