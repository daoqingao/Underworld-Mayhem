import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import NavigationPath from "../../../Wolfie2D/Pathfinding/NavigationPath";
import Timer from "../../../Wolfie2D/Timing/Timer";
import { hw4_Names } from "../../hw4_constants";
import EnemyAI, { EnemyStates } from "../EnemyAI";
import EnemyState from "./EnemyState";

/** When an enemy has seen a player recently, it will move to the last known location they saw them, giving up after a certain time */
export default class Alert extends EnemyState {
    /** The path to move towards the alert position on */
    private path: NavigationPath;

    /** A timer to tell us how long to be alerted for */
    private alertTimer: Timer;

    constructor(parent: EnemyAI, owner: GameNode){
        super(parent, owner);

        this.alertTimer = new Timer(10000);
    }
    
    // Receives options.target
    onEnter(options: Record<string, any>): void {
        this.alertTimer.start();
        this.path = this.owner.getScene().getNavigationManager().getPath(hw4_Names.NAVMESH, this.owner.position, options.target, true);
    }

    handleInput(event: GameEvent): void {

    }

    update(deltaT: number): void {
        if(this.alertTimer.isStopped()){
            // The timer is up, return to the default state
            this.finished(EnemyStates.DEFAULT);
            return;
        }
        else{
            this.owner.moveOnPath(this.parent.speed * deltaT, this.path);
            this.owner.rotation = Vec2.UP.angleToCCW(this.path.getMoveDirection(this.owner));
        }

        // If we see one of the players, target them and move into active mode
        this.parent.lastPlayerPos = this.parent.getPlayerPosition();
        if(this.parent.lastPlayerPos !== null){
            this.finished(EnemyStates.TARGETING);
        }
    }

    onExit(): Record<string, any> {
        return {};
    }

}