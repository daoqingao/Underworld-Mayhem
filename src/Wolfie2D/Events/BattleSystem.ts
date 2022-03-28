import Updateable from "../DataTypes/Interfaces/Updateable";
import EventQueue from "./EventQueue";
import Receiver from "./Receiver";

export default abstract class BattleSystem implements Updateable {

    units: Map<number,Record<string, number>>;
    receiver: Receiver;
    eventQueue: EventQueue;
    statSystem: Array<string>;

    constructor(battleEvents: Array<string>, statSystem: Array<string>){
        this.eventQueue = EventQueue.getInstance();
        this.eventQueue.subscribe(this.receiver, battleEvents);
        this.statSystem = statSystem;
    }

    getUnitStats(id: number): Record<string,number> {
        return this.units.get(id);
    }
    
    validateStats(stats: Record<string,number>): Record<string,number> {
        this.statSystem.forEach(e => {
            if (stats[e] === undefined){
                stats[e] = 0;
            }
        });
        return stats;
    }

    initalizeUnit(id: number, stats: Record<string, number>): void{
        this.units.set(id, this.validateStats(stats));
    }

    abstract update(deltaT: number): void;


}