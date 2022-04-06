import Vec2 from "../DataTypes/Vec2";
import { UIElementType } from "../Nodes/UIElements/UIElementTypes";
import Layer from "./Layer";
import Scene from "./Scene";
import Color from "../Utils/Color";
import Label from "../Nodes/UIElements/Label";
import mainScene from "./MainScene";

export default class MainMenu extends Scene {
  // Layers, for multiple main menu screens
  private mainMenu: Layer;
  private about: Layer;
  private control: Layer;

  loadScene() {}

  startScene() {
    const center = this.viewport.getCenter();

    // The main menu
    this.mainMenu = this.addUILayer("mainMenu");

    // Add play button, and give it an event to emit on press
    const play = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {
      position: new Vec2(center.x, center.y - 100),
      text: "Play",
    });
    play.size.set(200, 50);
    play.borderWidth = 2;
    play.borderColor = Color.WHITE;
    play.backgroundColor = Color.TRANSPARENT;
    play.onClickEventId = "play";

    // Add about button
    const about = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {
      position: new Vec2(center.x, center.y + 100),
      text: "About",
    });
    about.size.set(200, 50);
    about.borderWidth = 2;
    about.borderColor = Color.WHITE;
    about.backgroundColor = Color.TRANSPARENT;
    about.onClickEventId = "about";

    /* ########## ABOUT SCREEN ########## */
    this.about = this.addUILayer("about");
    this.about.setHidden(true);

    const aboutHeader = <Label>this.add.uiElement(
      UIElementType.LABEL,
      "about",
      {
        position: new Vec2(center.x, center.y - 250),
        text: "About",
      }
    );
    aboutHeader.textColor = Color.WHITE;

    const text1 = "Game masfafasfasasdasdafasade by Rob, Dao and Lin";
    const text2 =
      "using the Wolfie2D game engine, a TypeScript game engine created by";
    const text3 = "Joe Weaver and Richard McKenna.";

    const line1 = <Label>this.add.uiElement(UIElementType.LABEL, "about", {
      position: new Vec2(center.x, center.y - 50),
      text: text1,
    });
    const line2 = <Label>this.add.uiElement(UIElementType.LABEL, "about", {
      position: new Vec2(center.x, center.y),
      text: text2,
    });
    const line3 = <Label>this.add.uiElement(UIElementType.LABEL, "about", {
      position: new Vec2(center.x, center.y + 50),
      text: text3,
    });

    line1.textColor = Color.WHITE;
    line2.textColor = Color.WHITE;
    line3.textColor = Color.WHITE;

    const aboutBack = this.add.uiElement(UIElementType.BUTTON, "about", {
      position: new Vec2(center.x, center.y + 250),
      text: "Back",
    });
    aboutBack.size.set(200, 50);
    aboutBack.borderWidth = 2;
    aboutBack.borderColor = Color.WHITE;
    aboutBack.backgroundColor = Color.TRANSPARENT;
    aboutBack.onClickEventId = "menu";

    // Subscribe to the button events
    this.receiver.subscribe("play");
    this.receiver.subscribe("about");
    this.receiver.subscribe("menu");
    this.receiver.subscribe("control");

    //THIS IS OUR controls button in the mains screen of the game
    const control = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {
      position: new Vec2(center.x, center.y + 200),
      text: "Controls",
    });
    control.size.set(200, 50);
    control.borderWidth = 2;
    control.borderColor = Color.WHITE;
    control.backgroundColor = Color.TRANSPARENT;
    control.onClickEventId = "control";

    /* ########## ABOUT SCREEN ########## */
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

    const controlText1 = "WASD to move";
    const controlText2 = "Q to drop an item";
    const controlText3 = "E to pick up an item";
    const controlText4 = "Click to use current item";
    const controlText5 = "1&2 to change items";

    const controlLine1 = <Label>this.add.uiElement(
      UIElementType.LABEL,
      "control",
      {
        position: new Vec2(center.x, center.y - 200),
        text: controlText1,
      }
    );
    const controlLine2 = <Label>this.add.uiElement(
      UIElementType.LABEL,
      "control",
      {
        position: new Vec2(center.x, center.y - 150),
        text: controlText2,
      }
    );
    const controlLine3 = <Label>this.add.uiElement(
      UIElementType.LABEL,
      "control",
      {
        position: new Vec2(center.x, center.y - 50),
        text: controlText3,
      }
    );
    const controlLine4 = <Label>this.add.uiElement(
      UIElementType.LABEL,
      "control",
      {
        position: new Vec2(center.x, center.y),
        text: controlText4,
      }
    );
    const controlLine5 = <Label>this.add.uiElement(
      UIElementType.LABEL,
      "control",
      {
        position: new Vec2(center.x, center.y + 50),
        text: controlText5,
      }
    );

    controlLine1.textColor = Color.WHITE;
    controlLine2.textColor = Color.WHITE;
    controlLine3.textColor = Color.WHITE;
    controlLine4.textColor = Color.WHITE;
    controlLine5.textColor = Color.WHITE;

    const controlBack = this.add.uiElement(UIElementType.BUTTON, "control", {
      position: new Vec2(center.x, center.y + 250),
      text: "Back",
    });
    controlBack.size.set(200, 50);
    controlBack.borderWidth = 2;
    controlBack.borderColor = Color.WHITE;
    controlBack.backgroundColor = Color.TRANSPARENT;
    controlBack.onClickEventId = "menu";
  }

  updateScene() {
    //TODO: going to about to back makes the screen frozen
    while (this.receiver.hasNextEvent()) {
      let event = this.receiver.getNextEvent();

      console.log(event);

      if (event.type === "play") {
        this.sceneManager.changeToScene(mainScene, {});
      }

      if (event.type === "about") {
        this.about.setHidden(false);
        this.mainMenu.setHidden(true);
      }

      if (event.type === "menu") {
        this.mainMenu.setHidden(false);
        this.about.setHidden(true);
        this.control.setHidden(true);
      }
      if (event.type === "control") {
        this.mainMenu.setHidden(true);
        this.control.setHidden(false);
      }
    }
  }
}
