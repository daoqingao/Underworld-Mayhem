import Registry from "./Registries/Registry";
import ResourceManager from "../ResourceManager/ResourceManager";
import LaserGun from "../../hw4/GameSystems/items/WeaponTypes/LaserGun";
import SemiAutoGun from "../../hw4/GameSystems/items/WeaponTypes/SemiAutoGun";
import Slice from "../../hw4/GameSystems/items/WeaponTypes/Slice";
import WeaponType from "../../hw4/GameSystems/items/WeaponTypes/WeaponType";

export default class WeaponTemplateRegistry extends Registry<WeaponConstructor> {
    
    public preload(): void {
        const rm = ResourceManager.getInstance();

        // Load sprites
        rm.image("pistol", "hw4_assets/sprites/pistol.png");
        rm.image("knife", "hw4_assets/sprites/knife.png");
        rm.image("laserGun", "hw4_assets/sprites/laserGun.png")

        // Load spritesheets
        rm.spritesheet("slice", "hw4_assets/spritesheets/slice.json");

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