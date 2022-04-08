import PlayerController from "../AI/PlayerController";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Scene from "../../Wolfie2D/Scene/Scene";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import PositionGraph from "../../Wolfie2D/DataTypes/Graphs/PositionGraph";
import Navmesh from "../../Wolfie2D/Pathfinding/Navmesh";
import { hw4_Events, hw4_Names, hw4_Statuses } from "../../Wolfie2D/constants";
import EnemyAI from "../AI/EnemyAI";
import WeaponType from "../GameSystems/items/WeaponTypes/WeaponType";
import RegistryManager from "../../Wolfie2D/Registry/RegistryManager";
import Weapon from "../GameSystems/items/Weapon";
import Healthpack from "../GameSystems/items/Healthpack";
import InventoryManager from "../GameSystems/InventoryManager";
import Item from "../GameSystems/items/Item";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import BattleManager from "../GameSystems/BattleManager";
import BattlerAI from "../AI/BattlerAI";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Color from "../../Wolfie2D/Utils/Color";
import Input from "../../Wolfie2D/Input/Input";
import GameOver from "./GameOver";
import AttackAction from "../../Wolfie2D/AI/EnemyActions/AttackAction";
import Move from "../../Wolfie2D/AI/EnemyActions/Move";
import Retreat from "../../Wolfie2D/AI/EnemyActions/Retreat";
import { TweenableProperties } from "../../Wolfie2D/Nodes/GameNode";
import Line from "../../Wolfie2D/Nodes/Graphics/Line";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";
import GoapAction from "../../Wolfie2D/DataTypes/Interfaces/GoapAction";
import GoapActionPlanner from "../../Wolfie2D/AI/GoapActionPlanner";
import Map from "../../Wolfie2D/DataTypes/Map";
import Stack from "../../Wolfie2D/DataTypes/Stack";
import Berserk from "../../Wolfie2D/AI/EnemyActions/Berserk";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import MaxHealth from "../GameSystems/items/MaxHealth";
import Speed from "../GameSystems/items/Speed";
import AttackSpeed from "../GameSystems/items/AttackSpeed";
import AttackDamage from "../GameSystems/items/AttackDamage";
import Checkpoint from "../GameSystems/items/Checkpoint";
import CheckpointCleared from "../GameSystems/items/CheckpointCleared";
import NextLevel from "./NextLevel";

export default class mainScene extends Scene {
  // The player
  private mainPlayer: AnimatedSprite;

  // A list of enemies
  private enemies: Array<AnimatedSprite>;

  // The wall layer of the tilemap to use for bullet visualization
  private walls: OrthogonalTilemap;

  // The position graph for the navmesh
  private graph: PositionGraph;

  // A list of items in the scene
  private items: Array<Item>;

  // The battle manager for the scene
  private battleManager: BattleManager;

  // Player health
  private healthDisplays: Label;

  // Player Damage
  private attackDisplays: Label;

  private maxhealthDisplays: Label;

  private pauseButton: Button;

  private playButton: Button;

  loadScene() {
    // Load the player and enemy spritesheets

    //there will only be one player
    this.load.spritesheet("player1", "mayhemAssets/spritesheets/player1.json");

    this.load.spritesheet(
      "gun_enemy",
      "mayhemAssets/spritesheets/gun_enemy.json"
    );
    this.load.spritesheet(
      "knife_enemy",
      "mayhemAssets/spritesheets/knife_enemy.json"
    );
    this.load.spritesheet(
      "custom_enemy1",
      "mayhemAssets/spritesheets/custom_enemy1.json"
    );
    this.load.spritesheet(
      "custom_enemy2",
      "mayhemAssets/spritesheets/custom_enemy2.json"
    );

    this.load.spritesheet("slice", "mayhemAssets/spritesheets/slice.json");
    this.load.tilemap(
      "level",
      "mayhemAssets/tilemaps/cse380_hw4_tilejson.json"
    );
    this.load.object("weaponData", "mayhemAssets/data/weaponData.json");
    this.load.object("navmesh", "mayhemAssets/data/navmesh.json");
    this.load.object("enemyData", "mayhemAssets/data/enemy.json");
    this.load.object("itemData", "mayhemAssets/data/items.json");
    //buffs
    this.load.image("healthpack", "mayhemAssets/sprites/healthpack.png");
    this.load.image("healthmax", "mayhemAssets/sprites/healthmax.png");
    this.load.image("attackspeed", "mayhemAssets/sprites/attackspeed.png");
    this.load.image("attackdamage", "mayhemAssets/sprites/attackdamage.png");
    this.load.image("speed", "mayhemAssets/sprites/speed.png");
    this.load.image("checkpoint", "mayhemAssets/sprites/checkpoint.png");
    this.load.image(
      "checkpointcleared",
      "mayhemAssets/sprites/checkpointcleared.png"
    );

    this.load.image("inventorySlot", "mayhemAssets/sprites/inventory.png");
    this.load.image("knife", "mayhemAssets/sprites/knife.png");
    this.load.image("laserGun", "mayhemAssets/sprites/laserGun.png");
    this.load.image("pistol", "mayhemAssets/sprites/pistol.png");
  }

