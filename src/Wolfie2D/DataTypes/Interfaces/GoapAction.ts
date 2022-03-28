import StateMachineGoapAI from "../../AI/StateMachineGoapAI";

export default abstract class GoapAction {
    /** Cost it takes to complete this action */
    cost: number;

    /** Preconditions that have to be satisfied for an action to happen */
    preconditions: Array<string>;

    /** Resulting statuses after this action completes */
    effects: Array<string>;

    /** If the action fails, do we keep trying until we succeed */
    loopAction: boolean;

    /**
     * Attempt to perform an action, if successful, it will return an array of the expected effects, otherwise it will return null
     * @param statuses Current statuses of the actor
     * @param actor GameNode for the actor
     * @param deltaT The time sine the last update
     * @param target GameNode for a optional target
     */
    abstract performAction(statuses: Array<string>, actor: StateMachineGoapAI, deltaT: number, target?: StateMachineGoapAI): Array<string>;

    /** Check preconditions with current statuses to see if action can be performed */
    checkPreconditions(statuses: Array<string>): boolean {
        // Check that every element in the preconditions array is found in the statuses array
        return (this.preconditions.every((status) => {
            if (!statuses.includes(status)){
                return false;
            }
            return true;
        }));
    }

    /** Add one or more preconditions to this action */
    addPrecondition(preconditions: string | string[]): void {
        this.preconditions.push(...preconditions);
    }

    /** Add one or more effects to this action */
    addEffect(effects: string | string[]): void {
        this.effects.push(...effects);
    }

    /** Removes an precondition, returns true if successful */
    removePrecondition(precondition: string): boolean {
        throw new Error("Method not implemented.");
    }
    
    /** Removes an precondition, returns true if successful */
    removeEffect(effect: string): boolean {
        throw new Error("Method not implemented.");
    }

    /** Update the cost of this action based on options */
    abstract updateCost(options: Record<string,number>): void;

    abstract toString(): string;

}