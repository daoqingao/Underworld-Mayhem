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
import MaxHealth from "../GameSystems/items/MaxHealth";
import Speed from "../GameSystems/items/Speed";
import AttackSpeed from "../GameSystems/items/AttackSpeed";
import AttackDamage from "../GameSystems/items/AttackDamage";
import Checkpoint from "../GameSystems/items/Checkpoint";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import MultiProjectile from "../GameSystems/items/MultiProjectile";
import ParticleSystem from "../../Wolfie2D/Rendering/Animations/ParticleSystem";
import Won from "./Won";
import Timer from "../../Wolfie2D/Timing/Timer";

export default class mainScene extends Scene {
  // The player

  protected nextLevel: new (...args: any) => mainScene;
  protected currentLevel: String;

  protected mainPlayer: AnimatedSprite;

  protected jackson: AnimatedSprite;

  protected dialogueTimer = new Timer(10000);
  protected dialogueOn = false;
  protected toolTipTimer = new Timer(4000);
  protected toolTipOn = false;
  protected toolTip: Label;
  protected dialogueNumber = 0;
  protected bossSpawnTimer = new Timer(10000);

  // A list of enemies
  protected enemies: Array<AnimatedSprite>;

  // The wall layer of the tilemap to use for bullet visualization
  protected walls: OrthogonalTilemap;

  protected nextText: String;

  // The position graph for the navmesh
  private graph: PositionGraph;

  // A list of items in the scene
  protected items: Array<Item>;

  // The battle manager for the scenes
  protected battleManager: BattleManager;

  // Player health
  protected healthDisplays: Label;

  // Player Damage
  protected attackDisplays: Label;

  protected maxhealthDisplays: Label;

  protected enemyKilled: Label;

  protected dialogue: Label;

  protected attackDamageBuff = 0;
  protected attackSpeedBuff = 0;
  protected speedBuff = 0;
  protected healthupBuff = 0;
  protected projectileBuff = 0;

  attackDamageBuffLabel: Label;
  speedBuffLabel: Label;
  attackSpeedBuffLabel: Label;
  healthupBuffLabel: Label;
  projectileBuffLabel: Label;
  burn : Sprite;
  slow : Sprite;

  knifeEnemyClone: AnimatedSprite;
  healthbar: Label;
  healthbargreen: Sprite;

  totalEnemiesKilled = 0;
  enemiesNeeded = 0;
  checkpointDropBoolean = false;
  tileMapMaxSize: Vec2;

  pauseText: Label;
  system:ParticleSystem
  bossSpawnOn = false;

