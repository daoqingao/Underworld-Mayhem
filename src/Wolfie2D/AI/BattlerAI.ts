import AI from "../DataTypes/Interfaces/AI";
import GameEvent from "../Events/GameEvent";
import GameNode from "../Nodes/GameNode";

export default interface BattlerAI extends AI {
    owner: GameNode;

    health: number;

    damage: (damage: number) => void;
}