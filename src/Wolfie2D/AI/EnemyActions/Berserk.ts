import StateMachineGoapAI from "../StateMachineGoapAI";
import GoapAction from "../../DataTypes/Interfaces/GoapAction";
import Vec2 from "../../DataTypes/Vec2";
import Emitter from "../../Events/Emitter";
import GameNode from "../../Nodes/GameNode";
import EnemyAI from "../EnemyAI";

// HOMEWORK 4 - TODO
/**
 * Implement berserk action so that the enemy gains 1.5x speed, 2x damage, and has a 2x lower cooldown on attacking.
 * Note that you'll also need to manage how enemies use this action in the initializeEnemies method in mainScene.
 */
export default class Berserk extends GoapAction {
    protected emitter: Emitter;
    
    constructor(cost: number, preconditions: Array<string>, effects: Array<string>, options?: Record<string, any>) {
        super();
        this.cost = cost;
        this.preconditions = preconditions;
        this.effects = effects;
    }

    performAction(statuses: Array<string>, actor: StateMachineGoapAI, deltaT: number, target?: StateMachineGoapAI): Array<string> {
        return null;
    }

    updateCost(options: Record<string, number>): void {}
    
    toString(): string {
        return "(Berserk)";
    }
    
}