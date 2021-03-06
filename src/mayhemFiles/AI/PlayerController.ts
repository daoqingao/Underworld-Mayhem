import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Receiver from "../../Wolfie2D/Events/Receiver";
import Input from "../../Wolfie2D/Input/Input";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import NavigationPath from "../../Wolfie2D/Pathfinding/NavigationPath";
import Timer from "../../Wolfie2D/Timing/Timer";
import InventoryManager from "../GameSystems/InventoryManager";
import Healthpack from "../GameSystems/items/Healthpack";
import Item from "../GameSystems/items/Item";
import Slice from "../GameSystems/items/WeaponTypes/Slice";
import Weapon from "../GameSystems/items/Weapon";
import { hw4_Events, hw4_Names } from "../../Wolfie2D/constants";
import BattlerAI from "./BattlerAI";
import LaserGun from "../GameSystems/items/WeaponTypes/LaserGun";
import SemiAutoGun from "../GameSystems/items/WeaponTypes/SemiAutoGun";
import MaxHealth from "../GameSystems/items/MaxHealth";
import AttackDamage from "../GameSystems/items/AttackDamage";
import AttackSpeed from "../GameSystems/items/AttackSpeed";
import Speed from "../GameSystems/items/Speed";
import Checkpoint from "../GameSystems/items/Checkpoint";
import Scene from "../../Wolfie2D/Scene/Scene";
import CheckpointCleared from "../GameSystems/items/CheckpointCleared";
import Emitter from "../../Wolfie2D/Events/Emitter";
import StateMachineGoapAI from "../../Wolfie2D/AI/StateMachineGoapAI";
import MultiProjectile from "../GameSystems/items/MultiProjectile";
import Particle from "../../Wolfie2D/Nodes/Graphics/Particle";
import RandUtils from "../../Wolfie2D/Utils/RandUtils";
import ParticleSystem from "../../Wolfie2D/Rendering/Animations/ParticleSystem";

