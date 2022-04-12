import Vec2 from "../../DataTypes/Vec2";
import GameEvent from "../../Events/GameEvent";
import GameNode from "../../Nodes/GameNode";
import NavigationPath from "../../Pathfinding/NavigationPath";
import { hw4_Events, hw4_Names } from "../../constants";
import EnemyAI, { EnemyStates } from "../../../mayhemFiles/AI/EnemyAI";
import EnemyState from "./EnemyState";

export default class Patrol extends EnemyState {

    // The route this AI takes when patrolling
    protected patrolRoute: Array<Vec2>;

    // The current patrolRoute index
    protected routeIndex: number;

    // The current path
    protected currentPath: NavigationPath;

    // A return object for exiting this state
    protected retObj: Record<string, any>;

    constructor(parent: EnemyAI, owner: GameNode, patrolRoute: Array<Vec2>){
        super(parent, owner);

        this.patrolRoute = patrolRoute;
        this.routeIndex = 0;
    }

    onEnter(options: Record<string, any>): void {
        this.currentPath = this.getNextPath();
    }

    handleInput(event: GameEvent): void { }

    update(deltaT: number): void {
        // If the enemy sees the player, start attacking
        this.parent.lastPlayerPos = this.parent.getPlayerPosition();
        if(this.parent.lastPlayerPos !== null){
            this.finished(EnemyStates.TARGETING);
        }
        else{
            //Move along patrol path
            if(this.currentPath.isDone()){
                this.currentPath = this.getNextPath();
            } else {
                this.owner.moveOnPath(this.parent.speed * deltaT, this.currentPath);
                // this.owner.rotation = Vec2.UP.angleToCCW(this.currentPath.getMoveDirection(this.owner));
            }
        }
    }

    onExit(): Record<string, any> {
        return this.retObj;
    }

    getNextPath(): NavigationPath {
        let path = this.owner.getScene().getNavigationManager().getPath(hw4_Names.NAVMESH, this.owner.position, this.patrolRoute[this.routeIndex]);
        this.routeIndex = (this.routeIndex + 1)%this.patrolRoute.length;
        return path;
    }

}