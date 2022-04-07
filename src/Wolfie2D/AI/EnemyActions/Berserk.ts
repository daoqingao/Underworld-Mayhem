import StateMachineGoapAI from "../../../Wolfie2D/AI/StateMachineGoapAI";
import GoapAction from "../../../Wolfie2D/DataTypes/Interfaces/GoapAction";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Emitter from "../../../Wolfie2D/Events/Emitter";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import EnemyAI from "../EnemyAI";
import Timer from "../../../Wolfie2D/Timing/Timer";


// HOMEWORK 4 - TODO
/**
 * Implement berserk action so that the enemy gains 1.5x speed, 2x damage, and has a 2x lower cooldown on attacking.
 * Note that you'll also need to manage how enemies use this action in the initializeEnemies method in hw4_scene.
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

        if (this.checkPreconditions(statuses)){
            console.log("enemy going berserk");
            let enemy = <EnemyAI> actor;
            let newTime = enemy.weapon.type.cooldown;
            enemy.weapon.cooldownTimer = new Timer(newTime*0.5); //2x cdr //TODO: to show obivous berserk// chnage this later to 0.5
            enemy.weapon.type.damage = enemy.weapon.type.damage*2; //2x dmg
            enemy.speed = enemy.speed*2; //2x ms
            // enemy.currentStatus.filter(function (e){
            //     return e!==hw4_Statuses.CAN_BERSERK
            // });

            return this.effects;
        }

        return null;
    }

    updateCost(options: Record<string, number>): void {}

    toString(): string {
        return "(Berserk)";
    }

}