  startScene() {
    // HOMEWORK 4 - TODO
    /*
            Modify this line if needed.

            This line is just getting the wall layer of your tilemap to use for some calculations.
            Make sure it is still doing so.

            What the line is saying is to get the first level from the bottom (tilemapLayers[1]),
            which in my case was the Walls layer.

            Also, your tilemap will be made with 32x32 tiles while the example map is made with 16x16 tiles.
            You'll need to scale it down for our 16x16 players and enemy sprites. The code for this
            is listed below, it's just a scaling down by 1/2 for the tilemap size.
        */

    // Add in the tilemap
    let tilemapLayers = this.add.tilemap("level", new Vec2(0.5, 0.5));

    // Get the wall layer
    this.walls = <OrthogonalTilemap>tilemapLayers[1].getItems()[0];

    // Set the viewport bounds to the tilemap
    let tilemapSize: Vec2 = this.walls.size.scaled(0.5);

    this.viewport.setBounds(0, 0, tilemapSize.x, tilemapSize.y);

    this.addLayer("primary", 10);

    // Create the battle manager
    this.battleManager = new BattleManager();

    this.initializeWeapons();

    // Initialize the items array - this represents items that are in the game world
    this.items = [];

    // Create the player
    this.initializePlayer();

    // Make the viewport follow the player
    this.viewport.follow(this.mainPlayer);

    // Zoom in to a reasonable level
    this.viewport.enableZoom();
    this.viewport.setZoomLevel(4);

    // Create the navmesh
    this.createNavmesh();

    // Initialize all enemies
    this.initializeEnemies();

    // Send the player and enemies to the battle manager
    this.battleManager.setPlayers([<BattlerAI>this.mainPlayer._ai]);
    this.battleManager.setEnemies(
      this.enemies.map((enemy) => <BattlerAI>enemy._ai)
    );

    // Subscribe to relevant events
    this.receiver.subscribe("healthpack");
    this.receiver.subscribe("enemyDied");
    this.receiver.subscribe("checkpoint_cleared");
    this.receiver.subscribe(hw4_Events.UNLOAD_ASSET);

    // Spawn items into the world
    this.spawnItems();

    // Add a UI for health
    this.addUILayer("health");

    this.healthDisplays = <Label>this.add.uiElement(
      UIElementType.LABEL,
      "health",
      {
        position: new Vec2(60, 16),
        text: "Health: " + (<BattlerAI>this.mainPlayer._ai).health,
      }
    );
    this.healthDisplays.textColor = Color.WHITE;

    this.addUILayer("maxhealth");

    this.maxhealthDisplays = <Label>this.add.uiElement(
      UIElementType.LABEL,
      "maxhealth",
      {
        position: new Vec2(130, 16),
        text:
          "Max Health: " + (<PlayerController>this.mainPlayer._ai).maxHealth,
      }
    );
    this.maxhealthDisplays.textColor = Color.WHITE;

    this.addUILayer("attack");

    this.attackDisplays = <Label>this.add.uiElement(
      UIElementType.LABEL,
      "attack",
      {
        position: new Vec2(190, 16),
        text:
          "Attack: " +
          (<PlayerController>this.mainPlayer._ai).weapon.type.damage,
      }
    );
    this.attackDisplays.textColor = Color.WHITE;
    this.addUILayer("pause");
    this.addUILayer("play");
    this.pauseButton = <Button>this.add.uiElement(
      UIElementType.BUTTON,
      "pause",
      {
        position: new Vec2(250, 16),
        text: "Pause",
      }
    );
    this.pauseButton.size.set(200, 50);
    this.pauseButton.borderColor = Color.TRANSPARENT;
    this.pauseButton.backgroundColor = Color.TRANSPARENT;
    this.pauseButton.onClickEventId = "pause";

    this.playButton = <Button>this.add.uiElement(UIElementType.BUTTON, "play", {
      position: new Vec2(220, 16),
      text: "Play",
    });
    this.playButton.size.set(200, 50);
    this.playButton.borderColor = Color.TRANSPARENT;
    this.playButton.backgroundColor = Color.TRANSPARENT;
    this.playButton.onClickEventId = "play";

    this.receiver.subscribe("pause");
    this.receiver.subscribe("play");

    //
    // this.healthDisplays[1] = <Label>this.add.uiElement(UIElementType.LABEL, "health", {position: new Vec2(70, 32), text: "Health: " + (<BattlerAI>this.mainPlayer._ai).health});
    // this.healthDisplays[1].textColor = Color.WHITE;
  }

