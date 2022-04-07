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
import { hw4_Events, hw4_Names } from "../../Wolfie2D/constants";
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


    buffBar: InventoryManager;
    weapon: Weapon;
    buffActiveStatus: Array<String>

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

        this.buffBar = options.buffBar
        this.weapon = options.weapon
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

    //this is use to shoot
    handleUseItem():void{
        let item = this.inventory.getItem();
        // If there is an item in the current slot, use it
        if (item) {
            item.use(this.owner, "player", this.lookDirection);
            this.owner.rotation = Vec2.UP.angleToCCW(this.lookDirection);
        }

    }

    handleApplyBuffEffect(item: Item): void{
        this.weapon.cooldownTimer = new Timer(this.weapon.type.cooldown*0.1);

    }
    handlePickUpItem():void{ //what if the pick up was the buff activation itself
        for (let item of this.items) {
            if (this.owner.collisionShape.overlaps(item.sprite.boundary))
            {
                if(!(item instanceof Weapon)){
                    // We overlap it, try to pick it up
                    // let activeBuffIndex = this.buffBar.getSlot();
                    // let maxSize =         this.buffBar.getSize();
                    //
                    // this.inventory.changeSlot(activeBuffIndex+1)
                    // this.buffBar.addItem(item);
                    //

                    //this.handleApplyBuffEffect(item);

                    // console.log(this.inventory)
                    break;
                }
                else{
                    // let activeInvIndex = this.inventory.getSlot();
                    // let maxSize =         this.inventory.getSize();
                    // this.inventory.changeSlot(activeInvIndex+1)
                    // this.inventory.addItem(item);
                }

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
                this.owner.position = Input.getGlobalMousePosition();
                //this.path = this.owner.getScene().getNavigationManager().getPath(hw4_Names.NAVMESH, this.owner.position, Input.getGlobalMousePosition(), true);

                // console.log(this.owner.position)
                // console.log(Input.getGlobalMousePosition())
            }


            if(
                // Input.isMouseJustPressed(0)
                (   Input.isKeyPressed("a"))
                ||(Input.isKeyPressed("w"))
                ||(Input.isKeyPressed("s"))
                ||(Input.isKeyPressed("d"))
            )
            {

                let playerPos = this.owner.position.clone();
                const direction = Vec2.ZERO;
                direction.x = (Input.isKeyPressed("a") ? -1 : 0) + (
                               Input.isKeyPressed("d") ? 1 : 0);
                direction.y = (Input.isKeyPressed("w") ? -1 : 0) + (
                               Input.isKeyPressed("s") ? 1 : 0);

                // if(Input.isMousePressed(0) ){
                //     direction.x=1;
                //     direction.y=-1;
                // }
                direction.normalize();
                let newPos = playerPos.clone().add(direction.scale(3));
                // console.log(playerPos)
                // console.log(newPos)
                this.path = this.owner.getScene().getNavigationManager().getPath(hw4_Names.NAVMESH, this.owner.position, newPos, true)
                // Scale our direction to speed

                // const speed = 100 * deltaT;
                // const velocity = direction.scale(speed);
                // this.owner.position.add(velocity);

                // if (this.path != null) {
                //     if (this.path.isDone()) {
                //         this.path = null;
                //     }
                //     else {
                //         this.owner.moveOnPath(this.speed * deltaT, this.path);
                //         this.owner.rotation = Vec2.UP.angleToCCW(this.path.getMoveDirection(this.owner));
                //     }
                // }
                // Finally, adjust the position of the player


            }





            // Check for slot change
            if (Input.isJustPressed("slot1")) {
                this.inventory.changeSlot(0);
            } else if (Input.isJustPressed("slot2")) {
                this.inventory.changeSlot(1);
            }
            // if (Input.isJustPressed("pickup"))
            // {
            //     // Check if there is an item to pick up
            //     for (let item of this.items) {
            //         if (this.owner.collisionShape.overlaps(item.sprite.boundary)) {
            //             // We overlap it, try to pick it up
            //             this.inventory.addItem(item);
            //             break;
            //         }
            //     }
            // }

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
            this.handlePickUpItem()
        }
        else {
            //Target an enemy and attack
            if (this.target != null) {

                this.lookDirection = this.owner.position.dirTo(this.target);

                this.handleUseItem()

            }
        }
    }

    damage(damage: number): void {
        this.health -= damage;
    }

    destroy() {

    }
}