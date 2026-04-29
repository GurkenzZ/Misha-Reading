import Phaser from "phaser";
import { RunSessionSnapshot } from "../state/runSession";

export class RunDebugPanel {
  private readonly background: Phaser.GameObjects.Rectangle;
  private readonly label: Phaser.GameObjects.Text;

  public constructor(scene: Phaser.Scene, x: number, y: number) {
    this.background = scene.add
      .rectangle(x, y, 236, 78, 0x111827, 0.72)
      .setOrigin(0, 0)
      .setDepth(20);
    this.label = scene.add
      .text(x + 12, y + 10, "", {
        color: "#e5e7eb",
        fontFamily: "Consolas, monospace",
        fontSize: "14px",
        lineSpacing: 4
      })
      .setOrigin(0, 0)
      .setDepth(21);
  }

  public update(snapshot: RunSessionSnapshot): void {
    this.label.setText([
      `state: ${snapshot.state}`,
      `obstacle: ${snapshot.obstacleIndex}`,
      `hero x: ${snapshot.heroRouteX.toFixed(1)}`
    ]);
  }

  public destroy(): void {
    this.background.destroy();
    this.label.destroy();
  }
}
