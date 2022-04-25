import mainScene from "../MainScene";
import {GameEventType} from "../../../Wolfie2D/Events/GameEventType";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import OrthogonalTilemap from "../../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import BattleManager from "../../GameSystems/BattleManager";
import BattlerAI from "../../AI/BattlerAI";
import PlayerController from "../../AI/PlayerController";
import Label from "../../../Wolfie2D/Nodes/UIElements/Label";
import {UIElementType} from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Color from "../../../Wolfie2D/Utils/Color";
import Button from "../../../Wolfie2D/Nodes/UIElements/Button";
import Level2 from "./Level2";

export default class Level7 extends mainScene{
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
        this.load.image("enemyHp", "mayhemAssets/sprites/enemyhp.png");
        this.load.image(
            "healthbarGreen",
            "mayhemAssets/sprites/healthbarGreen.png"
        );

        this.load.image("inventorySlot", "mayhemAssets/sprites/inventory.png");
        this.load.image("knife", "mayhemAssets/sprites/knife.png");
        this.load.image("laserGun", "mayhemAssets/sprites/laserGun.png");
        this.load.image("pistol", "mayhemAssets/sprites/pistol.png");
        this.load.audio("gunshot", "mayhemAssets/music/gunshot.wav");
        this.load.audio("bgm","mayhemAssets/music/bgm.mp3")
    }
    unloadScene() {

    }
    startScene() {
        this.nextLevel=Level2;
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "bgm", loop: true, holdReference: false});
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
        this.receiver.subscribe("gunshot");
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
        this.pauseButton.textColor = Color.WHITE;
        this.pauseButton.onClickEventId = "pause";

        this.playButton = <Button>this.add.uiElement(UIElementType.BUTTON, "play", {
            position: new Vec2(230, 16),
            text: "Play",
        });
        this.playButton.size.set(200, 50);
        this.playButton.borderColor = Color.TRANSPARENT;
        this.playButton.backgroundColor = Color.TRANSPARENT;
        this.playButton.textColor = Color.WHITE;
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
        var projectilePic= this.add.sprite("laserGun", "buffspicture");
        projectilePic.position.set(280, 110);

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

        this.projectileBuffLabel = <Label>this.add.uiElement(
            UIElementType.LABEL,
            "healthup",
            {
                position: new Vec2(295, 110),
                text: "" + this.projectileBuff,
            }
        );
        this.projectileBuffLabel.textColor = Color.WHITE;

    }
    updateScene(deltaT: number) {
        super.updateScene(deltaT);
    }
}