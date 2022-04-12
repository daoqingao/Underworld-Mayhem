import StateMachineGoapAI from "../StateMachineGoapAI";
import GoapAction from "../../DataTypes/Interfaces/GoapAction";
import Vec2 from "../../DataTypes/Vec2";
import Emitter from "../../Events/Emitter";
import GameNode from "../../Nodes/GameNode";
import EnemyAI from "../../../mayhemFiles/AI/EnemyAI";

export default class AttackAction extends GoapAction {
  protected emitter: Emitter;

  constructor(
    cost: number,
    preconditions: Array<string>,
    effects: Array<string>,
    options?: Record<string, any>
  ) {
    super();
    this.cost = cost;
    this.preconditions = preconditions;
    this.effects = effects;
  }

  performAction(
    statuses: Array<string>,
    actor: StateMachineGoapAI,
    deltaT: number,
    target?: StateMachineGoapAI
  ): Array<string> {
    //Check if preconditions are met for this action to be performed
    if (this.checkPreconditions(statuses)) {
      let enemy = <EnemyAI>actor;

      //If the player is out of sight, don't bother attacking
      if (enemy.getPlayerPosition() == null) {
        return null;
      }

      //Randomize attack direction, gives the enemy gun users stormtrooper aim
      let dir = enemy
        .getPlayerPosition()
        .clone()
        .sub(enemy.owner.position)
        .normalize();
      if (enemy.weapon.use(enemy.owner, "enemy", dir)) {
          // let dir = enemy.getPlayerPosition().clone().sub(enemy.owner.position).normalize();
          // enemy.owner.rotation = Vec2.UP.angleToCCW(dir);
      }

      return this.effects;
    }
    return null;
  }

  updateCost(options: Record<string, number>): void {}

  toString(): string {
    return "(AttackAction)";
  }
}