  updateScene(deltaT: number): void {
    while (this.receiver.hasNextEvent()) {
      let event = this.receiver.getNextEvent();
      if (event.isType("healthpack")) {
        this.createHealthpack(event.data.get("position"));
      }
      if (event.isType("enemyDied")) {
        this.enemies = this.enemies.filter(
          (enemy) => enemy !== event.data.get("enemy")
        );
        this.battleManager.enemies = this.battleManager.enemies.filter(
          (enemy) => enemy !== <BattlerAI>event.data.get("enemy")._ai
        );
      }
      if (event.isType("checkpoint_cleared")) {
        let sprite = this.add.sprite("checkpointcleared", "primary");
        let checkpointcleared = new CheckpointCleared(sprite);
        console.log(event.data.get("position"));
        checkpointcleared.moveSprite(event.data.get("position"));
        this.mainPlayer.visible = false;
        this.sceneManager.changeToScene(NextLevel);
      }
      if (event.isType("pause")) {
        console.log("Pausing Game");
      }
      if (event.isType("play")) {
        console.log("Resume Game");
      }
      if (event.isType(hw4_Events.UNLOAD_ASSET)) {
        //console.log(event.data);
        let asset = this.sceneGraph.getNode(event.data.get("node"));
        asset.destroy();
      }
    }
    // check health of each player
    let health = (<BattlerAI>this.mainPlayer._ai).health;

    //If both are dead, game over

    if (health === 0) {
      this.mainPlayer.position = new Vec2(-1000, -1000);
      this.mainPlayer.visible = false;
      this.sceneManager.changeToScene(GameOver);
    }
    // update closest enemy of each player
    let closetEnemy = this.getClosestEnemy(
      this.mainPlayer.position,
      (<PlayerController>this.mainPlayer._ai).range
    );

    (<PlayerController>this.mainPlayer._ai).target = closetEnemy;

    // Update health gui
    this.healthDisplays.text = "Health: " + health;
    this.attackDisplays.text =
      "Attack: " + (<PlayerController>this.mainPlayer._ai).weapon.type.damage;
    this.maxhealthDisplays.text =
      "Max Health: " + (<PlayerController>this.mainPlayer._ai).maxHealth;

    // Debug mode graph
    if (Input.isKeyJustPressed("g")) {
      this.getLayer("graph").setHidden(!this.getLayer("graph").isHidden());
    }
  }

  getClosestEnemy(playerPos: Vec2, range: number): Vec2 {
    let closetDistance: number = Number.POSITIVE_INFINITY;
    let closetEnemy: Vec2 = null;
    for (let enemy of this.enemies) {
      let distance = Math.sqrt(
        Math.pow(enemy.position.x - playerPos.x, 2) +
          Math.pow(enemy.position.y - playerPos.y, 2)
      );
      if (distance <= range) {
        if (distance < closetDistance) {
          closetDistance = distance;
          closetEnemy = enemy.position;
        }
      }
    }
    return closetEnemy;
  }

  // HOMEWORK 4 - TODO
  /**
   * This function spawns in all of the items in "items.json"
   *
   * You shouldn't have to put any new code here, however, you will have to modify items.json.
   *
   * Make sure you are spawning in 5 pistols and 5 laser guns somewhere (accessible) in your world.
   *
   * You'll notice that right now, some healthpacks are also spawning in. These also drop from guards.
   * Feel free to spawn some healthpacks if you want, or you can just let the player suffer >:)
   */
  spawnItems(): void {
    // Get the item data
    let itemData = this.load.getObject("itemData");

    for (let item of itemData.items) {
      if (item.type === "healthpack") {
        // Create a healthpack
        this.createHealthpack(
          new Vec2(item.position[0] / 2, item.position[1] / 2)
        );
      } else if (item.type === "healthmax") {
        this.createMaxhealth(
          new Vec2(item.position[0] / 2, item.position[1] / 2)
        );
      } else if (item.type === "attackspeed") {
        this.createAttackspeed(
          new Vec2(item.position[0] / 2, item.position[1] / 2)
        );
      } else if (item.type === "attackdamage") {
        this.createAttackDamage(
          new Vec2(item.position[0] / 2, item.position[1] / 2)
        );
      } else if (item.type === "speed") {
        this.createSpeed(new Vec2(item.position[0] / 2, item.position[1] / 2));
      } else if (item.type === "checkpoint") {
        this.createCheckpoint(
          new Vec2(item.position[0] / 2, item.position[1] / 2)
        );
      }
    }
  }

