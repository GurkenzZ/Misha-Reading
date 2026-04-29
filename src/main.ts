import Phaser from "phaser";
import "./styles.css";
import { gameConfig } from "./game/config";

const gameRoot = document.querySelector<HTMLElement>("#game-root");

if (gameRoot === null) {
  throw new Error("Game root element #game-root was not found.");
}

new Phaser.Game(gameConfig);
