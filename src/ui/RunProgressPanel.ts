import Phaser from "phaser";

export class RunProgressPanel {
  private readonly scene: Phaser.Scene;
  private readonly total: number;
  private readonly barWidth: number;
  private readonly fill: Phaser.GameObjects.Rectangle;
  private readonly label: Phaser.GameObjects.Text;
  private solvedCount = -1;

  public constructor(scene: Phaser.Scene, x: number, y: number, total: number) {
    this.scene = scene;
    this.total = total;
    this.barWidth = 230;

    scene.add
      .rectangle(x, y, this.barWidth + 28, 54, 0xffffff, 0.7)
      .setOrigin(1, 0)
      .setStrokeStyle(2, 0x8aa29e, 0.75)
      .setDepth(18);
    scene.add
      .rectangle(x - this.barWidth - 14, y + 34, this.barWidth, 12, 0xd8e2dc, 1)
      .setOrigin(0, 0.5)
      .setDepth(19);

    this.fill = scene.add
      .rectangle(x - this.barWidth - 14, y + 34, this.barWidth, 12, 0x6aa56f, 1)
      .setOrigin(0, 0.5)
      .setScale(0, 1)
      .setDepth(20);
    this.label = scene.add
      .text(x - 14, y + 10, "", {
        align: "right",
        color: "#243447",
        fontFamily: "Arial, sans-serif",
        fontSize: "16px",
        fontStyle: "700"
      })
      .setOrigin(1, 0)
      .setDepth(20);

    this.update(0, false);
  }

  public update(solvedCount: number, animate = true): void {
    if (solvedCount === this.solvedCount) {
      return;
    }

    this.solvedCount = solvedCount;
    this.label.setText(`${solvedCount} / ${this.total}`);

    const progress = this.total === 0 ? 1 : Phaser.Math.Clamp(solvedCount / this.total, 0, 1);

    if (!animate) {
      this.fill.setScale(progress, 1);
      return;
    }

    this.scene.tweens.add({
      targets: this.fill,
      scaleX: progress,
      duration: 220,
      ease: "Sine.easeOut"
    });
  }
}
