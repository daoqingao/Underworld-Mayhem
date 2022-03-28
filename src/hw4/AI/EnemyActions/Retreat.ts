import StateMachineGoapAI from "../../../Wolfie2D/AI/StateMachineGoapAI";
import GoapAction from "../../../Wolfie2D/DataTypes/Interfaces/GoapAction";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Emitter from "../../../Wolfie2D/Events/Emitter";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import NavigationPath from "../../../Wolfie2D/Pathfinding/NavigationPath";
import { hw4_Names } from "../../hw4_constants";
import EnemyAI from "../EnemyAI";

export default class Retreat extends GoapAction {
    private retreatDistance: number;

    private path: NavigationPath;
    protected emitter: Emitter;

    constructor(cost: number, preconditions: Array<string>, effects: Array<string>, options?: Record<string, any>) {
        super();
        this.cost = cost;
        this.preconditions = preconditions;
        this.loopAction = true;
        this.effects = effects;
        this.retreatDistance = options.retreatDistance;
    }

    // HOMEWORK 4 - TODO
    /**
     * Implement retreat action so that the enemy constantly moves away from the player until they get past the retreatDistance. If they succesfully move 
     * far away enough, they heal back to their max health. The low health status should NOT be removed, once an enemy is low health, that remains
     * as a status signaling the enemy has gotten below a certain health once.
     * 
     * Look at other actions for hints as to how this can be implemented, and know that there's a function in Active.ts that is needed to fully implement
     * this. You'll know this action if working correctly if a retreating enemy changes their retreat direction if the player moves around, trying to get
     * as far away as possible.
     */
    performAction(statuses: Array<string>, actor: StateMachineGoapAI, deltaT: number, target?: StateMachineGoapAI): Array<string> {
        return null;
    }

    updateCost(options: Record<string, number>): void {}

    toString(): string {
        return "(Retreat)";
    }

}