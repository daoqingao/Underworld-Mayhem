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

  // The inventory of the player
  inventory: InventoryManager;

  /** A list of items in the game world */
  private items: Array<Item>;

  // Movement
  private speed: number;

  private lookDirection: Vec2;
  private path: NavigationPath;

  weapon: Weapon;
  buffActiveStatus: Array<String>;
  emitter: Emitter;

  shootingTimer: Timer;

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

  //   this is use to shoot
  handleUseItem(): void {
    let item = this.inventory.getItem();
    // If there is an item in the current slot, use it
    if (item) {
      item.use(this.owner, "player", this.lookDirection);
      if (this.lookDirection.x > 0) {
        this.owner.animation.play("face_right");
      } else {
        this.owner.animation.play("face_left");
      }
      // this.owner.rotation = Vec2.UP.angleToCCW(this.lookDirection);
    }
  }

  ///after picking up apply the buff and destroy the item
  handleApplyBuffEffect(item: Item): void {
    if (item instanceof Healthpack) {
      (<BattlerAI>this.owner._ai).maxHealth += 5;
      (<BattlerAI>this.owner._ai).health += 5;
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
      this.speed += 40;
    }

    if (item instanceof MaxHealth) {
      (<BattlerAI>this.owner._ai).health += 5;
      if (
        (<BattlerAI>this.owner._ai).health >
        (<BattlerAI>this.owner._ai).maxHealth
      ) {
        (<BattlerAI>this.owner._ai).health = (<BattlerAI>(
          this.owner._ai
        )).maxHealth;
      }
    }
    if (item instanceof Checkpoint) {
      this.emitter.fireEvent("checkpoint_cleared", {
        position: new Vec2(item.sprite.position.x, item.sprite.position.y),
      });
    } else {
      this.emitter.fireEvent("newbuff", { buff: item });
    }
    if (!(item instanceof CheckpointCleared)) {
      item.moveSprite(new Vec2(9999, 9999));
    }
  }
  handlePickUpItem(): void {
    //what if the pick up was the buff activation itself
    for (let item of this.items) {
      if (this.owner.collisionShape.overlaps(item.sprite.boundary)) {
        {
          // We overlap it, try to pick it up
          // let activeBuffIndex = this.buffBar.getSlot();
          // let maxSize =         this.buffBar.getSize();
          //
          // this.inventory.changeSlot(activeBuffIndex+1)
          // this.buffBar.addItem(item);
          //
          this.handleApplyBuffEffect(item);
          break;
        }
      }
    }
  }
  update(deltaT: number): void {
    while (this.receiver.hasNextEvent()) {
      this.handleEvent(this.receiver.getNextEvent());
    }
    if (this.inputEnabled && this.health > 0) {
      if (Input.isMousePressed(0)) {
        if (this.weapon.cooldownTimer.isStopped()) {
          console.log("timer doned");
          this.lookDirection = this.owner.position.dirTo(
            Input.getGlobalMousePosition()
          );
          this.handleUseItem();
          this.weapon.cooldownTimer.start();
        }
      }

      if (Input.isMouseJustPressed(2)) {
        this.owner.position = Input.getGlobalMousePosition();
        //this.path = this.owner.getScene().getNavigationManager().getPath(hw4_Names.NAVMESH, this.owner.position, Input.getGlobalMousePosition(), true);

        // console.log(this.owner.position)
        // console.log(Input.getGlobalMousePosition())
      }

      if (
        // Input.isMouseJustPressed(0)
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
        if (this.direction.x > 0 && Input.isKeyJustPressed("d")) {
          this.owner.animation.play("run_right", true);
        }
        if (this.direction.x < 0 && Input.isKeyJustPressed("a")) {
          this.owner.animation.play("run_left", true);
        }

        let newPos = playerPos.clone().add(this.direction.scale(3));
        // console.log(playerPos)
        // console.log(newPos)
        this.path = this.owner
          .getScene()
          .getNavigationManager()
          .getPath(hw4_Names.NAVMESH, this.owner.position, newPos, true);
      } else {
        this.owner.animation.stop();
        if (this.direction) {
          console.log(this.direction.x);
          if (this.direction.x > 0) {
            this.owner.animation.play("face_right");
          } else {
            this.owner.animation.play("face_left");
          }
        }
      }

      // Check for slot change
      if (Input.isJustPressed("slot1")) {
        this.inventory.changeSlot(0);
      } else if (Input.isJustPressed("slot2")) {
        this.inventory.changeSlot(1);
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
    } else {
      //Target an enemy and attack
      if (this.target != null) {
        this.lookDirection = this.owner.position.dirTo(this.target);
        // this.handleUseItem();
      }
    }
  }

  damage(damage: number): void {
    this.health -= damage;
  }

  destroy() {}
}