export default class PlayerController
  extends StateMachineGoapAI
  implements BattlerAI
{
  // Fields from BattlerAI
  health: number;

  maxHealth: number;

  // The actual player sprite
  owner: AnimatedSprite;

  direction: Vec2;

  // Attack range
  range: number;

  // Current targeted enemy
  target: Vec2;

  // Used for swapping control between both players
  inputEnabled: boolean;

  currentSlowed: boolean;

  // The inventory of the player
  inventory: InventoryManager;

  /** A list of items in the game world */
  private items: Array<Item>;

  // Movement
  private speed: number;
  private oldspeed: number;
  private lookDirection: Vec2;
  private path: NavigationPath;

  weapon: Weapon;
  buffActiveStatus: Array<String>;
  emitter: Emitter;

  shootingTimer: Timer;

  projectileAmount: number;
  teleportEnabled: boolean = false;

  hacks: boolean = false;

  pause: boolean = false;

  burningTimer: Timer;
  burningTotal: number;

  slowTimer: Timer;
  slowTotal: number;

  system: ParticleSystem;

  initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {



    this.owner = owner;
    this.lookDirection = Vec2.ZERO;
    this.speed = options.speed;
    this.health = options.health;
    this.maxHealth = options.maxHealth;
    this.inputEnabled = options.inputEnabled;
    this.range = options.range;
    
    this.items = options.items;
    this.inventory = options.inventory;

    //defined by dao
    this.weapon = options.weapon;
    this.shootingTimer = this.weapon.cooldownTimer;
    this.projectileAmount = 1;
    this.system = options.system;
    this.receiver.subscribe("noplayercontrol");
  }

  activate(options: Record<string, any>): void {}

  handleEvent(event: GameEvent): void {
    // If our id matches this player, set boolean and update inventory UI
    if (event.type === hw4_Events.SWAP_PLAYER) {
      if (event.data.get("id") === this.owner.id) {
        this.inputEnabled = true;
        this.inventory.setActive(true);
      } else {
        this.inputEnabled = false;
        this.inventory.setActive(false);
      }
    }
  }

  multiProjAttack(item: Weapon): void {
    // console.log(this.projectileAmount);

    let angelScale = Math.pow(2, (this.projectileAmount + 2) * -1) + 50;
    for (let i = 1; i <= this.projectileAmount / 2; i++) {
      item.use(
        this.owner,
        "player",
        this.lookDirection.clone().rotateCCW(0 - angelScale * i)
      );
      item.cooldownTimer.end();
    }
    if (this.projectileAmount % 2 == 1) {
      //is odd then we add one more
      item.use(this.owner, "player", this.lookDirection.clone().rotateCCW(0));
      item.cooldownTimer.end();
    }
    for (let i = 1; i <= this.projectileAmount / 2; i++) {
      item.use(
        this.owner,
        "player",
        this.lookDirection.clone().rotateCCW(0 + angelScale * i)
      );
      item.cooldownTimer.end();
    }
  }
  //   this is use to shoot
  handleUseItem(): void {
    let item = <Weapon>this.inventory.getItem();
    // If there is an item in the current slot, use it
    if (item) {
      // item.use(this.owner, "player", this.lookDirection);
      this.multiProjAttack(item);

      if (this.lookDirection.x > 0) {
        this.owner.animation.play("run_right", true);
      } else {
        this.owner.animation.play("run_left", true);
      }
    }
  }

  ///after picking up apply the buff and destroy the item
  handleApplyBuffEffect(item: Item): void {
    if (item instanceof Healthpack) {
      (<BattlerAI>this.owner._ai).health += 5;
      if (
        (<BattlerAI>this.owner._ai).health >
        (<BattlerAI>this.owner._ai).maxHealth
      && !(this.hacks)) {
        (<BattlerAI>this.owner._ai).health = (<BattlerAI>(
          this.owner._ai
        )).maxHealth;
      }
    }
    if (item instanceof AttackDamage) {
      this.weapon.type.damage += 5;
    }
    if (item instanceof AttackSpeed) {
      this.weapon.cooldownTimer = new Timer(
        this.weapon.cooldownTimer.totalTime * 0.8
      );
    }
    if (item instanceof Speed) {
      this.speed += 10;
    }

    if (item instanceof MaxHealth) {
      (<BattlerAI>this.owner._ai).maxHealth += 5;
      (<BattlerAI>this.owner._ai).health += 5;
    }
    if (item instanceof Checkpoint) {
      this.emitter.fireEvent("checkpoint_cleared", {
        position: new Vec2(item.sprite.position.x, item.sprite.position.y),
      });
    } else {
      item.moveSprite(new Vec2(9999, 9999));
      this.emitter.fireEvent("newbuff", { buff: item });
    }
    if (item instanceof MultiProjectile) {
      this.projectileAmount += 1;
    }
  }

  handlePickUpItem(): void {
    for (let i = 0; i < this.items.length; i++) {
      let item = this.items[i];
      {
        if (this.owner.collisionShape.overlaps(item.sprite.boundary)) {
          {
            let arr = this.items;
            arr[i] = arr[arr.length - 1];
            arr.pop();
            this.handleApplyBuffEffect(item);
            break;
          }
        }
      }
    }
  }

  update(deltaT: number): void {
    while (this.receiver.hasNextEvent()) {
      let event = this.receiver.getNextEvent();
      if (event.isType("noplayercontrol")) {
        this.inputEnabled = event.data.get("enable");
        console.log("inputdisabled");
      } else {
        this.handleEvent(this.receiver.getNextEvent());
      }
    }
    if (Input.isKeyJustPressed("escape")) {
      if (this.inputEnabled) {
        this.inputEnabled = false;
        this.emitter.fireEvent("pause", { pause: this.inputEnabled });
      } else {
        this.inputEnabled = true;
        this.emitter.fireEvent("pause", { pause: this.inputEnabled });
      }
    }
    if (this.inputEnabled && this.health > 0) {
      if (Input.isMousePressed(0)) {
        if (this.weapon.cooldownTimer.isStopped()) {
          this.lookDirection = this.owner.position.dirTo(
            Input.getGlobalMousePosition()
          );
          this.emitter.fireEvent("gunshot");
          this.handleUseItem();
          this.weapon.cooldownTimer.start();
        }
      }

      if (Input.isMouseJustPressed(2) && this.teleportEnabled) {
        this.owner.position = Input.getGlobalMousePosition();
      }

      //the combinations for hacks iguess
      if (Input.isKeyPressed("j") && Input.isKeyPressed("k")) {
        if (this.hacks) {
          this.health = this.maxHealth;
          this.teleportEnabled = false;
          this.weapon.cooldownTimer = new Timer(
            this.weapon.cooldownTimer.totalTime * 100
          );
          this.hacks = false;
        } else {
          this.health = 1000000;
          this.teleportEnabled = true;
          this.weapon.cooldownTimer = new Timer(
            this.weapon.cooldownTimer.totalTime * 0.01
          );
          this.hacks = true;
        }
      }
      if (Input.isKeyJustPressed("l")) {
        this.emitter.fireEvent("checkpoint_cleared", {
          position: new Vec2(0, 0),
        });
      }

      if (
        Input.isKeyPressed("a") ||
        Input.isKeyPressed("w") ||
        Input.isKeyPressed("s") ||
        Input.isKeyPressed("d")
      ) {
        let playerPos = this.owner.position.clone();
        this.direction = Vec2.ZERO;
        this.direction.x =
          (Input.isKeyPressed("a") ? -1 : 0) +
          (Input.isKeyPressed("d") ? 1 : 0);
        this.direction.y =
          (Input.isKeyPressed("w") ? -1 : 0) +
          (Input.isKeyPressed("s") ? 1 : 0);

        this.direction.x *= this.speed;
        this.direction.y *= this.speed;
        this.direction.normalize();
        if (Input.isKeyJustPressed("d")) {
          this.owner.animation.play("run_right", true);
        }
        if (Input.isKeyJustPressed("a")) {
          this.owner.animation.play("run_left", true);
        }

        let newPos = playerPos.clone().add(this.direction.scale(3));
        this.path = this.owner
          .getScene()
          .getNavigationManager()
          .getPath(hw4_Names.NAVMESH, this.owner.position, newPos, true);
      } else {
        this.owner.animation.stop();
        if (this.direction) {
          if (this.direction.x > 0) {
            this.owner.animation.play("face_right");
          } else {
            this.owner.animation.play("face_left");
          }
        }
      }

    }

    //Move on path if selected
    if (this.path != null) {
      if (this.path.isDone()) {
        this.path = null;
      } else {
        this.owner.moveOnPath(this.speed * deltaT, this.path);
        // this.owner.rotation = Vec2.UP.angleToCCW(
        //   this.path.getMoveDirection(this.owner)
        // );
      }
      this.handlePickUpItem();
    }

    if(this.burningTotal>=0){
      if(this.burningTimer.isStopped())
      {
        this.burningTotal--;
        this.damage(1);
        this.burningTimer.start(1000);
      }
    }
    if (this.burningTotal == -1){
      this.emitter.fireEvent("nomoreburn");
    }

    if(this.slowTotal>=0){
      if(this.slowTimer.isStopped())
      {
        this.slowTotal--;
        this.slowTimer.start(1000);
      }
    }
    if (this.slowTotal == -1){
      this.emitter.fireEvent("nomoreslow");
      this.speed = this.oldspeed;
      this.currentSlowed = false;
    }
  }

  // setParticleAnimation(particle: Particle) {
  //   particle.vel = RandUtils.randVec(-50, 50, -100, 100);
  //   particle.tweens.add("active", {
  //     startDelay: 0,
  //     duration: 100,
  //     effects: []
  //   });
  // }

  damage(damage: number, enemyType?:any): void {
    this.health -= damage;
    // console.log(enemyType)
    if(enemyType === "imp"){
      //giving imps a burning effect
      this.burningTotal=5; //5 ticks in total
      this.burningTimer = new Timer(1000);
      // this.system.startSystem(1000,  1,this.owner.position.clone());

    }
    if (enemyType === "jellyfish"){
      if (!(this.currentSlowed)){
        this.oldspeed = this.speed;
        this.slowTotal = 5;
        this.speed = 50;
        this.slowTimer = new Timer(1000);
        this.currentSlowed = true;
      }
    }
    this.emitter.fireEvent("playerdamage", { speed: this.speed,enemyType: enemyType});
  }

  destroy() {}
}
