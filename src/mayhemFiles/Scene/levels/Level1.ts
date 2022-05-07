import mainScene from "../MainScene";
import Level2 from "./Level2";

export default class Level1 extends mainScene {


  //dao made this new method, this new method DETERMINES what type of enemies we are spawning in now
  // regular imp level
  changeEnemySpawnType(data:any):any{
    data.type = "imp"
    return data
  }

  loadScene() {
    this.load.audio("bgm", "mayhemAssets/music/bgm.mp3");
    //dao made changes here, instead of loading them one by one, they are all loaded all at once in the super.mainLoadScene
    // this.load.spritesheet("imp", "mayhemAssets/spritesheets/imp.json");
    // this.load.spritesheet("slime", "mayhemAssets/spritesheets/slime.json");
    // this.load.spritesheet("gemstone", "mayhemAssets/spritesheets/gemstone.json");
    // this.load.spritesheet("caveEnemy", "mayhemAssets/spritesheets/cave.json");

    this.load.tilemap("level", "mayhemAssets/tilemaps/mayhemTileJson.json");
    this.load.image("checkpoint", "mayhemAssets/sprites/checkpoint1.png");
    super.mainLoadScene();
  }
  unloadScene() {}
  startScene() {
    this.currentLevel = "1";
    this.nextLevel = Level2;
    super.mainStartScene();
  }
  updateScene(deltaT: number) {
    super.updateScene(deltaT);
  }
}
