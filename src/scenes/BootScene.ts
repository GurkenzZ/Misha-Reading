import Phaser from "phaser";
import { CONTENT_KEYS, contentPath } from "../content/paths";

export class BootScene extends Phaser.Scene {
  public constructor() {
    super("BootScene");
  }

  public preload(): void {
    const width = this.scale.width;
    const height = this.scale.height;
    const barWidth = 420;
    const barHeight = 22;
    const barX = (width - barWidth) / 2;
    const barY = height / 2 + 34;

    this.add.rectangle(width / 2, height / 2, width, height, 0xf8f2df);
    this.add
      .text(width / 2, height / 2 - 24, "Загрузка...", {
        color: "#334155",
        fontFamily: "Arial, sans-serif",
        fontSize: "28px"
      })
      .setOrigin(0.5);

    const progressFrame = this.add
      .rectangle(width / 2, barY + barHeight / 2, barWidth, barHeight, 0xffffff, 0.72)
      .setStrokeStyle(2, 0x8aa29e, 1);
    const progressFill = this.add.rectangle(barX, barY, 0, barHeight, 0x6aa56f, 1).setOrigin(0, 0);
    const progressLabel = this.add
      .text(width / 2, barY + 48, "0%", {
        color: "#566573",
        fontFamily: "Arial, sans-serif",
        fontSize: "18px"
      })
      .setOrigin(0.5);

    this.load.on("progress", (value: number) => {
      progressFill.width = Math.max(4, barWidth * value);
      progressLabel.setText(`${Math.round(value * 100)}%`);
    });

    this.load.on("complete", () => {
      progressFrame.setStrokeStyle(2, 0x6aa56f, 1);
      progressLabel.setText("Готово");
    });

    this.load.json(CONTENT_KEYS.letters, contentPath("letters.json"));
    this.load.json(CONTENT_KEYS.bootstrapLevel, contentPath("levels/bootstrap.json"));
  }

  public create(): void {
    this.scene.start("StartScene");
  }
}
