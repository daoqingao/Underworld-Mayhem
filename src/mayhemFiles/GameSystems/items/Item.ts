import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";

export default abstract class Item {
  use(owner: AnimatedSprite, arg1: string, lookDirection: Vec2) {
    throw new Error("Method not implemented.");
  }
  /** The sprite that represents this weapon in the world or in an inventory */
  sprite: Sprite;

  constructor(sprite: Sprite) {
    this.sprite = sprite;
  }

  moveSprite(position: Vec2, layer?: string) {
    // Change the layer if needed
    if (layer) {
      let currentLayer = this.sprite.getLayer();
      currentLayer.removeNode(this.sprite);
      let newLayer = this.sprite.getScene().getLayer(layer);
      newLayer.addNode(this.sprite);
      this.sprite.setLayer(newLayer);
    }

    // Move the sprite
    this.sprite.position.copy(position);
  }
}
