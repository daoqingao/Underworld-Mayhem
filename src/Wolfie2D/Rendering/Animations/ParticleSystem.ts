import Updateable from "../../DataTypes/Interfaces/Updateable";
import Vec2 from "../../DataTypes/Vec2";
import { GraphicType } from "../../Nodes/Graphics/GraphicTypes";
import Particle from "../../Nodes/Graphics/Particle";
import Scene from "../../Scene/Scene";
import Timer from "../../Timing/Timer";
import Color from "../../Utils/Color";
import { EaseFunctionType } from "../../Utils/EaseFunctions";
import RandUtils from "../../Utils/RandUtils";
import ParticleSystemManager from "./ParticleSystemManager";

/*
-Move particle system to HW#4, particle class and particle manager(object pool), source, randomized period of decay,
 semi-randomized approach for spawning, should be general purpose 
 and load some settings from a json (location, states, colors, randomization). 
 Should be effect when balloon is popped 
*/

export default class ParticleSystem implements Updateable {
    protected particlePool: Array<Particle>;

    protected lifetime: number;

    protected liveParticles: number;

    protected maxLiveParticles: number;

    protected sourcePoint: Vec2;

    protected particleSize: Vec2;

    protected systemLifetime: Timer;

    protected systemRunning: boolean;

    protected color: Color = new Color(255, 0, 0);

    constructor(poolSize: number, sourcePoint: Vec2, lifetime: number, size: number, maxParticles: number) {
        this.particlePool = new Array(poolSize);
        this.sourcePoint = sourcePoint;
        this.lifetime = lifetime;
        this.particleSize = new Vec2(size, size);
        this.maxLiveParticles = maxParticles;
        this.systemRunning = false;

        ParticleSystemManager.getInstance().registerParticleSystem(this);
    }

    initalizePool(scene: Scene, layer: string, type: ParticleSystemType, mass: number) {
        for (let i = 0; i < this.particlePool.length; i++) {
            this.particlePool[i] = <Particle>scene.add.graphic(GraphicType.PARTICLE, layer,
                { position: this.sourcePoint.clone(), size: this.particleSize.clone(), mass: mass });
            this.particlePool[i].addPhysics();
            this.particlePool[i].isCollidable = false;
            this.particlePool[i].visible = false;
        }
    }

    startSystem(time: number, startPoint?: Vec2) {
        this.systemLifetime = new Timer(time);
        this.systemLifetime.start();
        this.systemRunning = true;
        this.sourcePoint = startPoint;
    }

    stopSystem() {
        console.log(this);
        this.systemRunning = false;
        for (let particle of this.particlePool) {
            if (particle.inUse) {
                particle.setParticleInactive();
            }
        }
    }

    changeColor(color: Color) {
        this.color = color;
    }

    update(deltaT: number) {
        if (!this.systemRunning) {
            return;
        }
        if (this.systemLifetime.isStopped()) {
            this.stopSystem();
        }
        else {
            for (let particle of this.particlePool) {
                if (particle.inUse) {
                    particle.decrementAge(deltaT * 1000);

                    if (particle.age <= 0) {
                        particle.setParticleInactive();
                    }

                    //particle.vel.y += 200*deltaT;
                    particle.move(particle.vel.scaled(deltaT));
                }
                else {
                    particle.setParticleActive(this.lifetime, this.sourcePoint.clone());

                    particle.color = this.color;
                    particle.alpha = 1;
                    //particle.size.set(1)
                    particle.vel = RandUtils.randVec(-50, 50, -100, 100);

                    particle.tweens.add("active", {
                        startDelay: 0,
                        duration: 2000,
                        effects: [
                            {
                                property: "alpha",
                                resetOnComplete: true,
                                start: 1,
                                end: 0,
                                ease: EaseFunctionType.IN_OUT_SINE
                            },
                            /*{
                                property: "colorR",
                                resetOnComplete: true,
                                start: particle.color.r,
                                end: 255,
                                ease: EaseFunctionType.IN_OUT_SINE
                            },
                            {
                                property: "colorG",
                                resetOnComplete: true,
                                start: particle.color.g,
                                end: 255,
                                ease: EaseFunctionType.IN_OUT_SINE
                            },
                            {
                                property: "colorB",
                                resetOnComplete: true,
                                start: particle.color.b,
                                end: 255,
                                ease: EaseFunctionType.IN_OUT_SINE
                            },*/
                            {
                                property: "velY",
                                resetOnComplete: true,
                                start: particle.vel.y,
                                end: particle.vel.y + ((this.lifetime * particle.mass)/2),
                                ease: EaseFunctionType.IN_OUT_SINE
                            }
                        ]
                    });

                    particle.tweens.play("active");

                    //particle.vel = RandUtils.randVec(-150, 150, -100, 100);
                    //console.log(particle.vel.toString());
                }
            }
        }
    }

}

export enum ParticleSystemType {
    emitter = "emitter",
    burst = "burst"
}