  mainLoadScene() {
    this.load.spritesheet(
      "mainplayer",
      "mayhemAssets/spritesheets/mainplayer.json"
    );

    this.load.spritesheet("imp", "mayhemAssets/spritesheets/imp.json");
    this.load.spritesheet("slime", "mayhemAssets/spritesheets/slime.json");
    this.load.spritesheet("jellyfish", "mayhemAssets/spritesheets/jellyfish.json");
    this.load.spritesheet("gemstone", "mayhemAssets/spritesheets/gemstone.json");
    this.load.spritesheet("caveEnemy", "mayhemAssets/spritesheets/cave.json");
    this.load.spritesheet("devil", "mayhemAssets/spritesheets/devil.json");


    this.load.spritesheet("slice", "mayhemAssets/spritesheets/slice.json");
    this.load.object("weaponData", "mayhemAssets/data/weaponData.json");
    this.load.object("navmesh", "mayhemAssets/data/navmesh.json");
    this.load.object("enemyData", "mayhemAssets/data/enemy.json");
    this.load.object("bossData", "mayhemAssets/data/boss.json");
    this.load.object("itemData", "mayhemAssets/data/items.json");
    this.load.image("healthpack", "mayhemAssets/sprites/healthpack.png");
    this.load.image("healthmax", "mayhemAssets/sprites/healthmax.png");
    this.load.image("slow", "mayhemAssets/sprites/slow.png");
    this.load.image("burning", "mayhemAssets/sprites/burning.png");
    this.load.image("attackspeed", "mayhemAssets/sprites/attackspeed.png");
    this.load.image("attackdamage", "mayhemAssets/sprites/attackdamage.png");
    this.load.image("speed", "mayhemAssets/sprites/speed.png");
    this.load.image(
      "checkpointcleared",
      "mayhemAssets/sprites/checkpointcleared.png"
    );
    this.load.image(
      "healthbarEmpty",
      "mayhemAssets/sprites/healthbarEmpty.png"
    );
    this.load.image("enemyHp", "mayhemAssets/sprites/enemyhp.png");
    this.load.image(
      "healthbarGreen",
      "mayhemAssets/sprites/healthbarGreen.png"
    );

    this.load.image("inventorySlot", "mayhemAssets/sprites/inventory.png");
    this.load.image("knife", "mayhemAssets/sprites/knife.png");
    this.load.image("multishot", "mayhemAssets/sprites/multishot.png");
    this.load.image("pistol", "mayhemAssets/sprites/pistol.png");
    this.load.audio("gunshot", "mayhemAssets/music/gunshot.wav");
    this.load.audio("portalsound", "mayhemAssets/music/portalsound.wav");
  }
  mainStartScene() {
    this.emitter.fireEvent(GameEventType.PLAY_SOUND, {
      key: "bgm",
      loop: true,
      holdReference: true,
    });
    this.emitter.fireEvent(GameEventType.STOP_SOUND, { key: "portalsound" });
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
    this.receiver.subscribe("gunshot");
    this.receiver.subscribe("pause");
    this.receiver.subscribe("playerdamage");
    this.receiver.subscribe("nomoreburn");
    this.receiver.subscribe("nomoreslow");
    this.receiver.subscribe("changeText");
    

    // this.receiver.subscribe(hw4_Events.UNLOAD_ASSET);

    // Spawn items into the world
    this.spawnItems();

    ///adding healthbar
    this.addUILayer("healthbar");
    var healthbar = this.add.sprite("healthbarEmpty", "healthbar");
    healthbar.position.set(90, 16);

    this.healthbargreen = this.add.sprite("healthbarGreen", "healthbar");
    this.healthbargreen.position.set(90, 16);
    ///(<PlayerController>this.mainPlayer._ai).health
    this.healthbargreen.size.set(
      (<PlayerController>this.mainPlayer._ai).health,
      16
    );

    this.burn =  this.add.sprite("burning", "healthbar");
    this.burn.position.set(160, 16);
    this.burn.visible = false;
    
    this.slow =  this.add.sprite("slow", "healthbar");
    this.slow.position.set(170, 16);
    this.slow.visible = false;


    this.addUILayer("pauseText");
    let text;
    let size;
    let tooltiptext;
    if (this.currentLevel == "1") {
      text = "Paused - Flame Imps - Burns (Attack) - Kill 10";
      size = new Vec2(550, 100);
      this.enemiesNeeded = 10;
      tooltiptext = "Hey, nice to meet you Jackson"
    }
    else if (this.currentLevel == "2") {
      text = "Paused - Slimes - Mutiply (Death) - Kill 20";
      size = new Vec2(550, 100);
      this.enemiesNeeded = 20;
      tooltiptext = "Brother, that was one hell of a fight"
    }
    else if (this.currentLevel == "3") {
      text = "Paused - JellyFish - Slow Player (Attack) - Kill 30 ";
      size = new Vec2(590, 100);
      this.enemiesNeeded = 30;
      tooltiptext = "Hooray, we are the victors!!!!"
    }
    else if (this.currentLevel == "4") {
      text = "Paused - Gemstones - Ranged (Attack) - Kill 40";
      size = new Vec2(570, 100);
      this.enemiesNeeded = 40;
      tooltiptext = "Dear Jackson, where have you been?"
    }
    else if (this.currentLevel == "5") {
      text = "Paused - Rock Worm - Fast (Movement) - Kill 50";
      size = new Vec2(580, 100);
      this.enemiesNeeded = 50;
      tooltiptext = "My condolensces, your comrade Jackson has been executed"
    }
    else if (this.currentLevel == "6") {
      text = "Paused - Mix - Kill 60";
      size = new Vec2(300, 100);
      this.enemiesNeeded = 60;
      tooltiptext = "Dear Jackson, I miss all the laughs we used to have"
    }
    else if (this.currentLevel == "7") {
      text = "Paused - Mix - Kill 70";
      size = new Vec2(300, 100);
      this.enemiesNeeded = 70;
      tooltiptext = "Jackson!! Tell me!!!"
    }
    else if (this.currentLevel == "8") {
      text = "Paused - Mix - Kill 80";
      size = new Vec2(300, 100);
      this.enemiesNeeded = 80;
      tooltiptext = "Jackson, please please, what happened???"
    }
    else{
      let dialogue = this.addUILayer("dialogue");
      dialogue.setDepth(100);
      text = "Paused - Boss"
      size = new Vec2(300, 100);
      this.enemiesNeeded = 999999999999999999999999999999999999999;
      this.dialogue = <Label>this.add.uiElement(
        UIElementType.LABEL,
        "dialogue",
        {
          position: new Vec2(150, 100),
          text: "HEY JACKSON",
        }
      );
      this.dialogue.visible = false;
      this.dialogue.backgroundColor = Color.BLACK;
      this.dialogue.textColor = Color.WHITE;
      this.dialogue.size = new Vec2(1400,800);
    }

    

    this.pauseText = <Label>this.add.uiElement(
      UIElementType.LABEL,
      "pauseText",
      {
        position: new Vec2(150, 100),
        text: text,
      }
    );
    this.pauseText.textColor = Color.BLACK;
    this.pauseText.size = size;
    this.pauseText.backgroundColor = new Color(220, 220, 220);
    this.pauseText.borderColor = Color.BLACK;
    this.pauseText.visible = false;

    // Add a UI for health
    this.addUILayer("health");

    this.healthDisplays = <Label>this.add.uiElement(
      UIElementType.LABEL,
      "health",
      {
        position: new Vec2(50, 16),
        text: "Health: " + (<BattlerAI>this.mainPlayer._ai).health,
      }
    );
    this.healthDisplays.textColor = Color.WHITE;

    this.addUILayer("maxhealth");

    this.maxhealthDisplays = <Label>this.add.uiElement(
      UIElementType.LABEL,
      "maxhealth",
      {
        position: new Vec2(120, 16),
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
        position: new Vec2(200, 16),
        text:
          "Attack: " +
          (<PlayerController>this.mainPlayer._ai).weapon.type.damage,
      }
    );
    this.attackDisplays.textColor = Color.WHITE;

    this.addUILayer("enemyKilled");

    this.enemyKilled = <Label>this.add.uiElement(
      UIElementType.LABEL,
      "enemyKilled",
      {
        position: new Vec2(250, 16),
        text: "Kills: " + this.totalEnemiesKilled,
      }
    );
    this.enemyKilled.textColor = Color.WHITE;

    this.addUILayer("attackdamage").setDepth(1);
    this.addUILayer("attackspeed").setDepth(1);
    this.addUILayer("speed").setDepth(1);
    this.addUILayer("healthup").setDepth(1);
    this.addUILayer("buffspicture").setDepth(1);
    var attackdamagepic = this.add.sprite("attackdamage", "buffspicture");
    attackdamagepic.position.set(280, 40);
    var attackspeedpic = this.add.sprite("attackspeed", "buffspicture");
    attackspeedpic.position.set(280, 70);
    var speedpic = this.add.sprite("speed", "buffspicture");
    speedpic.position.set(280, 100);
    var healthpic = this.add.sprite("healthmax", "buffspicture");
    healthpic.position.set(280, 130);
    var projectilePic = this.add.sprite("multishot", "buffspicture");
    projectilePic.position.set(280, 160);

    this.attackDamageBuffLabel = <Label>this.add.uiElement(
      UIElementType.LABEL,
      "attackdamage",
      {
        position: new Vec2(295, 40),
        text: "" + this.attackDamageBuff,
      }
    );
    this.attackDamageBuffLabel.textColor = Color.WHITE;

    this.attackSpeedBuffLabel = <Label>this.add.uiElement(
      UIElementType.LABEL,
      "attackspeed",
      {
        position: new Vec2(295, 70),
        text: "" + this.attackSpeedBuff,
      }
    );
    this.attackSpeedBuffLabel.textColor = Color.WHITE;

    this.speedBuffLabel = <Label>this.add.uiElement(
      UIElementType.LABEL,
      "speed",
      {
        position: new Vec2(295, 100),
        text: "" + this.speedBuff,
      }
    );
    this.speedBuffLabel.textColor = Color.WHITE;

    this.healthupBuffLabel = <Label>this.add.uiElement(
      UIElementType.LABEL,
      "healthup",
      {
        position: new Vec2(295, 130),
        text: "" + this.healthupBuff,
      }
    );
    this.healthupBuffLabel.textColor = Color.WHITE;

    this.projectileBuffLabel = <Label>this.add.uiElement(
      UIElementType.LABEL,
      "healthup",
      {
        position: new Vec2(295, 160),
        text: "" + this.projectileBuff,
      }
    );
    this.projectileBuffLabel.textColor = Color.WHITE;
    if (!(this.currentLevel == "9")){
      let toolTip = this.addUILayer("toolTip");
      toolTip.setDepth(100);
      this.toolTip = <Label>this.add.uiElement(
        UIElementType.LABEL,
        "toolTip",
        {
          position: new Vec2(150, 100),
          text: tooltiptext,
        }
      );
      this.toolTip.visible = true;
      this.toolTip.backgroundColor = Color.BLACK;
      this.toolTip.textColor = Color.WHITE;
      this.toolTip.size = new Vec2(1400,800);
      this.toolTipTimer.start();
      this.toolTipOn = true;
      for (let i = 0; i < this.enemies.length; i++) {
        this.enemies[i].setAIActive(false, null);
        this.enemies[i].animation.pause();
      }
      this.emitter.fireEvent("noplayercontrol",{enable:false})
      }
  }

