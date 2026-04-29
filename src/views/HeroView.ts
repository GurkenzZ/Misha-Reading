import Phaser from "phaser";
import { RoutePoint } from "../systems/readingRoute";

export class HeroView {
  private readonly container: Phaser.GameObjects.Container;

  public constructor(scene: Phaser.Scene, point: RoutePoint) {
    this.container = scene.add.container(point.x, point.y);
    this.container.setDepth(10);

    const body = scene.add.graphics();
    body.fillStyle(0x5aa6c8, 1);
    body.fillCircle(0, -50, 30);
    body.fillStyle(0x467aa0, 1);
    body.fillRoundedRect(-34, -18, 68, 76, 18);
    body.fillStyle(0x243447, 1);
    body.fillCircle(-10, -56, 4);
    body.fillCircle(10, -56, 4);
    body.lineStyle(3, 0x243447, 1);
    body.beginPath();
    body.arc(0, -45, 11, 0, Math.PI, false);
    body.strokePath();

    this.container.add(body);
  }

  public setRoutePoint(point: RoutePoint): void {
    this.container.setPosition(point.x, point.y);
  }
}
