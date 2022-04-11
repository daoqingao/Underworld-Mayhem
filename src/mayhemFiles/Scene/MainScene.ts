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
import Berserk from "../../Wolfie2D/AI/EnemyActions/Berserk";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import MaxHealth from "../GameSystems/items/MaxHealth";
import Speed from "../GameSystems/items/Speed";
import AttackSpeed from "../GameSystems/items/AttackSpeed";
import AttackDamage from "../GameSystems/items/AttackDamage";
import Checkpoint from "../GameSystems/items/Checkpoint";
import CheckpointCleared from "../GameSystems/items/CheckpointCleared";
import NextLevel from "./NextLevel";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import UIElement from "../../Wolfie2D/Nodes/UIElement";

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

  // The battle manager for the scenes
  private battleManager: BattleManager;

  // Player health
  private healthDisplays: Label;

  // Player Damage
  private attackDisplays: Label;

  private maxhealthDisplays: Label;

  private pauseButton: Button;

  private playButton: Button;

  private attackDamageBuff = 0;
  private attackSpeedBuff = 0;
  private speedBuff = 0;
  private healthupBuff = 0;

  attackDamageBuffLabel: Label;
  speedBuffLabel: Label;
  attackSpeedBuffLabel: Label;
  healthupBuffLabel: Label;

  knifeEnemyClone: AnimatedSprite;
  healthbar: Label;
  healthbargreen: Sprite;

  totalEnemiesKilled = 0;
  tileMapMaxSize: Vec2;
  loadScene() {
    // Load the player and enemy spritesheets

    //there will only be one player
    this.load.spritesheet(
      "mainplayer",
      "mayhemAssets/spritesheets/mainplayer.json"
    );

    this.load.spritesheet("imp", "mayhemAssets/spritesheets/imp.json");

    this.load.spritesheet("slice", "mayhemAssets/spritesheets/slice.json");
    this.load.tilemap("level", "mayhemAssets/tilemaps/mayhemTileJson.json");
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
    this.load.image(
      "healthbarEmpty",
      "mayhemAssets/sprites/healthbarEmpty.png"
    );
    this.load.image(
      "healthbarGreen",
      "mayhemAssets/sprites/healthbarGreen.png"
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
    this.tileMapMaxSize = tilemapSize;

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
    this.receiver.subscribe("newbuff");
    // this.receiver.subscribe(hw4_Events.UNLOAD_ASSET);

    // Spawn items into the world
    this.spawnItems();

    ///adding healthbar
    this.addUILayer("healthbar");
    var healthbar = this.add.sprite("healthbarEmpty", "healthbar");
    healthbar.position.set(100, 16);

    this.healthbargreen = this.add.sprite("healthbarGreen", "healthbar");
    this.healthbargreen.position.set(100, 16);
    ///(<PlayerController>this.mainPlayer._ai).health
    this.healthbargreen.size.set(
      (<PlayerController>this.mainPlayer._ai).health,
      16
    );
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
        position: new Vec2(260, 16),
        text: "Pause",
      }
    );
    this.pauseButton.size.set(200, 50);
    this.pauseButton.borderColor = Color.TRANSPARENT;
    this.pauseButton.backgroundColor = Color.TRANSPARENT;
    this.pauseButton.onClickEventId = "pause";

    this.playButton = <Button>this.add.uiElement(UIElementType.BUTTON, "play", {
      position: new Vec2(230, 16),
      text: "Play",
    });
    this.playButton.size.set(200, 50);
    this.playButton.borderColor = Color.TRANSPARENT;
    this.playButton.backgroundColor = Color.TRANSPARENT;
    this.playButton.onClickEventId = "play";

    this.receiver.subscribe("pause");
    this.receiver.subscribe("play");

    this.addUILayer("attackdamage");
    this.addUILayer("attackspeed");
    this.addUILayer("speed");
    this.addUILayer("healthup");
    this.addUILayer("buffspicture").setDepth(100);
    var attackdamagepic = this.add.sprite("attackdamage", "buffspicture");
    attackdamagepic.position.set(280, 30);
    var attackspeedpic = this.add.sprite("attackspeed", "buffspicture");
    attackspeedpic.position.set(280, 50);
    var speedpic = this.add.sprite("speed", "buffspicture");
    speedpic.position.set(280, 70);
    var healthpic = this.add.sprite("healthmax", "buffspicture");
    healthpic.position.set(280, 90);

    this.attackDamageBuffLabel = <Label>this.add.uiElement(
      UIElementType.LABEL,
      "attackdamage",
      {
        position: new Vec2(295, 30),
        text: "" + this.attackDamageBuff,
      }
    );
    this.attackDamageBuffLabel.textColor = Color.WHITE;

    this.attackSpeedBuffLabel = <Label>this.add.uiElement(
      UIElementType.LABEL,
      "attackspeed",
      {
        position: new Vec2(295, 50),
        text: "" + this.attackSpeedBuff,
      }
    );
    this.attackSpeedBuffLabel.textColor = Color.WHITE;

    this.speedBuffLabel = <Label>this.add.uiElement(
      UIElementType.LABEL,
      "speed",
      {
        position: new Vec2(295, 70),
        text: "" + this.speedBuff,
      }
    );
    this.speedBuffLabel.textColor = Color.WHITE;

    this.healthupBuffLabel = <Label>this.add.uiElement(
      UIElementType.LABEL,
      "healthup",
      {
        position: new Vec2(295, 90),
        text: "" + this.healthupBuff,
      }
    );
    this.healthupBuffLabel.textColor = Color.WHITE;
  }

  lootGenerate(pos: Vec2) {
    if (Math.random() < 0.4) {
      // Spawn a healthpack
      let min = 1;
      let max = 4;
      let lootType = Math.floor(Math.random() * (max - min) + min);
      // this.emitter.fireEvent("healthpack", { pos});
      if (lootType === 1) {
        this.createAttackDamage(pos);
      }
      if (lootType === 2) {
        this.createAttackspeed(pos);
      }
      if (lootType === 3) {
        // this.createHealthpack(pos)
      }
      if (lootType === 4) {
        this.createMaxhealth(pos);
      }
    }
  }
  updateScene(deltaT: number): void {
    while (this.receiver.hasNextEvent()) {
      let event = this.receiver.getNextEvent();
      if (event.isType("healthpack")) {
        this.createHealthpack(event.data.get("position"));
      }
      if (event.isType("enemyDied")) {
        for (let i = 0; i < this.enemies.length; i++) {
          if (this.enemies[i] === event.data.get("enemy")) {
            this.enemies[i].hpDisplay.destroy();
          }
        }

        this.lootGenerate(event.data.get("enemy").position.clone());
        this.enemies = this.enemies.filter(
          (enemy) => enemy !== event.data.get("enemy")
        );
        this.battleManager.enemies = this.battleManager.enemies.filter(
          (enemy) => enemy !== <BattlerAI>event.data.get("enemy")._ai
        );
        this.totalEnemiesKilled++;
        this.spawnRandomEnemy();
        this.spawnRandomEnemy();
      }
      if (event.isType("checkpoint_cleared")) {
        let sprite = this.add.sprite("checkpointcleared", "primary");
        let checkpointcleared = new CheckpointCleared(sprite);
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
      if (event.isType("newbuff")) {
        var buff = event.data.get("buff");
        if (buff instanceof AttackDamage) {
          this.attackDamageBuff += 1;
          this.attackDamageBuffLabel.text = "" + this.attackDamageBuff;
        }
        if (buff instanceof AttackSpeed) {
          this.attackSpeedBuff += 1;
          this.attackSpeedBuffLabel.text = "" + this.attackSpeedBuff;
        }
        if (buff instanceof Speed) {
          this.speedBuff += 1;
          this.speedBuffLabel.text = "" + this.speedBuff;
        }
        if (buff instanceof MaxHealth) {
          this.healthupBuff += 1;
          this.healthupBuffLabel.text = "" + this.healthupBuff;
        }
      }
      if (event.isType(hw4_Events.UNLOAD_ASSET)) {
        let asset = this.sceneGraph.getNode(event.data.get("node"));
        asset.destroy();
      }
    }
    // check health of each player
    let health = (<BattlerAI>this.mainPlayer._ai).health;

    //If both are dead, game over

    if (health <= 0) {
      this.mainPlayer.position = new Vec2(-1000, -1000);
      this.mainPlayer.visible = false;
      this.sceneManager.changeToScene(GameOver);
    }
    // Update health gui
    this.healthDisplays.text = "Health: " + health;
    this.attackDisplays.text =
      "Attack: " + (<PlayerController>this.mainPlayer._ai).weapon.type.damage;
    this.maxhealthDisplays.text =
      "Max Health: " + (<PlayerController>this.mainPlayer._ai).maxHealth;

    //update enemy hp

    for (let i = 0; i < this.enemies.length; i++) {
      if (this.enemies[i]) {
        // (<GameNode>data.hpdisplay).destroy();
        this.enemies[i].hpDisplay.setPosition(
          new Vec2(this.enemies[i].position.x, this.enemies[i].position.y)
        );
        this.enemies[i].hpDisplay.text =
          "" + (<EnemyAI>this.enemies[i]._ai).health;
      }
      // data.hpdisplay= <Label>this.add.uiElement(
      //   UIElementType.LABEL,
      //   "primary",
      //   {
      //     position: new Vec2(this.enemies[i].position.x ,this.enemies[i].position.y),
      //     text: "" + data.health
      //   }
      // );
    }
    var currenthp = (<PlayerController>this.mainPlayer._ai).health;
    var maxhp = (<PlayerController>this.mainPlayer._ai).maxHealth;
    this.healthbargreen.size.set((currenthp / maxhp) * 128, 16);

    // Debug mode graph
    if (Input.isKeyJustPressed("g")) {
      this.getLayer("graph").setHidden(!this.getLayer("graph").isHidden());
    }
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
    this.mainPlayer = this.add.animatedSprite("mainplayer", "primary");
    this.mainPlayer.position.set(4 * 8, 62 * 8);
    this.mainPlayer.addPhysics(new AABB(Vec2.ZERO, new Vec2(8, 8)));
    //First thislayeree based, starts off with a knife and is short ranged
    this.mainPlayer.addAI(PlayerController, {
      speed: 100,
      health: 128, //original was 25 //
      maxHealth: 128, //adding maxhealth
      inventory: inventory,
      items: this.items,
      inputEnabled: true,
      range: 150, //weak pistol range
      weapon: startingWeapon,
    });
    this.mainPlayer.animation.play("face_right");
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

  actionKnife = [
    new AttackAction(3, [hw4_Statuses.IN_RANGE], [hw4_Statuses.REACHED_GOAL]),
    new Move(2, [], [hw4_Statuses.IN_RANGE], { inRange: 20 }),
    //new Retreat(1, [hw4_Statuses.LOW_HEALTH, hw4_Statuses.CAN_RETREAT], [hw4_Statuses.REACHED_GOAL], {retreatDistance: 200}),,
  ];
  actionsGun = [
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

  spawnEnemy(data: any, pos: Vec2) {
    if (this.enemies.length >= 100) {
      return; //hard limit on the max enemies there can be in this game
    }

    // Create an enemy

    this.enemies.push(this.add.animatedSprite(data.type, "primary"));
    let lastIndex = this.enemies.length - 1;
    this.enemies[lastIndex].position.set(
      data.position[0] / 2,
      data.position[1] / 2
    );
    this.enemies[lastIndex].animation.play("face_right");
    this.enemies[lastIndex].addPhysics(new AABB(Vec2.ZERO, new Vec2(8, 8)));

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

    let weapon;
    let actions;
    let range;
    if (data.type === "gun_enemy") {
      weapon = this.createWeapon("weak_pistol");
      actions = this.actionsGun;
      range = 100;
    } else if (data.type === "imp") {
      weapon = this.createWeapon("knife");
      actions = this.actionKnife;
      range = 20;
      //ADD CODE HERE
    }

    var enemyhp = <Label>this.add.uiElement(UIElementType.LABEL, "primary", {
      position: new Vec2(data.position[0] / 2, data.position[1] / 2),
      text: "" + data.health,
    });
    enemyhp.textColor = Color.WHITE;
    this.enemies[lastIndex].hpDisplay = enemyhp;

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
    this.enemies[lastIndex].addAI(EnemyAI, enemyOptions);
    if (pos !== null) {
      this.enemies[lastIndex].position = pos.clone();
    }
    this.battleManager.setEnemies(
      this.enemies.map((enemy) => <BattlerAI>enemy._ai)
    );
  }
  initializeEnemies() {
    this.enemies = new Array(0);
    const enemyData = this.load.getObject("enemyData");
    for (let i = 0; i < enemyData.numEnemies; i++) {
      let data = enemyData.enemies[i];
      this.spawnEnemy(JSON.parse(JSON.stringify(data)), null);
    }
  }

  //this spawns in the last enemy of the enemy.json
  spawnImp(pos: Vec2): void {
    const enemyData = this.load.getObject("enemyData");
    let data = enemyData.enemies[20];
    this.spawnEnemy(JSON.parse(JSON.stringify(data)), pos);
  }
  spawnRandomEnemy(): void {
    let x = Math.random() * this.tileMapMaxSize.x;
    let y = Math.random() * this.tileMapMaxSize.y;
    let newPos = new Vec2(x, y);
    this.spawnImp(newPos);
  }
}
