import StateMachineGoapAI from "../StateMachineGoapAI";
import GoapAction from "../../DataTypes/Interfaces/GoapAction";
import Vec2 from "../../DataTypes/Vec2";
import Emitter from "../../Events/Emitter";
import NavigationPath from "../../Pathfinding/NavigationPath";
import EnemyAI from "../../../mayhemFiles/AI/EnemyAI";
import BattlerAI from "../../../mayhemFiles/AI/BattlerAI";

export default class Move extends GoapAction {
  private inRange: number;

  private path: NavigationPath;
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
    this.loopAction = true;
    this.inRange = options.inRange;
  }

  performAction(
    statuses: Array<string>,
    actor: StateMachineGoapAI,
    deltaT: number,
    target?: StateMachineGoapAI
  ): Array<string> {
    if (this.checkPreconditions(statuses)) {
      //Check distance from player
      let enemy = <EnemyAI>actor;
      let playerPos = enemy.lastPlayerPos;
      let distance = enemy.owner.position.distanceTo(playerPos);
      //If close enough, we've moved far enough and this loop action is done
      if (distance <= this.inRange) {
        return this.effects;
      }
      this.path = enemy.path;
      //Otherwise move on path
      var direction = this.path.getMoveDirection(enemy.owner);
      if  (enemy.health >=0) {
        if (direction.x > 0) {
          enemy.owner.animation.playIfNotAlready("run_right", true);
        } else {
          enemy.owner.animation.playIfNotAlready("run_left", true);
        }
      }
      enemy.owner.moveOnPath(enemy.speed * deltaT, this.path);
      return null;
    }
    return this.effects;
  }

  updateCost(options: Record<string, number>): void {}

  toString(): string {
    return "(Move)";
  }
}
