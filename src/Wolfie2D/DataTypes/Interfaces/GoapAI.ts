import GoapActionPlanner from "../../AI/GoapActionPlanner";
import GameEvent from "../../Events/GameEvent";
import GameNode from "../../Nodes/GameNode";
import Queue from "../Queue";
import Stack from "../Stack";
import GoapAction from "./GoapAction";
import Updateable from "./Updateable";

/**
 * Defines a controller for a bot or a human. Must be able to update
 */
export default interface GoapAI extends Updateable {
    /** Current goal of the AI */
    goal: string;

    /** All current statuses this AI has */
    currentStatus: Array<string>;

    /** All possible actions that can be carried out */
    possibleActions: Array<GoapAction>;

    /** Current actions to be carried out */
    plan: Stack<GoapAction>;
    
    /** Once we have no actions, the planner can be called to find a new sequence of actions */
    planner: GoapActionPlanner;

    /** Clears references from to the owner */
    destroy(): void;

    /** Activates this AI from a stopped state and allows variables to be passed in */
    activate(options: Record<string, any>): void;

    /** Handles events from the Actor */
    handleEvent(event: GameEvent): void;

    /** Initializes the AI with the actor and any additional config */
    initializeAI(owner:GameNode, options: Record<string, any>): void

    /** Change the goal to a new goal */
    changeGoal(goal: string): void
}