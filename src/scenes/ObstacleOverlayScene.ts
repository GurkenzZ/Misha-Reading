import Phaser from "phaser";
import { RouteObstacleContent } from "../content/obstacleTypes";

interface ObstacleOverlayData {
  readonly obstacle: RouteObstacleContent;
  readonly obstacleIndex: number;
}

export class ObstacleOverlayScene extends Phaser.Scene {
  private obstacle: RouteObstacleContent | null = null;
  private obstacleIndex = 0;

  public constructor() {
    super("ObstacleOverlayScene");
  }

  public init(data: ObstacleOverlayData): void {
    this.obstacle = data.obstacle;
    this.obstacleIndex = data.obstacleIndex;
  }

  public create(): void {
    const { width, height } = this.scale;
    const obstacle = this.obstacle;

    this.add.rectangle(width / 2, height / 2, width, height, 0x243447, 0.18);

    if (obstacle === null) {
      return;
    }

    const panel = this.add
      .rectangle(width / 2, height / 2, 360, 230, 0xfffbeb, 0.96)
      .setStrokeStyle(4, 0x8aa29e, 1);
    const title = this.add
      .text(width / 2, height / 2 - 84, `Blocked: ${obstacle.title}`, {
        align: "center",
        color: "#243447",
        fontFamily: "Arial, sans-serif",
        fontSize: "24px",
        fontStyle: "700"
      })
      .setOrigin(0.5);
    const subtitle = this.add
      .text(width / 2, height / 2 + 74, `Obstacle ${this.obstacleIndex + 1}`, {
        color: "#566573",
        fontFamily: "Arial, sans-serif",
        fontSize: "16px"
      })
      .setOrigin(0.5);

    this.drawPlaceholder(width / 2, height / 2 + 8, obstacle.kind);
    panel.setDepth(30);
    title.setDepth(31);
    subtitle.setDepth(31);
  }

  private drawPlaceholder(x: number, y: number, kind: RouteObstacleContent["kind"]): void {
    switch (kind) {
      case "door":
        this.drawDoor(x, y);
        break;
      case "bridge":
        this.drawBridge(x, y);
        break;
      case "mechanism":
        this.drawMechanism(x, y);
        break;
      case "slot":
        this.drawSlot(x, y);
        break;
    }
  }

  private drawDoor(x: number, y: number): void {
    this.add.rectangle(x, y, 76, 100, 0x9b6b43, 1).setStrokeStyle(5, 0x6f4e37, 1).setDepth(31);
    this.add.circle(x + 22, y + 6, 6, 0xf7d26a, 1).setDepth(32);
  }

  private drawBridge(x: number, y: number): void {
    this.add.rectangle(x, y + 14, 132, 26, 0x8b6f47, 1).setDepth(31);
    this.add.rectangle(x - 44, y + 36, 16, 42, 0x6f4e37, 1).setDepth(31);
    this.add.rectangle(x + 44, y + 36, 16, 42, 0x6f4e37, 1).setDepth(31);
  }

  private drawMechanism(x: number, y: number): void {
    this.add.circle(x, y, 48, 0x7c8aa5, 1).setStrokeStyle(6, 0x3f4b61, 1).setDepth(31);
    this.add.rectangle(x, y, 12, 82, 0xfffbeb, 1).setDepth(32);
    this.add.rectangle(x, y, 82, 12, 0xfffbeb, 1).setDepth(32);
  }

  private drawSlot(x: number, y: number): void {
    this.add.rectangle(x, y, 100, 78, 0x58636f, 1).setStrokeStyle(5, 0x243447, 1).setDepth(31);
    this.add.rectangle(x, y - 2, 62, 14, 0xfffbeb, 1).setDepth(32);
  }
}
