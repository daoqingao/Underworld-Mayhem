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
import Weapon from "../GameSystems/items/Weapon";
import { hw4_Events, hw4_Names } from "../hw4_constants";
import BattlerAI from "./BattlerAI";


export default class PlayerController implements BattlerAI {
    // Fields from BattlerAI
    health: number;

    // The actual player sprite
    owner: AnimatedSprite;

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

    private receiver: Receiver;


    initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
        this.owner = owner;
        this.lookDirection = Vec2.ZERO;
        this.speed = options.speed;
        this.health = options.health;
        this.inputEnabled = options.inputEnabled;
        this.range = options.range;

        this.items = options.items;
        this.inventory = options.inventory;

        this.receiver = new Receiver();
        this.receiver.subscribe(hw4_Events.SWAP_PLAYER);
    }

    activate(options: Record<string, any>): void { }

    handleEvent(event: GameEvent): void {
        // If our id matches this player, set boolean and update inventory UI
        if (event.type === hw4_Events.SWAP_PLAYER) {
            if (event.data.get("id") === this.owner.id) {
                this.inputEnabled = true;
                this.inventory.setActive(true);
            }
            else {
                this.inputEnabled = false;
                this.inventory.setActive(false);
            }
        }
    }

    update(deltaT: number): void {
        while(this.receiver.hasNextEvent()){
            this.handleEvent(this.receiver.getNextEvent());
        }
        if (this.inputEnabled && this.health > 0) {
            //Check right click
            if (Input.isMouseJustPressed(2)) {
                this.path = this.owner.getScene().getNavigationManager().getPath(hw4_Names.NAVMESH, this.owner.position, Input.getGlobalMousePosition(), true);
            }

            // Check for slot change
            if (Input.isJustPressed("slot1")) {
                this.inventory.changeSlot(0);
            } else if (Input.isJustPressed("slot2")) {
                this.inventory.changeSlot(1);
            }

            if (Input.isJustPressed("pickup")) {
                // Check if there is an item to pick up
                for (let item of this.items) {
                    if (this.owner.collisionShape.overlaps(item.sprite.boundary)) {
                        // We overlap it, try to pick it up
                        this.inventory.addItem(item);
                        break;
                    }
                }
            }

            if (Input.isJustPressed("drop")) {
                // Check if we can drop our current item
                let item = this.inventory.removeItem();

                if (item) {
                    // Move the item from the ui to the gameworld
                    item.moveSprite(this.owner.position, "primary");

                    // Add the item to the list of items
                    this.items.push(item);
                }
            }
        }

        //Move on path if selected
        if (this.path != null) {
            if (this.path.isDone()) {
                this.path = null;
            }
            else {
                this.owner.moveOnPath(this.speed * deltaT, this.path);
                this.owner.rotation = Vec2.UP.angleToCCW(this.path.getMoveDirection(this.owner));
            }
        }
        else {
            //Target an enemy and attack
            if (this.target != null) {
                let item = this.inventory.getItem();
                this.lookDirection = this.owner.position.dirTo(this.target);

                // If there is an item in the current slot, use it
                if (item) {
                    item.use(this.owner, "player", this.lookDirection);
                    this.owner.rotation = Vec2.UP.angleToCCW(this.lookDirection);

                    if (item instanceof Healthpack) {
                        // Destroy the used healthpack
                        this.inventory.removeItem();
                        item.sprite.visible = false;
                    }
                }
            }
        }
    }

    damage(damage: number): void {
        this.health -= damage;
    }

    destroy() {

    }
}