import GameNode from "../../Wolfie2D/Nodes/GameNode";
import BattlerAI from "../AI/BattlerAI";
import Weapon from "./items/Weapon";

export default class BattleManager {
    players: Array<BattlerAI>;

    enemies: Array<BattlerAI>;

    handleInteraction(attackerType: string, weapon: Weapon) {
        if (attackerType === "player") {
            // Check for collisions with enemies
            for (let enemy of this.enemies) {
                if (weapon.hits(enemy.owner)) {
                    enemy.damage(weapon.type.damage);
                }
            }
        } else {
            // Check for collision with player
            for (let player of this.players) {
                if (weapon.hits(player.owner)) {
                    player.damage(weapon.type.damage);
                }
            }
        }
    }

    setPlayers(player: Array<BattlerAI>): void {
        this.players = player;
    }

    setEnemies(enemies: Array<BattlerAI>): void {
        this.enemies = enemies;
    }
}