import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import OrthogonalTilemap from "../../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import NavigationPath from "../../../Wolfie2D/Pathfinding/NavigationPath";
import Timer from "../../../Wolfie2D/Timing/Timer";
import { hw4_Names, hw4_Statuses } from "../../hw4_constants";
import EnemyAI, { EnemyStates } from "../EnemyAI";
import EnemyState from "./EnemyState";

export default class Active extends EnemyState {
    // Timers for managing this state
    pollTimer: Timer;
    exitTimer: Timer;

    // The return object for this state
    retObj: Record<string, any>;

    constructor(parent: EnemyAI, owner: GameNode) {
        super(parent, owner);

        // Regularly update the player location
        this.pollTimer = new Timer(100);

        this.exitTimer = new Timer(1000);
    }

    onEnter(options: Record<string, any>): void {
        // Reset the return object
        this.retObj = {};

        // Choose path to last seen player position
        this.retObj = { target: this.parent.lastPlayerPos }
        this.parent.path = this.owner.getScene().getNavigationManager().getPath(hw4_Names.NAVMESH, this.owner.position, this.parent.lastPlayerPos, true);
        this.pickRetreatPath(this.parent.path);
    }

    handleInput(event: GameEvent): void { }

    // HOMEWORK 4 - TODO
    /**
     * This function is called whenever we're defining a path towards the player, and it should create a path that moves
     * in the complete opposite direction. For example, if the path to the player is moving straight left, this method should create 
     * a retreat path that moves straight right. This path should then be set to retreatPath in EnemyAI.
     * 
     * You'll have to implement this function so you can use retreatPath in the Retreat action.
     */
    pickRetreatPath(pathToPlayer: NavigationPath){

    }

    update(deltaT: number): void {
        //Poll for player position
        if (this.pollTimer.isStopped()) {
            // Restart the timer
            this.pollTimer.start();

            this.parent.playerPos = this.parent.getPlayerPosition();

            if (this.parent.playerPos !== null) {
                // If we see a new player position, update the last position
                this.parent.path = this.owner.getScene().getNavigationManager().getPath(hw4_Names.NAVMESH, this.owner.position, this.parent.lastPlayerPos, true);
                this.pickRetreatPath(this.parent.path);
                this.parent.lastPlayerPos = this.parent.playerPos;
                this.exitTimer.start();
            }
        }

        if (this.exitTimer.isStopped()) {
            // We haven't seen the player in a while, go check out where we last saw them, if possible
            if (this.parent.lastPlayerPos !== null) {
                this.retObj = { target: this.parent.lastPlayerPos }
                this.finished(EnemyStates.ALERT);
            } else {
                this.finished(EnemyStates.DEFAULT);
            }
        }

        //Add in range to status if close enough to a player
        if (this.parent.playerPos !== null) {
            let distance = this.owner.position.distanceTo(this.parent.playerPos);
            if (distance > this.parent.inRange) {
                let index = this.parent.currentStatus.indexOf(hw4_Statuses.IN_RANGE);
                if (index != -1) {
                    this.parent.currentStatus.splice(index, 1);
                }
            }
        }

        //Choose next action
        let nextAction = this.parent.plan.peek();

        //Perform the action
        let result = nextAction.performAction(this.parent.currentStatus, this.parent, deltaT);

        //Our action was successful
        if (result !== null) {
            //If the action was Retreat or Berserk, remove the CAN_RETREAT or CAN_BERSERK status from the enemy, they can only use them once
            if (nextAction.toString() === "(Retreat)"){
                let index = this.parent.currentStatus.indexOf(hw4_Statuses.CAN_RETREAT);
                if (index != -1) {
                    this.parent.currentStatus.splice(index, 1);
                }
            }
            if (nextAction.toString() === "(Berserk)"){
                let index = this.parent.currentStatus.indexOf(hw4_Statuses.CAN_BERSERK);
                if (index != -1) {
                    this.parent.currentStatus.splice(index, 1);
                }
            }

            //The action has not reached the goal yet, pass along the effects of our action
            if (!result.includes(hw4_Statuses.REACHED_GOAL)) {
                this.parent.currentStatus = this.parent.currentStatus.concat(...result);
            }
            this.parent.plan.pop();
        }
        else {
            // Our action was not successful. However, if the action was a loop action like Move, we continue to do it until it's succesful
            if (!nextAction.loopAction) {
                this.parent.plan.pop();
            }
        }

    }

    onExit(): Record<string, any> {
        return this.retObj;
    }

}