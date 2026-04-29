import Phaser from "phaser";
import { OverlayPoint } from "./obstacleOverlayLayout";

export class LetterSlot {
  public readonly dropZone: Phaser.GameObjects.Zone;

  private readonly frame: Phaser.GameObjects.Rectangle;
  private readonly label: Phaser.GameObjects.Text;

  public constructor(scene: Phaser.Scene, center: OverlayPoint) {
    this.frame = scene.add
      .rectangle(center.x, center.y, 122, 92, 0xffffff, 1)
      .setStrokeStyle(5, 0x58636f, 1)
      .setDepth(32);
    this.label = scene.add
      .text(center.x, center.y + 58, "\u0441\u043b\u043e\u0442", {
        color: "#64748b",
        fontFamily: "Arial, sans-serif",
        fontSize: "15px"
      })
      .setOrigin(0.5)
      .setDepth(32);
    this.dropZone = scene.add.zone(center.x, center.y, 132, 102).setRectangleDropZone(132, 102);
    this.dropZone.setData("slot", "letter");
  }

  public accept(letter: string): void {
    this.frame.setFillStyle(0xdff1f0, 1);
    this.frame.setStrokeStyle(5, 0x2f855a, 1);
    this.label.setText(letter);
    this.label.setColor("#243447");
    this.label.setFontSize(34);
    this.label.setFontStyle("700");
    this.label.setPosition(this.frame.x, this.frame.y);
  }

  public showWrongFeedback(): void {
    this.frame.setStrokeStyle(5, 0xd97706, 1);
  }

  public resetFeedback(): void {
    this.frame.setStrokeStyle(5, 0x58636f, 1);
  }
}
