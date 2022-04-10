import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import mainScene from "./MainScene";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";

export default class MainMenu extends Scene {
  // Layers, for multiple main menu screens\
  private splashScreen: Layer;
  private mainMenu: Layer;
  private help: Layer;
  private control: Layer;
  private selectLevelScreen: Layer;
  private bg: Sprite;

  loadScene() {
    this.load.image("splash", "mayhemAssets/background/splash.jpg ");
  }
  startScene() {
    const center = this.viewport.getCenter();

    ////################## The Splash Screen

    this.splashScreen = this.addUILayer("splashScreen");
    this.addParallaxLayer("bg", new Vec2(0.5, 1), -1);
    this.bg = this.add.sprite("splash", "bg");
    this.bg.size = new Vec2(1200, 800);
    this.bg.position.set(
      this.viewport.getHalfSize().x,
      this.viewport.getHalfSize().y
    );

    //Button for clicking to menu
    const mainMenu = this.add.uiElement(UIElementType.BUTTON, "splashScreen", {
      position: new Vec2(center.x, center.y + 250),
      text: "Click to Play",
    });
    mainMenu.size.set(200, 50);
    mainMenu.borderWidth = 2;
    mainMenu.borderColor = Color.TRANSPARENT;
    mainMenu.backgroundColor = Color.TRANSPARENT;
    mainMenu.onClickEventId = "menu";

    //*################# TODO: dao added this, quick play, remove later// starts at first level immediately
    const quickPlay = this.add.uiElement(UIElementType.BUTTON, "splashScreen", {
      position: new Vec2(center.x, center.y),
      text: "Quick Start to LV 1",
    });
    quickPlay.size.set(200, 50);
    quickPlay.borderWidth = 2;
    quickPlay.borderColor = Color.WHITE;
    quickPlay.backgroundColor = Color.TRANSPARENT;
    quickPlay.onClickEventId = "chooselevel";

    //################The Menu Screen
    this.mainMenu = this.addUILayer("mainMenu");
    this.mainMenu.setHidden(true);

    //Header for Main Menu
    const mainmenuhead = "Main Menu";

    const mainMenuheader = <Label>this.add.uiElement(
      UIElementType.LABEL,
      "mainMenu",
      {
        position: new Vec2(center.x, center.y - 250),
        text: mainmenuhead,
      }
    );
    mainMenuheader.textColor = Color.WHITE;
    mainMenuheader.backgroundColor = Color.TRANSPARENT;
    mainMenuheader.fontSize = 50;

    // Add play button, and give it an event to emit on press

    const selectLevel = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {
      position: new Vec2(center.x, center.y - 100),
      text: "Select Level",
    });
    selectLevel.size.set(200, 50);
    selectLevel.borderWidth = 2;
    selectLevel.borderColor = Color.TRANSPARENT;
    selectLevel.backgroundColor = Color.TRANSPARENT;
    selectLevel.onClickEventId = "selectlevel";

