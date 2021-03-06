import GoapActionPlanner from "../../Wolfie2D/AI/GoapActionPlanner";
import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import StateMachineGoapAI from "../../Wolfie2D/AI/StateMachineGoapAI";
import GoapAction from "../../Wolfie2D/DataTypes/Interfaces/GoapAction";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Stack from "../../Wolfie2D/DataTypes/Stack";
import State from "../../Wolfie2D/DataTypes/State/State";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import NavigationPath from "../../Wolfie2D/Pathfinding/NavigationPath";
import Weapon from "../GameSystems/items/Weapon";
import { hw4_Events, hw4_Names, hw4_Statuses } from "../../Wolfie2D/constants";
import BattlerAI from "./BattlerAI";
import Alert from "../../Wolfie2D/AI/EnemyStates/Alert";
import Active from "../../Wolfie2D/AI/EnemyStates/Active";
import Guard from "../../Wolfie2D/AI/EnemyStates/Guard";
import Patrol from "../../Wolfie2D/AI/EnemyStates/Patrol";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import Timer from "../../Wolfie2D/Timing/Timer";

export default class EnemyAI extends StateMachineGoapAI implements BattlerAI {
  /** The owner of this AI */
  owner: AnimatedSprite;

  /** The total possible amount of health this entity has */
  maxHealth: number;

  /** The current amount of health this entity has */
  health: number;

  /** The default movement speed of this AI */
  speed: number;

  /** The weapon this AI has */
  weapon: Weapon;

  /** A reference to the player object */
  player1: GameNode;

  /** A reference to the player object */
  player2: GameNode;

  // The current known position of the player
  playerPos: Vec2;

  // The last known position of the player
  lastPlayerPos: Vec2;

  // Attack range
  inRange: number;

  // Path to player
  path: NavigationPath;

  // Path away from player
  retreatPath: NavigationPath;

  enemyType: String;

  initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
    this.owner = owner;

    if (options.defaultMode === "guard") {
      // Guard mode
      this.addState(
        EnemyStates.DEFAULT,
        new Guard(this, owner, options.guardPosition)
      );
    } else {
      // Patrol mode
      this.addState(
        EnemyStates.DEFAULT,
        new Patrol(this, owner, options.patrolRoute)
      );
    }

    this.addState(EnemyStates.ALERT, new Alert(this, owner));
    this.addState(EnemyStates.TARGETING, new Active(this, owner));

    this.maxHealth = options.health;

    this.health = options.health;

    this.weapon = options.weapon;

    this.player1 = options.player1;

    this.inRange = options.inRange;

    this.speed = options.speed;

    this.goal = options.goal;

    this.currentStatus = options.status;

    this.possibleActions = options.actions;

    this.enemyType = options.enemyType;

    this.plan = new Stack<GoapAction>();

    this.planner = new GoapActionPlanner();

    // Initialize to the default state
    this.initialize(EnemyStates.DEFAULT);

    this.getPlayerPosition();
    this.receiver.subscribe(hw4_Events.ENEMY_DIED);
  }

  activate(options: Record<string, any>): void {}

  damage(damage: number): void {
    this.health -= damage;

    // If we're low enough, add Low Health status to enemy
    if (this.health <= Math.floor(this.maxHealth / 2)) {
      if (this.currentStatus.indexOf(hw4_Statuses.LOW_HEALTH) === -1) {
        this.currentStatus.push(hw4_Statuses.LOW_HEALTH);
      }
    }
    // If health goes below 0, disable AI and fire enemyDied event
    
    if (this.health <= 0) {
      // this.owner.animation.play("dying",null);
      this.owner.setAIActive(false, {});
      this.owner.isCollidable = false;

      if(this.enemyType==="devil"){
        let player = this.getPlayerPosition();
        let ownerPos= this.owner.position;

          if(this.owner.animation.getCurrentAnimation()!== "dying_left" && this.owner.animation.getCurrentAnimation()!== "dying_right" ) {
            if(player.x - ownerPos.x <=0) {
              this.owner.animation.playIfNotAlready("dying_left", false, "enemyDied", {
                enemy: this.owner,
              });
            }
            else {
              this.owner.animation.playIfNotAlready("dying_right", false, "enemyDied", {
                enemy: this.owner,
              });
            }
          }


      }
      else{
        this.owner.animation.playIfNotAlready("dying", false, "enemyDied", {
          enemy: this.owner,
        });
      }
      // this.emitter.fireEvent("enemyDied", {enemy: this.owner})

      // if (Math.random() < 0.2) {
      //     // Spawn a healthpack
      //     this.emitter.fireEvent("healthpack", { position: this.owner.position });
      //
      // }
    }
  }

  isPlayerVisible(pos: Vec2): Vec2 {
    //Check if one player is visible, taking into account walls

    // Get the new player location
    let start = this.owner.position.clone();
    let delta = pos.clone().sub(start);

    // Iterate through the tilemap region until we find a collision
    let minX = Math.min(start.x, pos.x);
    let maxX = Math.max(start.x, pos.x);
    let minY = Math.min(start.y, pos.y);
    let maxY = Math.max(start.y, pos.y);

    // Get the wall tilemap
    let walls = <OrthogonalTilemap>(
      this.owner.getScene().getLayer("Wall").getItems()[0]
    );

    let minIndex = walls.getColRowAt(new Vec2(minX, minY));
    let maxIndex = walls.getColRowAt(new Vec2(maxX, maxY));

    let tileSize = walls.getTileSize();

    for (let col = minIndex.x; col <= maxIndex.x; col++) {
      for (let row = minIndex.y; row <= maxIndex.y; row++) {
        if (walls.isTileCollidable(col, row)) {
          // Get the position of this tile
          let tilePos = new Vec2(
            col * tileSize.x + tileSize.x / 2,
            row * tileSize.y + tileSize.y / 2
          );

          // Create a collider for this tile
          let collider = new AABB(tilePos, tileSize.scaled(1 / 2));

          let hit = collider.intersectSegment(start, delta, Vec2.ZERO);

          if (
            hit !== null &&
            start.distanceSqTo(hit.pos) < start.distanceSqTo(pos)
          ) {
            // We hit a wall, we can't see the player
            return null;
          }
        }
      }
    }

    return pos;
  }

  getPlayerPosition(): Vec2 {
    //Get the position of the closest player in sight
    let pos = this.player1.position;
    let position1 = pos;

    // Determine which player position to return
    if (position1 == null) {
      return null;
    }
    return position1;
  }

  update(deltaT: number) {
    super.update(deltaT);

    // This is the plan that is executed in the Active state, so whenever we don't have a plan, acquire a new one given the current statuses the enemy has
    if (this.plan.isEmpty()) {
      //get a new plan
      this.plan = this.planner.plan(
        hw4_Statuses.REACHED_GOAL,
        this.possibleActions,
        this.currentStatus,
        null
      );
    }
  }
}

export enum EnemyStates {
  DEFAULT = "default",
  ALERT = "alert",
  TARGETING = "targeting",
  PREVIOUS = "previous",
}
