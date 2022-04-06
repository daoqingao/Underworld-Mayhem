import Vec2 from "../DataTypes/Vec2";
import { UIElementType } from "../Nodes/UIElements/UIElementTypes";
import Layer from "./Layer";
import Scene from "./Scene";
import Color from "../Utils/Color";
import Label from "../Nodes/UIElements/Label";
import mainScene from "./MainScene";

export default class MainMenu extends Scene {
  // Layers, for multiple main menu screens\
  private splashScreen: Layer;
  private mainMenu: Layer;
  private help: Layer;
  private control: Layer;
  private selectLevel: Layer;

  loadScene() {}

  startScene() {
    const center = this.viewport.getCenter();

    ////################## The Splash Screen

    this.splashScreen = this.addUILayer("splashScreen");

    //Button for clicking to menu
    const mainMenu = this.add.uiElement(UIElementType.BUTTON, "splashScreen", {
      position: new Vec2(center.x, center.y + 200),
      text: "Click to Play",
    });
    mainMenu.size.set(200, 50);
    mainMenu.borderWidth = 2;
    mainMenu.borderColor = Color.WHITE;
    mainMenu.backgroundColor = Color.TRANSPARENT;
    mainMenu.onClickEventId = "menu";

    //################The Menu Screen
    this.mainMenu = this.addUILayer("mainMenu");
    this.mainMenu.setHidden(true);

    // Add play button, and give it an event to emit on press

    const selectLevel = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {
      position: new Vec2(center.x, center.y - 100),
      text: "Select Level",
    });
    selectLevel.size.set(200, 50);
    selectLevel.borderWidth = 2;
    selectLevel.borderColor = Color.WHITE;
    selectLevel.backgroundColor = Color.TRANSPARENT;
    selectLevel.onClickEventId = "selectLevel";

    // Add help button
    const help = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {
      position: new Vec2(center.x, center.y + 100),
      text: "Help",
    });
    help.size.set(200, 50);
    help.borderWidth = 2;
    help.borderColor = Color.WHITE;
    help.backgroundColor = Color.TRANSPARENT;
    help.onClickEventId = "help";

    // //THIS IS OUR controls button in the mains screen of the game
    const control = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {
      position: new Vec2(center.x, center.y),
      text: "Controls",
    });
    control.size.set(200, 50);
    control.borderWidth = 2;
    control.borderColor = Color.WHITE;
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

    // const text1 = "Game made by Rob, Dao and Lin";
    // const text2 =
    //   "using the Wolfie2D game engine, a TypeScript game engine created by";
    // const text3 = "Joe Weaver and Richard McKenna.";

    // const line1 = <Label>this.add.uiElement(UIElementType.LABEL, "about", {
    //   position: new Vec2(center.x, center.y - 50),
    //   text: text1,
    // });
    // const line2 = <Label>this.add.uiElement(UIElementType.LABEL, "about", {
    //   position: new Vec2(center.x, center.y),
    //   text: text2,
    // });
    // const line3 = <Label>this.add.uiElement(UIElementType.LABEL, "about", {
    //   position: new Vec2(center.x, center.y + 50),
    //   text: text3,
    // });

    // line1.textColor = Color.WHITE;
    // line2.textColor = Color.WHITE;
    // line3.textColor = Color.WHITE;

    const helpBack = this.add.uiElement(UIElementType.BUTTON, "help", {
      position: new Vec2(center.x, center.y + 250),
      text: "Back",
    });
    helpBack.size.set(200, 50);
    helpBack.borderWidth = 2;
    helpBack.borderColor = Color.WHITE;
    helpBack.backgroundColor = Color.TRANSPARENT;
    helpBack.onClickEventId = "menu";

    // Subscribe to the button events
    this.receiver.subscribe("play");
    this.receiver.subscribe("help");
    this.receiver.subscribe("menu");
    this.receiver.subscribe("control");
    this.receiver.subscribe("clicktoplay");

    /* ########## CONTROL SCREEN ########## */
    this.control = this.addUILayer("control");
    this.control.setHidden(true);

    const controlHeader = <Label>this.add.uiElement(
      UIElementType.LABEL,
      "control",
      {
        position: new Vec2(center.x, center.y - 200),
        text: "Controls",
      }
    );
    controlHeader.textColor = Color.WHITE;

    const controlText1 = "WASD to move";
    const controlText2 = "Left Click to Shoot";

    const controlLine1 = <Label>this.add.uiElement(
      UIElementType.LABEL,
      "control",
      {
        position: new Vec2(center.x, center.y),
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

    //Select Levels Screen
    this.selectLevel = this.addUILayer("selectLevel");
    this.selectLevel.setHidden(false);
  }

  updateScene() {
    //TODO: going to about to back makes the screen frozen
    while (this.receiver.hasNextEvent()) {
      let event = this.receiver.getNextEvent();

      console.log(event);

      if (event.type === "selectlevel") {
        // this.sceneManager.changeToScene(mainScene, {});
        this.mainMenu.setHidden(true);
        this.selectLevel.setHidden(false);
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
        this.selectLevel.setHidden(true);
      }
      if (event.type === "control") {
        this.mainMenu.setHidden(true);
        this.control.setHidden(false);
      }
    }
  }
}
