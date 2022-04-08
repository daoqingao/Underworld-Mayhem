import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import BattlerAI from "../../AI/BattlerAI";
import Item from "./Item";

export default class Checkpoint extends Item {
  use(user: GameNode, ...args: any): void {
    throw new Error("Method not implemented.");
  }
}
