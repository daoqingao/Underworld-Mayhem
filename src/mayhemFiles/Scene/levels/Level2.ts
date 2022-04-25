import mainScene from "../MainScene";

export default class Level2 extends mainScene{
    loadScene() {
        this.load.tilemap("level", "mayhemAssets/tilemaps/level2.json");
        super.mainLoadScene()
    }
    unloadScene() {
    }
    startScene() {
        this.nextLevel=Level2;
        super.mainStartScene()

    }
    updateScene(deltaT: number) {
        super.updateScene(deltaT);
    }
}