import Game from "./Wolfie2D/Loop/Game";
import mainScene from "./mayhemFiles/Scene/MainScene";
import RegistryManager from "./Wolfie2D/Registry/RegistryManager";
import WeaponTemplateRegistry from "./Wolfie2D/Registry/WeaponRegistry";
import WeaponTypeRegistry from "./Wolfie2D/Registry/WeaponTypeRegistry";
import MainMenu from "./mayhemFiles/Scene/MainMenu";
import GoapActionPlanner from "./Wolfie2D/AI/GoapActionPlanner";

// The main function is your entrypoint into Wolfie2D. Specify your first scene and any options here.
(function main(){
    // Run any tests
    runTests();

    // Set up options for our game
    let options = {
        canvasSize: {x: 1200, y: 800},          // The size of the game
        clearColor: {r: 0.1, g: 0.1, b: 0.1},   // The color the game clears to
        inputs: [
            {name: "forward", keys: ["w"]},
            {name: "backward", keys: ["s"]},
            {name: "left", keys: ["a"]},
            {name: "right", keys: ["d"]},
            {name: "pickup", keys: ["e"]},
            {name: "drop", keys: ["q"]},
            {name: "slot1", keys: ["1"]},
            {name: "slot2", keys: ["2"]},
        ],
        useWebGL: false,                        // Tell the game we want to use webgl
        showDebug: false                       // Whether to show debug messages. You can change this to true if you want
    }

    // Set up custom registries
    let weaponTemplateRegistry = new WeaponTemplateRegistry();
    RegistryManager.addCustomRegistry("weaponTemplates", weaponTemplateRegistry);
    
    let weaponTypeRegistry = new WeaponTypeRegistry();
    RegistryManager.addCustomRegistry("weaponTypes", weaponTypeRegistry);

    // Create a game with the options specified
    const game = new Game(options);

    // Start our game
    game.start(MainMenu, {});
})();

function runTests(){
    
};