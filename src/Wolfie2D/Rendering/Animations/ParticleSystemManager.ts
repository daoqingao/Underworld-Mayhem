import Updateable from "../../DataTypes/Interfaces/Updateable";
import ParticleSystem from "./ParticleSystem";

export default class ParticleSystemManager implements Updateable {

    private static instance: ParticleSystemManager = null;
    
    protected particleSystems: Array<ParticleSystem>;

    private constructor(){
        this.particleSystems = new Array();
    }

    static getInstance(): ParticleSystemManager {
        if(ParticleSystemManager.instance === null){
            ParticleSystemManager.instance = new ParticleSystemManager();
        }

        return ParticleSystemManager.instance;
    }

    registerParticleSystem(system: ParticleSystem){
        this.particleSystems.push(system);
    }

    deregisterParticleSystem(system: ParticleSystem){
        let index = this.particleSystems.indexOf(system);
        this.particleSystems.splice(index, 1);
    }

    clearParticleSystems(){
        this.particleSystems = new Array();
    }

    update(deltaT: number): void {
        for(let particleSystem of this.particleSystems){
            particleSystem.update(deltaT);
        }
    }
}