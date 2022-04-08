import Registry from "./Registries/Registry";
import ResourceManager from "../ResourceManager/ResourceManager";
import LaserGun from "../../mayhemFiles/GameSystems/items/WeaponTypes/LaserGun";
import SemiAutoGun from "../../mayhemFiles/GameSystems/items/WeaponTypes/SemiAutoGun";
import Slice from "../../mayhemFiles/GameSystems/items/WeaponTypes/Slice";
import WeaponType from "../../mayhemFiles/GameSystems/items/WeaponTypes/WeaponType";

export default class WeaponTemplateRegistry extends Registry<WeaponConstructor> {
    
    public preload(): void {
        const rm = ResourceManager.getInstance();

        // Load sprites
        rm.image("pistol", "mayhemAssets/sprites/pistol.png");
        rm.image("knife", "mayhemAssets/sprites/knife.png");
        rm.image("laserGun", "mayhemAssets/sprites/laserGun.png")

        // Load spritesheets
        rm.spritesheet("slice", "mayhemAssets/spritesheets/slice.json");

        // Register default types
        this.registerItem("slice", Slice);
        this.registerItem("laserGun", LaserGun);
        this.registerItem("semiAutoGun", SemiAutoGun);
    }

    // We don't need this for this assignment
    public registerAndPreloadItem(key: string): void {}

    public registerItem(key: string, constr: WeaponConstructor): void {
        this.add(key, constr);
    }
}

type WeaponConstructor = new (...args: any) => WeaponType;