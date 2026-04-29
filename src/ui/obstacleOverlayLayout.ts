import Phaser from "phaser";

export interface OverlayPoint {
  readonly x: number;
  readonly y: number;
}

export interface ObstacleOverlayLayoutConfig {
  readonly width: number;
  readonly height: number;
}

export class ObstacleOverlayLayout {
  public readonly center: OverlayPoint;
  public readonly panel: Phaser.Geom.Rectangle;
  public readonly lineY: number;
  public readonly slotCenter: OverlayPoint;
  public readonly tileCenters: readonly [OverlayPoint, OverlayPoint, OverlayPoint];
  public readonly feedbackCenter: OverlayPoint;

  public constructor(config: ObstacleOverlayLayoutConfig) {
    this.center = {
      x: config.width / 2,
      y: config.height / 2
    };
    this.panel = new Phaser.Geom.Rectangle(this.center.x - 260, this.center.y - 170, 520, 340);
    this.lineY = this.panel.y + 72;
    this.slotCenter = {
      x: this.center.x,
      y: this.center.y - 24
    };
    this.tileCenters = [
      { x: this.center.x - 150, y: this.center.y + 112 },
      { x: this.center.x, y: this.center.y + 112 },
      { x: this.center.x + 150, y: this.center.y + 112 }
    ];
    this.feedbackCenter = {
      x: this.center.x,
      y: this.center.y + 56
    };
  }

  public drawFrame(scene: Phaser.Scene): void {
    scene.add.rectangle(this.center.x, this.center.y, scene.scale.width, scene.scale.height, 0x243447, 0.18);
    scene.add
      .rectangle(this.center.x, this.center.y, this.panel.width, this.panel.height, 0xfffbeb, 0.97)
      .setStrokeStyle(4, 0x8aa29e, 1)
      .setDepth(30);
  }
}