  /**
   *
   * Creates and returns a new weapon
   * @param type The weaponType of the weapon, as a string
   */
  createWeapon(type: string): Weapon {
    let weaponType = <WeaponType>(
      RegistryManager.getRegistry("weaponTypes").get(type)
    );

    let sprite = this.add.sprite(weaponType.spriteKey, "primary");

    return new Weapon(sprite, weaponType, this.battleManager);
  }

  /**
   * Creates a healthpack at a certain position in the world
   * @param position
   */
  createHealthpack(position: Vec2): void {
    let sprite = this.add.sprite("healthpack", "primary");
    let healthpack = new Healthpack(sprite);
    healthpack.moveSprite(position);
    this.items.push(healthpack);
  }

  createMaxhealth(position: Vec2): void {
    let sprite = this.add.sprite("healthmax", "primary");
    let maxhealth = new MaxHealth(sprite);
    maxhealth.moveSprite(position);
    this.items.push(maxhealth);
  }

  createSpeed(position: Vec2): void {
    let sprite = this.add.sprite("speed", "primary");
    let speed = new Speed(sprite);
    speed.moveSprite(position);
    this.items.push(speed);
  }
  createAttackDamage(position: Vec2): void {
    let sprite = this.add.sprite("attackdamage", "primary");
    let attackdamage = new AttackDamage(sprite);
    attackdamage.moveSprite(position);
    this.items.push(attackdamage);
  }
  createAttackspeed(position: Vec2): void {
    let sprite = this.add.sprite("attackspeed", "primary");
    let attackspeed = new AttackSpeed(sprite);
    attackspeed.moveSprite(position);
    this.items.push(attackspeed);
  }

  createCheckpoint(position: Vec2) {
    let sprite = this.add.sprite("checkpoint", "primary");
    let checkpoint = new Checkpoint(sprite);
    checkpoint.moveSprite(position);
    this.items.push(checkpoint);
  }

  /**
   * Initalizes all weapon types based of data from weaponData.json
   */
  initializeWeapons(): void {
    let weaponData = this.load.getObject("weaponData");

    for (let i = 0; i < weaponData.numWeapons; i++) {
      let weapon = weaponData.weapons[i];

      // Get the constructor of the prototype
      let constr = RegistryManager.getRegistry("weaponTemplates").get(
        weapon.weaponType
      );

      // Create a weapon type
      let weaponType = new constr();

      // Initialize the weapon type
      weaponType.initialize(weapon);

      // Register the weapon type
      RegistryManager.getRegistry("weaponTypes").registerItem(
        weapon.name,
        weaponType
      );
    }
  }

  // HOMEWORK 4 - TODO
  /**
   * Change positions of the player characters to whatever fits your map
   */
  initializePlayer(): void {
    // Create the inventory
    let inventory = new InventoryManager(
      this,
      1,
      "inventorySlot",
      new Vec2(16, 16),
      2,
      "slots1",
      "items1"
    );
    let startingWeapon = this.createWeapon("weak_pistol");
    inventory.addItem(startingWeapon);

    // Create the players
    this.mainPlayer = this.add.animatedSprite("player1", "primary");
    this.mainPlayer.position.set(4 * 8, 62 * 8);
    this.mainPlayer.addPhysics(new AABB(Vec2.ZERO, new Vec2(8, 8)));
    //First thislayeree based, starts off with a knife and is short ranged
    this.mainPlayer.addAI(PlayerController, {
      speed: 100,
      health: 1000, //original was 25 //
      maxHealth: 1200, //adding maxhealth
      inventory: inventory,
      items: this.items,
      inputEnabled: true,
      range: 100, //weak pistol range
      weapon: startingWeapon,
    });
    this.mainPlayer.animation.play("IDLE");
    (<PlayerController>this.mainPlayer._ai).inventory.setActive(true);
  }