    // Add help button
    const help = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {
      position: new Vec2(center.x, center.y + 200),
      text: "Help",
    });
    help.size.set(200, 50);
    help.borderWidth = 2;
    help.borderColor = Color.TRANSPARENT;
    help.backgroundColor = Color.TRANSPARENT;
    help.onClickEventId = "help";

    // //THIS IS OUR controls button in the mains screen of the game
    const control = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {
      position: new Vec2(center.x, center.y + 50),
      text: "Controls",
    });
    control.size.set(200, 50);
    control.borderWidth = 2;
    control.borderColor = Color.TRANSPARENT;
    control.backgroundColor = Color.TRANSPARENT;
    control.onClickEventId = "control";

    /* ########## HELP SCREEN ########## */
    this.help = this.addUILayer("help");
    this.help.setHidden(true);

    const helpHeader = <Label>this.add.uiElement(UIElementType.LABEL, "help", {
      position: new Vec2(center.x, center.y - 250),
      text: "Help",
    });
    helpHeader.textColor = Color.WHITE;
    helpHeader.fontSize = 50;
    

    const text1header = "Backstory";
    const text1 =
      "You’re a retired veteran. You found out that your dearest comrade-in-arms has committed a misunderstood sin and ends up in hell";
    const text12 =
      "Knowing this, you end up trying to break through the barriers of hell to find Jackson and drag him out";
    const text13 =
      "As you kill more demon spawns from hell, the barrier into hell weakens, allowing you to progress through hell and getting you closer to your comrade";
    const text2header = "Developers";
    const text2 = "Lin Ni";
    const text22 = "Daoqin Gao"
    const text23 = "Robert Rolsenic"
    const text3header = "Cheat Codes";
    const text3 = "INVINCIBLE SKIP [NUMBER] UPGRADE [BUFF]";

    const line1header = <Label>this.add.uiElement(UIElementType.LABEL, "help", {
      position: new Vec2(center.x, center.y - 160),
      text: text1header,
    });
    const line1 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {
      position: new Vec2(center.x, center.y - 120),
      text: text1,
    });
    const line12 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {
      position: new Vec2(center.x, center.y - 100),
      text: text12,
    });
    const line13 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {
      position: new Vec2(center.x, center.y - 80),
      text: text13,
    });
    const line2header = <Label>this.add.uiElement(UIElementType.LABEL, "help", {
      position: new Vec2(center.x, center.y - 10),
      text: text2header,
    });
    const line2 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {
      position: new Vec2(center.x, center.y + 30),
      text: text2,
    });
    const line22 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {
      position: new Vec2(center.x, center.y + 60),
      text: text22,
    });
    const line23 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {
      position: new Vec2(center.x, center.y + 90),
      text: text23,
    });
    const line3header = <Label>this.add.uiElement(UIElementType.LABEL, "help", {
      position: new Vec2(center.x, center.y + 140),
      text: text3header,
    });
    const line3 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {
      position: new Vec2(center.x, center.y + 180),
      text: text3,
    });

    line1.textColor = Color.WHITE;
    line12.textColor = Color.WHITE;
    line13.textColor = Color.WHITE;
    line1.fontSize = 16;
    line12.fontSize = 16;
    line13.fontSize = 16;

    line2.textColor = Color.WHITE;
    line22.textColor = Color.WHITE;
    line23.textColor = Color.WHITE;
    line3.textColor = Color.WHITE;
    line3.fontSize = 20;
    line2.fontSize = 18;
    line22.fontSize = 18;
    line23.fontSize = 18;
    line3.fontSize = 18;

    line1header.textColor = Color.WHITE;
    line2header.textColor = Color.WHITE;
    line3header.textColor = Color.WHITE;
    (<Label>line1).font = "Cursive";
    (<Label>line12).font = "Cursive";
    (<Label>line13).font = "Cursive";
    (<Label>line2).font = "Cursive";
    (<Label>line22).font = "Cursive";
    (<Label>line23).font = "Cursive";
    (<Label>line3).font = "Cursive";


    const helpBack = this.add.uiElement(UIElementType.BUTTON, "help", {
      position: new Vec2(center.x, center.y + 300),
      text: "Back",
    });
    helpBack.size.set(200, 50);
    helpBack.borderWidth = 2;
    helpBack.borderColor = Color.WHITE;
    helpBack.backgroundColor = Color.TRANSPARENT;
    helpBack.onClickEventId = "menu";
    (<Label>helpBack).font = "Fantasy";

    /* ########## CONTROL SCREEN ########## */
    this.control = this.addUILayer("control");
    this.control.setHidden(true);

    const controlHeader = <Label>this.add.uiElement(
      UIElementType.LABEL,
      "control",
      {
        position: new Vec2(center.x, center.y - 250),
        text: "Controls",
      }
    );
    controlHeader.textColor = Color.WHITE;
    controlHeader.fontSize = 50;
    (<Label>controlHeader).font = "Fantasy";

    const controlText1 = "WASD to move";
    const controlText2 = "Left Click to Shoot";

    const controlLine1 = <Label>this.add.uiElement(
      UIElementType.LABEL,
      "control",
      {
        position: new Vec2(center.x, center.y - 50),
        text: controlText1,
      }
    );
    const controlLine2 = <Label>this.add.uiElement(
      UIElementType.LABEL,
      "control",
      {
        position: new Vec2(center.x, center.y + 50),
        text: controlText2,
      }
    );

    controlLine1.textColor = Color.WHITE;
    controlLine2.textColor = Color.WHITE;

    const controlBack = this.add.uiElement(UIElementType.BUTTON, "control", {
      position: new Vec2(center.x, center.y + 250),
      text: "Back",
    });
    controlBack.size.set(200, 50);
    controlBack.borderWidth = 2;
    controlBack.borderColor = Color.WHITE;
    controlBack.backgroundColor = Color.TRANSPARENT;
    controlBack.onClickEventId = "menu";

    //###########Select Levels Screen
    this.selectLevelScreen = this.addUILayer("selectLevelScreen");
    this.selectLevelScreen.setHidden(true);

    //add button to go back
    const selectLevelBack = this.add.uiElement(
      UIElementType.BUTTON,
      "selectLevelScreen",
      {
        position: new Vec2(center.x, center.y + 250),
        text: "Back",
      }
    );
    selectLevelBack.size.set(200, 50);
    selectLevelBack.borderWidth = 2;
    selectLevelBack.borderColor = Color.WHITE;
    selectLevelBack.backgroundColor = Color.TRANSPARENT;
    selectLevelBack.onClickEventId = "menu";
 

    ///header for select level
    const selectHeader = <Label>this.add.uiElement(
      UIElementType.LABEL,
      "selectLevelScreen",
      {
        position: new Vec2(center.x, center.y - 250),
        text: "Select Level",
      }
    );
    selectHeader.textColor = Color.WHITE;
    selectHeader.fontSize = 50;

    ///buttons for all the levels
    const level1 = this.add.uiElement(
      UIElementType.BUTTON,
      "selectLevelScreen",
      {
        position: new Vec2(center.x, center.y - 150),
        text: "Level 1",
      }
    );
    level1.size.set(200, 50);
    level1.borderWidth = 2;
    level1.borderColor = Color.WHITE;
    level1.backgroundColor = Color.TRANSPARENT;
    level1.onClickEventId = "chooselevel";

    const level2 = this.add.uiElement(
      UIElementType.BUTTON,
      "selectLevelScreen",
      {
        position: new Vec2(center.x + 100, center.y - 90),
        text: "Level 2",
      }
    );
    level2.size.set(200, 50);
    level2.borderWidth = 2;
    level2.borderColor = Color.WHITE;
    level2.backgroundColor = Color.TRANSPARENT;
    level2.onClickEventId = "chooselevel";

    const level3 = this.add.uiElement(
      UIElementType.BUTTON,
      "selectLevelScreen",
      {
        position: new Vec2(center.x + 200, center.y - 30),
        text: "Level 3",
      }
    );
    level3.size.set(200, 50);
    level3.borderWidth = 2;
    level3.borderColor = Color.WHITE;
    level3.backgroundColor = Color.TRANSPARENT;
    level3.onClickEventId = "chooselevel";

    const level4 = this.add.uiElement(
      UIElementType.BUTTON,
      "selectLevelScreen",
      {
        position: new Vec2(center.x + 150, center.y + 30),
        text: "Level 4",
      }
    );
    level4.size.set(200, 50);
    level4.borderWidth = 2;
    level4.borderColor = Color.WHITE;
    level4.backgroundColor = Color.TRANSPARENT;
    level4.onClickEventId = "chooselevel";

    const level5 = this.add.uiElement(
      UIElementType.BUTTON,
      "selectLevelScreen",
      {
        position: new Vec2(center.x + 100, center.y + 90),
        text: "Level 5",
      }
    );
    level5.size.set(200, 50);
    level5.borderWidth = 2;
    level5.borderColor = Color.WHITE;
    level5.backgroundColor = Color.TRANSPARENT;
    level5.onClickEventId = "chooselevel";

    const level6 = this.add.uiElement(
      UIElementType.BUTTON,
      "selectLevelScreen",
      {
        position: new Vec2(center.x - 100, center.y + 90),
        text: "Level 6",
      }
    );
    level6.size.set(200, 50);
    level6.borderWidth = 2;
    level6.borderColor = Color.WHITE;
    level6.backgroundColor = Color.TRANSPARENT;
    level6.onClickEventId = "chooselevel";

    const level7 = this.add.uiElement(
      UIElementType.BUTTON,
      "selectLevelScreen",
      {
        position: new Vec2(center.x - 150, center.y + 30),
        text: "Level 7",
      }
    );
    level7.size.set(200, 50);
    level7.borderWidth = 2;
    level7.borderColor = Color.WHITE;
    level7.backgroundColor = Color.TRANSPARENT;
    level7.onClickEventId = "chooselevel";

    const level8 = this.add.uiElement(
      UIElementType.BUTTON,
      "selectLevelScreen",
      {
        position: new Vec2(center.x - 200, center.y - 30),
        text: "Level 8",
      }
    );
    level8.size.set(200, 50);
    level8.borderWidth = 2;
    level8.borderColor = Color.WHITE;
    level8.backgroundColor = Color.TRANSPARENT;
    level8.onClickEventId = "chooselevel";

    const level9 = this.add.uiElement(
      UIElementType.BUTTON,
      "selectLevelScreen",
      {
        position: new Vec2(center.x - 100, center.y - 90),
        text: "Level 9",
      }
    );
    level9.size.set(200, 50);
    level9.borderWidth = 2;
    level9.borderColor = Color.WHITE;
    level9.backgroundColor = Color.TRANSPARENT;
    level9.onClickEventId = "chooselevel";

    // Subscribe to the button events
    this.receiver.subscribe("play");
    this.receiver.subscribe("help");
    this.receiver.subscribe("menu");
    this.receiver.subscribe("control");
    this.receiver.subscribe("clicktoplay");
    this.receiver.subscribe("selectlevel");
    this.receiver.subscribe("chooselevel");
  }

  updateScene() {
    //TODO: going to about to back makes the screen frozen
    while (this.receiver.hasNextEvent()) {
      let event = this.receiver.getNextEvent();

      console.log(event);

      if (event.type === "selectlevel") {
        // this.sceneManager.changeToScene(mainScene, {});
        this.mainMenu.setHidden(true);
        this.selectLevelScreen.setHidden(false);
      }
      if (event.type === "chooselevel") {
        this.sceneManager.changeToScene(mainScene, {});
      }

      if (event.type === "help") {
        this.help.setHidden(false);
        this.mainMenu.setHidden(true);
      }

      if (event.type === "menu") {
        console.log("logging menu");
        this.mainMenu.setHidden(false);
        this.help.setHidden(true);
        this.control.setHidden(true);
        this.splashScreen.setHidden(true);
        this.selectLevelScreen.setHidden(true);
        this.bg.visible = false;
      }
      if (event.type === "control") {
        this.mainMenu.setHidden(true);
        this.control.setHidden(false);
      }
    }
  }
}
