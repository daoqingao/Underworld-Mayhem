import GoapAction from "../DataTypes/Interfaces/GoapAction";
import GoapAI from "../DataTypes/Interfaces/GoapAI";
import Queue from "../DataTypes/Queue";
import Stack from "../DataTypes/Stack";
import StateMachine from "../DataTypes/State/StateMachine";
import GameNode from "../Nodes/GameNode";
import GoapActionPlanner from "./GoapActionPlanner";

/**
 * A version of a @reference[StateMachine] that is configured to work as an AI controller for a @reference[GameNode]
 */
 export default class StateMachineGoapAI extends StateMachine implements GoapAI {
	/**	The GameNode that uses this StateMachine for its AI */
	protected owner: GameNode;

	goal: string;

    currentStatus: Array<string>;

    possibleActions: Array<GoapAction>;

    plan: Stack<GoapAction>;
    
    planner: GoapActionPlanner;

	// @implemented
	initializeAI(owner: GameNode, config: Record<string, any>): void {}

	// @implemented
	destroy(){
		// Get rid of our reference to the owner
		delete this.owner;
		this.receiver.destroy();
	}

	// @implemented
	activate(options: Record<string, any>): void {}

	changeGoal(goal: string): void {}
}