  /**
   * // HOMEWORK 4 - TODO
   * This function creates the navmesh for the game world.
   *
   * It reads in information in the navmesh.json file.
   * The format of the navmesh.json file is as follows
   *
   * {
   *  // An array of positions on the tilemap. You can see the position of your mouse in [row, col]
   *  // while editing a map in Tiled, and can just multiply those values by the tile size, 16x16
   *      "nodes": [[100, 200], [50, 400], ...]
   *
   *  // An array of edges between nodes. The numbers here correspond to indices in the "nodes" array above.
   *  // Note that edges are not directed here. An edge [0, 1] foes in both directions.
   *      "edges": [[0, 1], [2, 4], ...]
   * }
   *
   * The navmesh you create should be distinctly different from the one given as an example.
   */
  createNavmesh(): void {
    // Add a layer to display the graph
    let gLayer = this.addLayer("graph");
    gLayer.setHidden(true);

    let navmeshData = this.load.getObject("navmesh");

    // Create the graph
    this.graph = new PositionGraph();

    // Add all nodes to our graph
    for (let node of navmeshData.nodes) {
      this.graph.addPositionedNode(new Vec2(node[0] / 2, node[1] / 2));
      this.add.graphic(GraphicType.POINT, "graph", {
        position: new Vec2(node[0] / 2, node[1] / 2),
      });
    }

    // Add all edges to our graph
    for (let edge of navmeshData.edges) {
      this.graph.addEdge(edge[0], edge[1]);
      this.add.graphic(GraphicType.LINE, "graph", {
        start: this.graph.getNodePosition(edge[0]),
        end: this.graph.getNodePosition(edge[1]),
      });
    }

    // Set this graph as a navigable entity
    let navmesh = new Navmesh(this.graph);

    this.navManager.addNavigableEntity(hw4_Names.NAVMESH, navmesh);
  }