  lootGenerate(pos: Vec2) {
    if (this.checkpointDropBoolean == false && this.totalEnemiesKilled >= this.enemiesNeeded) {
      this.checkpointDropBoolean = true;
      this.createCheckpoint(pos); //only 1 can be created i guess
    }
    else{
      if (this.items.length >= 30) {
        return; //cannot drop more than 30 items
      }
      if (Math.random() < .8) {
        // Spawn a healthpack
        let min = 1;
        let max = 6;
        let lootType = Math.floor(Math.random() * (max + 1 - min) + min);
        // this.emitter.fireEvent("healthpack", { pos});
        if (lootType === 1) {
          this.createAttackDamage(pos);
        }
        if (lootType === 2) {
          this.createAttackspeed(pos);
        }
        if (lootType === 3) {
          this.createMultiProjectile(pos);
        }
        if (lootType === 4) {
          this.createMaxhealth(pos);
        }
        if (lootType === 5) {
          this.createSpeed(pos);
        }
        if (lootType === 6){
          this.createHealthpack(pos)
        }
      }
    }
  }
  updateScene(deltaT: number): void {
    while (this.receiver.hasNextEvent()) {
      let event = this.receiver.getNextEvent();

      if (event.isType("healthpack")) {
        this.createHealthpack(event.data.get("position"));
      }
      if (event.isType("changeText")) {
        let text = event.data.get("text")
        console.log(text);
      }
      if (event.isType("enemyDied")) {
        let enemy = <AnimatedSprite>event.data.get("enemy");
        enemy.healthbar.destroy();
        enemy.visible = false;
        this.totalEnemiesKilled++;
        this.enemies = this.enemies.filter(
          (enemy) => enemy !== event.data.get("enemy")
        );
        this.battleManager.enemies = this.battleManager.enemies.filter(
          (enemy) => enemy !== <BattlerAI>event.data.get("enemy")._ai
        );


        this.enemyKilled.text = "Kills: " + this.totalEnemiesKilled;
        let enemyType = (<EnemyAI>enemy._ai).enemyType
        if (this.currentLevel == "9"){
          if (enemyType == "devil"){
            this.checkpointDropBoolean = true;
            this.createCheckpoint(event.data.get("enemy").position.clone()); 
            this.bossSpawnOn = false;
          }
        }
        else if (enemyType==="slime"){
          this.spawnNewEnemy(new Vec2(enemy.position.x, enemy.position.y));
          this.spawnNewEnemy(
            new Vec2(enemy.position.x + 20, enemy.position.y - 20)
          );
          this.spawnNewEnemy(new Vec2(enemy.position.x + 40, enemy.position.y));
          this.lootGenerate(event.data.get("enemy").position.clone());
        } else {
          this.spawnRandomEnemy();
          this.lootGenerate(event.data.get("enemy").position.clone());
        }
      }
      
      if (event.isType("playerdamage")) {
        let enemyType = event.data.get("enemyType")
        if (enemyType == "jellyfish") {
          this.slow.visible = true;
        }
        else if (enemyType == "imp"){
          this.burn.visible = true;
        }
      }
      if (event.isType("nomoreburn")) {
        this.burn.visible = false;
      }
      if (event.isType("nomoreslow")) {
        this.slow.visible = false;
      }
      if (event.isType("checkpoint_cleared")) {
        // let sprite = this.add.sprite("checkpointcleared", "primary");
        // let checkpointcleared = new CheckpointCleared(sprite);
        // checkpointcleared.moveSprite(event.data.get("position"));
        this.mainPlayer.visible = false;
        this.emitter.fireEvent(GameEventType.STOP_SOUND, { key: "bgm" });
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {
          key: "portalsound",
          loop: true,
          holdReference: true,
        });
        if (this.currentLevel == "9"){
          this.sceneManager.changeToScene(Won);
        }
        else{
          this.sceneManager.changeToScene(this.nextLevel);
        }
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
        if (buff instanceof MultiProjectile) {
          this.projectileBuff += 1;
          this.projectileBuffLabel.text = "" + this.projectileBuff;
        }
      }
      if (event.isType(hw4_Events.UNLOAD_ASSET)) {
        let asset = this.sceneGraph.getNode(event.data.get("node"));
        asset.destroy();
      }
      if (event.isType("gunshot")) {
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {
          key: "gunshot",
          loop: false,
          holdReference: false,
        });
      }
      if (event.isType("pause")) {
        var pause = event.data.get("pause");
        if (!pause) {
          for (let i = 0; i < this.enemies.length; i++) {
            this.enemies[i].setAIActive(false, null);
            this.enemies[i].animation.pause();
          }
          this.mainPlayer.animation.pause();
          this.pauseText.visible = true;
        } else {
          for (let i = 0; i < this.enemies.length; i++) {
            this.enemies[i].setAIActive(true, null);
            this.enemies[i].animation.resume();
          }
          this.mainPlayer.animation.resume();
          this.pauseText.visible = false;
        }
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
        this.enemies[i].healthbar.position = new Vec2(
          this.enemies[i].position.x,
          this.enemies[i].position.y - 7
        );
        this.enemies[i].healthbar.size = new Vec2(
          ((<EnemyAI>this.enemies[i]._ai).health /
            (<EnemyAI>this.enemies[i]._ai).maxHealth) *
            16,
          16
        );
      }
    }
    var currenthp = (<PlayerController>this.mainPlayer._ai).health;
    var maxhp = (<PlayerController>this.mainPlayer._ai).maxHealth;
    this.healthbargreen.size.set((currenthp / maxhp) * 128, 16);
    if (this.dialogueOn){
      if(this.dialogueNumber<4){
        if(this.dialogueTimer.isStopped())
        {
          this.dialogueNumber++;
          if (this.dialogueNumber == 1){
            this.dialogue.text = "TELL ME WHAT HAPPENED";
            this.dialogue.visible = true;
          }
          if (this.dialogueNumber == 2){
            this.dialogue.text = "I DIDN'T MEAN TO";
            this.dialogue.visible = true;
          }
          if (this.dialogueNumber == 3){
            this.dialogue.text = "ARGH ARGH";
            this.dialogue.visible = true;
          }
          this.dialogueTimer.start(2000);
        }
      }
      else{
        this.dialogueOn = false;
        this.dialogue.visible = false;
        for (let i = 0; i < this.enemies.length; i++) {
          this.enemies[i].setAIActive(true, null);
          this.enemies[i].animation.resume();
        }
        this.emitter.fireEvent("noplayercontrol",{enable : true});
        this.bossSpawnTimer.start();
        this.bossSpawnOn = true;
        let enemy = this.enemies[0];
        const enemyData = this.load.getObject("enemyData");
        let data = enemyData.enemies[0];
        this.bossSpawnEnemy(new Vec2(enemy.position.x, enemy.position.y));
        this.bossSpawnEnemy(
          new Vec2(enemy.position.x + 20, enemy.position.y - 20)
        );
        this.bossSpawnEnemy(new Vec2(enemy.position.x + 40, enemy.position.y));
      }
    }
    if (this.bossSpawnOn){
      if (this.bossSpawnTimer.isStopped()){
        console.log('SUMMONING')
        let enemy = this.enemies[0];
        this.bossSpawnEnemy(new Vec2(enemy.position.x, enemy.position.y));
        this.bossSpawnEnemy(
          new Vec2(enemy.position.x + 20, enemy.position.y - 20)
        );
        this.bossSpawnEnemy(new Vec2(enemy.position.x + 40, enemy.position.y));
        this.bossSpawnTimer.start();
      }
    }
    if (this.toolTipOn){
      if (this.toolTipTimer.isStopped()){
        this.toolTip.visible = false;
        this.toolTipOn = false;
        for (let i = 0; i < this.enemies.length; i++) {
          this.enemies[i].setAIActive(true, null);
          this.enemies[i].animation.resume();
        }
        this.emitter.fireEvent("noplayercontrol",{enable : true});
      }
    }
    if(this.jackson){
      if (this.mainPlayer.collisionShape.overlaps(this.jackson.boundary)){
        const enemyData = this.load.getObject("bossData");
        let data = enemyData.enemies[0];
        this.spawnEnemy(JSON.parse(JSON.stringify(data)), null);
        this.jackson.destroy();
        this.jackson = null;
          for (let i = 0; i < this.enemies.length; i++) {
          this.enemies[i].setAIActive(false, null);
          this.enemies[i].animation.pause();
        }
        this.mainPlayer.animation.pause();
        this.emitter.fireEvent("noplayercontrol",{enable : false});
        this.dialogue.visible = true;
        this.dialogueTimer.start(2000);
        this.dialogueOn = true;
      }
    }
    // Debug mode graph
    if (Input.isKeyJustPressed("g")) {
      this.getLayer("graph").setHidden(!this.getLayer("graph").isHidden());
    }
  }

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

  createCheckpoint(position: Vec2): void {
    let sprite = this.add.sprite("checkpoint", "primary");
    let checkpoint = new Checkpoint(sprite);
    checkpoint.moveSprite(position);
    this.items.push(checkpoint);
  }

  createMultiProjectile(position: Vec2): void {
    let sprite = this.add.sprite("multishot", "primary");
    let maxhealth = new MultiProjectile(sprite);
    maxhealth.moveSprite(position);
    this.items.push(maxhealth);
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

      // weapon.enemies = this.enemies;
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
      new Vec2(9999, 9999),
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
    let speed = 100;
    // if (this.currentLevel == "3") {
    //   speed = 60;
    // } else {
    //   speed = 100;
    // }


    this.system = new ParticleSystem(100, new Vec2((5 * 32), (10 * 32)), 2000, 3, 1, 100);
    this.system.initializePool(this, "primary");
    if (this.currentLevel == "9"){
      this.jackson = this.add.animatedSprite("mainplayer", "primary")
      this.jackson = this.add.animatedSprite("mainplayer", "primary");
      this.jackson.position.set(200, 496);
      this.jackson.addPhysics(new AABB(Vec2.ZERO, new Vec2(8, 8)));
    }
    this.mainPlayer.addAI(PlayerController, {
      speed: speed,
      health: 128, //original was 25 //
      maxHealth: 128, //adding maxhealth
      inventory: inventory,
      items: this.items,
      inputEnabled: true,
      range: 150, //weak pistol range
      weapon: startingWeapon,
      system:this.system,
    });
    this.mainPlayer.animation.play("face_right");
    (<PlayerController>this.mainPlayer._ai).inventory.setActive(true);
  }

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
    new Move(2, [], [hw4_Statuses.IN_RANGE], { inRange: 50 }),
  ];

  statusArray: Array<string> = [
    hw4_Statuses.CAN_RETREAT,
    hw4_Statuses.CAN_BERSERK,
  ];


  changeEnemySpawnType(data:any):any{
      if(this.enemies.length===1){
        data.type= "slime"
      }
      else if(this.enemies.length === 2){
        data.type = "gemstone"
      }
      else if(this.enemies.length === 3){
        data.type = "caveEnemy"
      }
      else{
        data.type = "imp"
      }
      return data
  }
  applyEnemyEffects(enemy: AnimatedSprite){
    let enemyAi = (<EnemyAI>enemy._ai)
    let enemyType = enemyAi.enemyType

    if(enemyType==="gemstone"){
      enemyAi.weapon = this.createWeapon("weak_pistol");
      enemyAi.possibleActions = this.actionsGun;
      enemyAi.speed = 40;
      enemyAi.inRange = 50;
    }
  }
  spawnEnemy(data: any, pos: Vec2) {
    if (this.enemies.length >= 60) {
      return; //hard limit on the max enemies there can be in this game
    }
    data=this.changeEnemySpawnType(data)
    // // Create an enemy
    // console.log("this is where we are creating and spawning new enemies")
    // console.log(data)

    this.enemies.push(this.add.animatedSprite(data.type, "primary"));
    let lastIndex = this.enemies.length - 1;
    this.enemies[lastIndex].position.set(
      data.position[0] / 2,
      data.position[1] / 2
    );
    this.enemies[lastIndex].animation.play("face_left");
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

    let weapon;
    let actions;
    let range;
    let speed=100;
      weapon = this.createWeapon("knife");
      actions = this.actionKnife;
      range = 20;
      if (this.currentLevel == "1") {
        speed = 20;
      } else if (this.currentLevel == "2") {
        speed = 20;
      } else if (this.currentLevel == "3") {
        speed = 30;
      } else if (this.currentLevel == "5") {
        speed = 50;
      } else if (this.currentLevel == "6") {
        speed = 60;
      } 
      else if (this.currentLevel == "7") {
        speed = 70;
      } 
      else if (this.currentLevel == "8") {
        speed = 80;
      } 
      else if (this.currentLevel == "9") {
        speed = 90;
        weapon.type.damage = 10;
      } 
      else{
        speed = 100;
      }

    var enemyhpbar = this.add.sprite("enemyHp", "primary");
    enemyhpbar.position.set(data.position[0] / 2, data.position[1] / 2 - 7);
    this.enemies[lastIndex].healthbar = enemyhpbar;

    //SCALING options
    let scalingFactor = Math.ceil((this.totalEnemiesKilled + 10) / 20);
    let scaledHealth = Math.ceil(data.health * scalingFactor);
    weapon.type.damage = Math.ceil(weapon.type.damage * scalingFactor);

    let enemyOptions = {
      defaultMode: data.mode,
      patrolRoute: data.route, // This only matters if they're a patroller
      guardPosition: data.guardPosition, // This only matters if the're a guard
      health: scaledHealth,
      player1: this.mainPlayer,
      weapon: weapon,
      goal: hw4_Statuses.REACHED_GOAL,
      status: this.statusArray,
      actions: actions,
      speed: speed,
      inRange: range,
      enemyType: data.type
    };
    this.enemies[lastIndex].addAI(EnemyAI, enemyOptions);
    if (pos !== null) {
      this.enemies[lastIndex].position = pos.clone();
    }
    this.battleManager.setEnemies(
      this.enemies.map((enemy) => <BattlerAI>enemy._ai)
    );

    this.applyEnemyEffects(this.enemies[lastIndex]);
  }
  
  initializeEnemies() {
    this.enemies = new Array(0);
    const enemyData = this.load.getObject("enemyData");
    if (this.currentLevel == "9"){
    }
    else{
      for (let i = 0; i < enemyData.numEnemies; i++) {
        let data = enemyData.enemies[i];
        this.spawnEnemy(JSON.parse(JSON.stringify(data)), null);
      }
    }
  }

  //this spawns in the a copy of first enemy of the enemy.json data at the set location
  spawnNewEnemy(pos: Vec2): void {
    const enemyData = this.load.getObject("enemyData");
    let data = enemyData.enemies[0];
    this.spawnEnemy(JSON.parse(JSON.stringify(data)), pos);
  }
  spawnRandomEnemy(): void {
    let totalEnemies = this.totalEnemiesKilled;
    totalEnemies += 20;
    while ((totalEnemies -= 20) >= 0) {
      //extra enemy for every 20 enemies killed
      let x = Math.random() * this.tileMapMaxSize.x;
      let y = Math.random() * this.tileMapMaxSize.y;
      let newPos = new Vec2(x, y);
      this.spawnNewEnemy(newPos);
    }
  }

  bossSpawnEnemy(pos: Vec2) {
    const enemyData = this.load.getObject("enemyData");
    let data = enemyData.enemies[0];
    if (this.enemies.length >= 60) {
      return; //hard limit on the max enemies there can be in this game
    }
    let enemySpawnType = ((this.enemies.length + this.totalEnemiesKilled) % 5);
        if(enemySpawnType === 1){
          data.type = "imp"
        }
        else if(enemySpawnType === 2){
          data.type = "slime"
    
        }
        else if(enemySpawnType === 3) {
          data.type = "gemstone"
    
        }
        else if (enemySpawnType ===4){
          data.type = "jellyfish"
        }
        else{
          data.type = "caveEnemy"
        }
    // // Create an enemy
    // console.log("this is where we are creating and spawning new enemies")
    // console.log(data)

    this.enemies.push(this.add.animatedSprite(data.type, "primary"));
    let lastIndex = this.enemies.length - 1;
    this.enemies[lastIndex].position.set(
      data.position[0] / 2,
      data.position[1] / 2
    );
    this.enemies[lastIndex].animation.play("face_left");
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

    let weapon;
    let actions;
    let range;
    let speed=100;
      weapon = this.createWeapon("knife");
      actions = this.actionKnife;
      range = 20;
      speed = 90;
      weapon.type.damage = 5;

    var enemyhpbar = this.add.sprite("enemyHp", "primary");
    enemyhpbar.position.set(data.position[0] / 2, data.position[1] / 2 - 7);
    this.enemies[lastIndex].healthbar = enemyhpbar;

    //SCALING options
    let scalingFactor = Math.ceil((this.totalEnemiesKilled + 10) / 20);
    let scaledHealth = Math.ceil(data.health * scalingFactor);
    weapon.type.damage = Math.ceil(weapon.type.damage * scalingFactor);

    let enemyOptions = {
      defaultMode: data.mode,
      patrolRoute: data.route, // This only matters if they're a patroller
      guardPosition: data.guardPosition, // This only matters if the're a guard
      health: scaledHealth,
      player1: this.mainPlayer,
      weapon: weapon,
      goal: hw4_Statuses.REACHED_GOAL,
      status: this.statusArray,
      actions: actions,
      speed: speed,
      inRange: range,
      enemyType: data.type
    };
    this.enemies[lastIndex].addAI(EnemyAI, enemyOptions);
    if (pos !== null) {
      this.enemies[lastIndex].position = pos.clone();
    }
    this.battleManager.setEnemies(
      this.enemies.map((enemy) => <BattlerAI>enemy._ai)
    );

    this.applyEnemyEffects(this.enemies[lastIndex]);
  }
}
