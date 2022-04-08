import AI from "../../Wolfie2D/DataTypes/Interfaces/AI";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import GameNode from "../../Wolfie2D/Nodes/GameNode";

/** */
export default abstract class ControllerAI implements AI {
    /** The owner of this controller */
	protected owner: GameNode;

    /** Removes the instance of the owner of this AI */
    destroy(): void {
        delete this.owner;
    }

    abstract initializeAI(owner: GameNode, options: Record<string, any>): void; 

    abstract activate(options: Record<string, any>): void;

    abstract handleEvent(event: GameEvent): void;

    abstract update(deltaT: number): void;
}