  // HOMEWORK 4 - TODO
  /**
   * Here is where we initalize all enemies that are spawned in the scene, based off the enemy.json you'll create based on your own tilemap.
   * The format for the json file is:
   * {
   *       "position": [x, y], // x and y start positions
   *       "mode": "guard" or "patrol", // choose whether this enemy is guarding one position or moving on a route
   *       "route": [11, 2, 5, ...], // if mode is patrol, set the route of nodes the enemy will take
   *       "guardPosition": [968, 472], // if mode is guard, set the guardPosition
   *       "health": 5, // health value
   *       "type": "gun_enemy" // enemy type, which can be gun_enemy, knife_enemy, custom_enemy1, and custom_enemy2.
   *  }
   *
   * After setting up the json, you'll have to properly assign AI behaviors using our GOAP AI system.
   * In this framework, AI are given actions they can perform with different costs to denote priority, along with preconditions
   * to perform certain actions, status effects that those actions give after completion, and goals to be reached.
   * Once you have your actions and goals defined, you can let your AI interact with the environment,
   * having different behavior patterns based on whether certain statuses are met.
   *
   * Here you'll use a simple version of this GOAP system to give different behaviors to enemies, just by modifying costs and preconditions.
   */
  initializeEnemies() {
    // Get the enemy data
    const enemyData = this.load.getObject("enemyData");

    // Create an enemies array
    this.enemies = new Array(enemyData.numEnemies);

    // HOMEWORK 4 - TODO
    /**
     * Here we have the current actions that are given to the two existing enemy types, the gun enemy and knife enemy.
     * Both AI will look to move towards a player and attack once in range at the start, trying to get the
     * best path to REACHED_GOAL, a ending status that signifies the AI has reached it's goal and should start over to look
     * for a new plan.
     *
     * However, their behavior differs once they reach low health:
     *
     * The gun enemy will immediately retreat once low health as the best path to REACHED_GOAL, while the knife enemy will keep attacking if they're still
     * in range, only retreating if the player moves away from them.
     *
     * Once you implement the berserk action, you'll also have to add them here as a possible action both enemies can take.
     * The behaviors each enemy should have with berserk are as follows:
     *
     * Knife enemy: Should berserk immediately once low health, even if they're close enough to attack.
     *
     * Gun enemy: Should berserk immediately after they succesfully retreat from the player and have been low health. (The enemy will technically be full
     * health after succefully retreating, but the status low health won't be removed). This should have higher priority than moving to attack or attacking if in range.
     *
     * For both enemies, you can only use berserk once, just like retreat.
     *
     * /////////////////
     *
     * You'll also have to create two new enemies that have completely different behaviors from the existing two enemy types.
     * You can be as creative as you want with how your new enemies will act. Maybe an enemy immediately berserks once seeing the player,
     * or they retreat after trying to attack once, there's no restrictions on what preconditions or effects an action can have.
     *
     * The only restriction is that your created enemies must have all 4 actions given to them, you cannot remove an action to easily get a different behavior.
     * I'd also avoid creating situations where different paths to REACHED_GOAL have the same cost, it won't break anything, but it will always
     * choose one of those paths due to how the path selection is implemented, there won't be any randomness given two or more equally valid paths.
     *
     */

    let actionKnife = [
      new AttackAction(3, [hw4_Statuses.IN_RANGE], [hw4_Statuses.REACHED_GOAL]),
      new Move(2, [], [hw4_Statuses.IN_RANGE], { inRange: 20 }),
      //new Retreat(1, [hw4_Statuses.LOW_HEALTH, hw4_Statuses.CAN_RETREAT], [hw4_Statuses.REACHED_GOAL], {retreatDistance: 200}),
      new Berserk(
        1,
        [hw4_Statuses.LOW_HEALTH, hw4_Statuses.CAN_BERSERK],
        [hw4_Statuses.REACHED_GOAL],
        { retreatDistance: 200 }
      ),
    ];

    // I DONT THINK KNIFE ENEMIES CAN RETREAT RIGHT?
    //the result of the above makes the enemy retreat immediately after berserk

    let actionsGun = [
      new AttackAction(3, [hw4_Statuses.IN_RANGE], [hw4_Statuses.REACHED_GOAL]),
      new Move(2, [], [hw4_Statuses.IN_RANGE], { inRange: 100 }),
      new Retreat(
        1,
        [hw4_Statuses.LOW_HEALTH, hw4_Statuses.CAN_RETREAT],
        [hw4_Statuses.REACHED_GOAL, hw4_Statuses.CAN_BERSERK],
        { retreatDistance: 200 }
      ),
      new Berserk(
        1,
        [hw4_Statuses.LOW_HEALTH, hw4_Statuses.CAN_BERSERK],
        [hw4_Statuses.REACHED_GOAL]
      ),
    ];

    //actionsGun=actionKnife;

    let actionsLongRange = [
      new AttackAction(2, [hw4_Statuses.IN_RANGE], [hw4_Statuses.REACHED_GOAL]),
      new Move(3, [], [hw4_Statuses.IN_RANGE], { inRange: 1000 }),
      new Retreat(
        10,
        [hw4_Statuses.LOW_HEALTH, hw4_Statuses.CAN_RETREAT],
        [hw4_Statuses.REACHED_GOAL],
        { retreatDistance: 200 }
      ),
      new Berserk(11, [hw4_Statuses.CAN_BERSERK], [hw4_Statuses.REACHED_GOAL]),
    ];
    let actionsTanky = [
      new AttackAction(2, [hw4_Statuses.IN_RANGE], [hw4_Statuses.REACHED_GOAL]),
      new Move(3, [], [hw4_Statuses.IN_RANGE], { inRange: 20 }),
      new Retreat(
        1,
        [hw4_Statuses.LOW_HEALTH, hw4_Statuses.CAN_RETREAT],
        [hw4_Statuses.REACHED_GOAL],
        { retreatDistance: 200 }
      ),
      new Berserk(10, [hw4_Statuses.CAN_BERSERK], [hw4_Statuses.REACHED_GOAL]),
    ];
    let customEnemyAction1 = actionsLongRange;
    let customEnemyAction2 = actionsTanky;

    // HOMEWORK 4 - TODO
    /**
     * To help facillate testing the proper sequence of actions that your AI should take, since it can be hard visually,
     *  I've created some test methods you can use to determine whether your AI is behaving correctly.
     *
     * generateGoapPlans will generate all possible action sequences your enemy will taken based on every possible status combination. Use
     * this to generate the plans given the actions you've set up and all possible statuses an enemy can have.
     *
     * testGoapPlans will actually test whether the plans you've created from generateGoapPlans match with the expected behavior patterns.
     * You'll see that there's long strings giving the expected output for the gun enemy and knife enemy. If you see no failed assertions
     * after running this method, that means you've implemented your berserk action for the gun enemy and knife enemy correctly.
     *
     * Also, testGoapPlans can verify whether your custom two enemies are different from the existing enemy types and from each other.
     *
     * Use these functions below to make sure your AI are taking the proper actions given certain situations.
     */

    // let resultGun = this.generateGoapPlans(actionsGun, [hw4_Statuses.IN_RANGE, hw4_Statuses.LOW_HEALTH, hw4_Statuses.CAN_BERSERK, hw4_Statuses.CAN_RETREAT], hw4_Statuses.REACHED_GOAL);
    // let resultKnife = this.generateGoapPlans(actionKnife, [hw4_Statuses.IN_RANGE, hw4_Statuses.LOW_HEALTH, hw4_Statuses.CAN_BERSERK, hw4_Statuses.CAN_RETREAT], hw4_Statuses.REACHED_GOAL);
    //
    //
    // let resultLongRange = null;
    // let resultTanky = null
    // resultLongRange= this.generateGoapPlans(actionsLongRange, [hw4_Statuses.IN_RANGE, hw4_Statuses.LOW_HEALTH, hw4_Statuses.CAN_BERSERK, hw4_Statuses.CAN_RETREAT], hw4_Statuses.REACHED_GOAL);
    // resultTanky = this.generateGoapPlans(actionsTanky, [hw4_Statuses.IN_RANGE, hw4_Statuses.LOW_HEALTH, hw4_Statuses.CAN_BERSERK, hw4_Statuses.CAN_RETREAT], hw4_Statuses.REACHED_GOAL);
    //
    //
    // this.testGoapPlans(resultGun, resultKnife, resultLongRange, resultTanky);
    //
    // console.log("test goap goals plan")
    //this.testGoapPlans(resultGun,resultKnife)

    // Initialize the enemies
    for (let i = 0; i < enemyData.numEnemies; i++) {
      let data = enemyData.enemies[i];

      // Create an enemy
      this.enemies[i] = this.add.animatedSprite(data.type, "primary");
      this.enemies[i].position.set(data.position[0] / 2, data.position[1] / 2);
      this.enemies[i].animation.play("IDLE");

      // Activate physics
      this.enemies[i].addPhysics(new AABB(Vec2.ZERO, new Vec2(8, 8)));

      if (data.route) {
        data.route = data.route.map((index: number) =>
          this.graph.getNodePosition(index)
        );
      }

      if (data.guardPosition) {
        data.guardPosition = new Vec2(
          data.guardPosition[0] / 2,
          data.guardPosition[1] / 2
        );
      }

      /*initalize status and actions for each enemy. This can be edited if you want your custom enemies to start out with
            different statuses, but dont remove these statuses for the original two enemies*/
      let statusArray: Array<string> = [
        hw4_Statuses.CAN_RETREAT,
        hw4_Statuses.CAN_BERSERK,
      ];

      //Vary weapon type and choose actions
      let weapon;
      let actions;
      let range;
      // HOMEWORK 4 - TODO
      /**
       * Once you've set up the actions for your custom enemy types, assign them here so they'll be spawned in your game.
       * They can have any weapons you want.
       *
       * Your game in the end should have an equal amount of each enemy type (Around 25% of each type of enemy), and at least 20 enemies in
       * total. Also, half the enemies should patrol while the other half guard.
       */
      if (data.type === "gun_enemy") {
        weapon = this.createWeapon("weak_pistol");
        actions = actionsGun;
        range = 100;
      } else if (data.type === "knife_enemy") {
        weapon = this.createWeapon("knife");
        actions = actionKnife;
        range = 20;
      } else if (data.type === "custom_enemy1") {
        weapon = this.createWeapon("pistol");
        actions = customEnemyAction1;
        range = 1000;
        //ADD CODE HERE
      } else if (data.type === "custom_enemy2") {
        weapon = this.createWeapon("knife");
        actions = customEnemyAction2;
        actions = actionsTanky;
        range = 20;
      }

      let enemyOptions = {
        defaultMode: data.mode,
        patrolRoute: data.route, // This only matters if they're a patroller
        guardPosition: data.guardPosition, // This only matters if the're a guard
        health: data.health,
        player1: this.mainPlayer,
        weapon: weapon,
        goal: hw4_Statuses.REACHED_GOAL,
        status: statusArray,
        actions: actions,
        inRange: range,
      };

      this.enemies[i].addAI(EnemyAI, enemyOptions);
    }
    //console.log("enimies initialized")
  }

