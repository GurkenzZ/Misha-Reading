import Phaser from "phaser";
import { OverlayPoint } from "./obstacleOverlayLayout";

export class LetterTile {
  public readonly letter: string;
  public readonly container: Phaser.GameObjects.Container;

  private readonly origin: OverlayPoint;
  private readonly background: Phaser.GameObjects.Rectangle;

  public constructor(scene: Phaser.Scene, letter: string, origin: OverlayPoint) {
    this.letter = letter;
    this.origin = origin;
    this.container = scene.add.container(origin.x, origin.y).setDepth(36);

    this.background = scene.add
      .rectangle(0, 0, 96, 88, 0xf8f2df, 1)
      .setStrokeStyle(4, 0x467aa0, 1);
    const label = scene.add
      .text(0, -2, letter, {
        color: "#243447",
        fontFamily: "Arial, sans-serif",
        fontSize: "38px",
        fontStyle: "700"
      })
      .setOrigin(0.5);

    this.container.add([this.background, label]);
    this.container.setSize(96, 88);
    this.container.setInteractive({ draggable: true, useHandCursor: true });
    scene.input.setDraggable(this.container);
  }

  public dragTo(x: number, y: number): void {
    this.container.setPosition(x, y);
  }

  public lift(): void {
    this.container.setDepth(45);
    this.background.setFillStyle(0xffffff, 1);
  }

  public returnHome(scene: Phaser.Scene): void {
    this.background.setFillStyle(0xf8f2df, 1);
    this.background.setStrokeStyle(4, 0x467aa0, 1);
    scene.tweens.add({
      targets: this.container,
      x: this.origin.x,
      y: this.origin.y,
      duration: 160,
      ease: "Sine.easeOut",
      onComplete: () => {
        this.container.setDepth(36);
      }
    });
  }

  public reject(scene: Phaser.Scene): void {
    this.background.setStrokeStyle(4, 0xd97706, 1);
    scene.tweens.add({
      targets: this.container,
      x: this.origin.x,
      y: this.origin.y,
      duration: 210,
      ease: "Back.easeOut",
      onComplete: () => {
        this.background.setFillStyle(0xf8f2df, 1);
        this.background.setStrokeStyle(4, 0x467aa0, 1);
        this.container.setDepth(36);
      }
    });
  }

  public acceptAt(scene: Phaser.Scene, point: OverlayPoint): void {
    this.container.disableInteractive();
    this.background.setFillStyle(0xdff1f0, 1);
    this.background.setStrokeStyle(4, 0x2f855a, 1);
    scene.tweens.add({
      targets: this.container,
      x: point.x,
      y: point.y,
      duration: 140,
      ease: "Sine.easeOut"
    });
  }
}
