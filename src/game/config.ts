import Phaser from "phaser";
import { BootScene } from "../scenes/BootScene";
import { CompleteScene } from "../scenes/CompleteScene";
import { ObstacleOverlayScene } from "../scenes/ObstacleOverlayScene";
import { RunScene } from "../scenes/RunScene";
import { StartScene } from "../scenes/StartScene";

export const GAME_WIDTH = 960;
export const GAME_HEIGHT = 540;
export const GAME_PARENT_ID = "game-root";

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: GAME_PARENT_ID,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: "#f8f2df",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [BootScene, StartScene, RunScene, ObstacleOverlayScene, CompleteScene]
};