  powerset(array: Array<string>): Array<Array<string>> {
    return array.reduce((a, v) => a.concat(a.map((r) => [v].concat(r))), [[]]);
  }

  /**
   * This function takes all possible actions and all possible statuses, and generates a list of all possible combinations and statuses
   * and the actions that are taken when run through the GoapActionPlanner.
   */
  generateGoapPlans(
    actions: Array<GoapAction>,
    statuses: Array<string>,
    goal: string
  ): string {
    let planner = new GoapActionPlanner();
    // Get all possible status combinations
    let statusComboinations = this.powerset(statuses);
    let map = new Map<String>();
    //console.log(statusComboinations.toString());

    for (let s of statusComboinations) {
      // Get plan
      let plan = planner.plan(goal, actions, s, null);
      let givenStatuses = "Given: ";
      s.forEach((v) => (givenStatuses = givenStatuses + v + ", "));

      map.add(givenStatuses, plan.toString());
    }

    return map.toString();
  }

  /**
   * Use this function to test and verify that your created plans are correct. Note that you should only start using this function once you're ready to
   * test your berserk action for the existing gun and knife enemies. Your custom enemies can be added whenever they're ready,
   * your tests will pass if you leave the arguments for both null.
   */
  testGoapPlans(
    gunPlans: string,
    knifePlans: string,
    customPlan1: string,
    customPlan2: string
  ) {
    let expectedKnifeResult =
      `Given:  -> Top -> (Move) -> (AttackAction)\n` +
      `Given: IN_RANGE,  -> Top -> (AttackAction)\n` +
      `Given: LOW_HEALTH,  -> Top -> (Move) -> (AttackAction)\n` +
      `Given: LOW_HEALTH, IN_RANGE,  -> Top -> (AttackAction)\n` +
      `Given: CAN_BERSERK,  -> Top -> (Move) -> (AttackAction)\n` +
      `Given: CAN_BERSERK, IN_RANGE,  -> Top -> (AttackAction)\n` +
      `Given: CAN_BERSERK, LOW_HEALTH,  -> Top -> (Berserk)\n` +
      `Given: CAN_BERSERK, LOW_HEALTH, IN_RANGE,  -> Top -> (Berserk)\n` +
      `Given: CAN_RETREAT,  -> Top -> (Move) -> (AttackAction)\n` +
      `Given: CAN_RETREAT, IN_RANGE,  -> Top -> (AttackAction)\n` +
      `Given: CAN_RETREAT, LOW_HEALTH,  -> Top -> (Retreat)\n` +
      `Given: CAN_RETREAT, LOW_HEALTH, IN_RANGE,  -> Top -> (AttackAction)\n` +
      `Given: CAN_RETREAT, CAN_BERSERK,  -> Top -> (Move) -> (AttackAction)\n` +
      `Given: CAN_RETREAT, CAN_BERSERK, IN_RANGE,  -> Top -> (AttackAction)\n` +
      `Given: CAN_RETREAT, CAN_BERSERK, LOW_HEALTH,  -> Top -> (Berserk)\n` +
      `Given: CAN_RETREAT, CAN_BERSERK, LOW_HEALTH, IN_RANGE,  -> Top -> (Berserk)\n`;

    let expectedGunResult =
      `Given:  -> Top -> (Move) -> (AttackAction)\n` +
      `Given: IN_RANGE,  -> Top -> (AttackAction)\n` +
      `Given: LOW_HEALTH,  -> Top -> (Move) -> (AttackAction)\n` +
      `Given: LOW_HEALTH, IN_RANGE,  -> Top -> (AttackAction)\n` +
      `Given: CAN_BERSERK,  -> Top -> (Move) -> (AttackAction)\n` +
      `Given: CAN_BERSERK, IN_RANGE,  -> Top -> (AttackAction)\n` +
      `Given: CAN_BERSERK, LOW_HEALTH,  -> Top -> (Berserk)\n` +
      `Given: CAN_BERSERK, LOW_HEALTH, IN_RANGE,  -> Top -> (Berserk)\n` +
      `Given: CAN_RETREAT,  -> Top -> (Move) -> (AttackAction)\n` +
      `Given: CAN_RETREAT, IN_RANGE,  -> Top -> (AttackAction)\n` +
      `Given: CAN_RETREAT, LOW_HEALTH,  -> Top -> (Retreat)\n` +
      `Given: CAN_RETREAT, LOW_HEALTH, IN_RANGE,  -> Top -> (Retreat)\n` +
      `Given: CAN_RETREAT, CAN_BERSERK,  -> Top -> (Move) -> (AttackAction)\n` +
      `Given: CAN_RETREAT, CAN_BERSERK, IN_RANGE,  -> Top -> (AttackAction)\n` +
      `Given: CAN_RETREAT, CAN_BERSERK, LOW_HEALTH,  -> Top -> (Retreat)\n` +
      `Given: CAN_RETREAT, CAN_BERSERK, LOW_HEALTH, IN_RANGE,  -> Top -> (Retreat)\n`;

    console.assert(gunPlans === expectedGunResult, {
      errorMsg:
        "Your created gun enemy plan does not match the expected behavior patterns",
    });

    console.assert(knifePlans === expectedKnifeResult, {
      errorMsg:
        "Your created knife enemy plan does not match the expected behavior patterns",
    });

    if (customPlan1 !== null) {
      console.assert(customPlan1 !== expectedGunResult, {
        errorMsg:
          "Your first custom plan has the same behavior as the gun enemy",
      });
      console.assert(customPlan1 !== expectedKnifeResult, {
        errorMsg:
          "Your first custom plan has the same behavior as the knife enemy",
      });
    }

    if (customPlan2 !== null) {
      console.assert(customPlan2 !== expectedGunResult, {
        errorMsg:
          "Your second custom plan has the same behavior as the gun enemy",
      });
      console.assert(customPlan2 !== expectedKnifeResult, {
        errorMsg:
          "Your second custom plan has the same behavior as the knife enemy",
      });
      if (customPlan1 !== null)
        console.assert(customPlan2 !== customPlan1, {
          errorMsg: "Both of your custom plans have the same behavior",
        });
    }
  }
}
