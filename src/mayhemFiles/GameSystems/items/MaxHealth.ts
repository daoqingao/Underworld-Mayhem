import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import BattlerAI from "../../AI/BattlerAI";
import Item from "./Item";

export default class MaxHealth extends Item {
  set alpha(a: number) {
    throw new Error("Method not implemented.");
  }
  get alpha(): number {
    throw new Error("Method not implemented.");
  }
  set scaleX(value: number) {
    throw new Error("Method not implemented.");
  }
  set scaleY(value: number) {
    throw new Error("Method not implemented.");
  }
  use(user: GameNode): void {
    (<BattlerAI>user._ai).health += 1;
  }
}
