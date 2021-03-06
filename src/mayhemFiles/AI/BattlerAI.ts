import AI from "../../Wolfie2D/DataTypes/Interfaces/AI";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import GameNode from "../../Wolfie2D/Nodes/GameNode";

export default interface BattlerAI extends AI {
  owner: GameNode;

  health: number;

  maxHealth: number;

  damage: (damage: number, enemyType?:any) => void;
}
