import Registry from "./Registries/Registry";
import WeaponType from "../../hw4/GameSystems/items/WeaponTypes/WeaponType";

export default class WeaponTypeRegistry extends Registry<WeaponType> {
    
    public preload(): void {}

    // We don't need this for this assignment
    public registerAndPreloadItem(key: string): void {}

    public registerItem(key: string, type: WeaponType): void {
        this.add(key, type);
    }
}