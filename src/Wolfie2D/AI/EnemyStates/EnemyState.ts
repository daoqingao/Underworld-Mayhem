import State from "../../DataTypes/State/State";
import GameNode from "../../Nodes/GameNode";
import EnemyAI from "../../../mayhemFiles/AI/EnemyAI";

export default abstract class EnemyState extends State {
    protected parent: EnemyAI;
    protected owner: GameNode;

    constructor(parent: EnemyAI, owner: GameNode){
      super(parent);
      this.owner = owner;
    }
}