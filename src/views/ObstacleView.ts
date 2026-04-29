import Phaser from "phaser";
import { RouteObstacleContent } from "../content/obstacleTypes";
import { ReadingRoute } from "../systems/readingRoute";

export class ObstacleView {
  public static drawAll(
    scene: Phaser.Scene,
    route: ReadingRoute,
    obstacles: readonly RouteObstacleContent[]
  ): void {
    obstacles.forEach((obstacle) => {
      const point = route.getPoint(obstacle.routeX);
      ObstacleView.draw(scene, obstacle, point.x, point.y);
    });
  }

  private static draw(scene: Phaser.Scene, obstacle: RouteObstacleContent, x: number, y: number): void {
    switch (obstacle.kind) {
      case "door":
        ObstacleView.drawDoor(scene, x, y);
        break;
      case "bridge":
        ObstacleView.drawBridge(scene, x, y);
        break;
      case "mechanism":
        ObstacleView.drawMechanism(scene, x, y);
        break;
      case "slot":
        ObstacleView.drawSlot(scene, x, y);
        break;
    }

    scene.add
      .text(x, y - 112, obstacle.title, {
        color: "#243447",
        fontFamily: "Arial, sans-serif",
        fontSize: "15px",
        fontStyle: "700"
      })
      .setOrigin(0.5)
      .setDepth(8);
  }

  private static drawDoor(scene: Phaser.Scene, x: number, y: number): void {
    scene.add.rectangle(x, y - 48, 58, 92, 0x9b6b43, 1).setStrokeStyle(4, 0x6f4e37, 1).setDepth(7);
    scene.add.circle(x + 17, y - 44, 5, 0xf7d26a, 1).setDepth(8);
  }

  private static drawBridge(scene: Phaser.Scene, x: number, y: number): void {
    scene.add.rectangle(x, y - 24, 92, 20, 0x8b6f47, 1).setDepth(7);
    scene.add.rectangle(x - 30, y - 12, 12, 30, 0x6f4e37, 1).setDepth(7);
    scene.add.rectangle(x + 30, y - 12, 12, 30, 0x6f4e37, 1).setDepth(7);
  }

  private static drawMechanism(scene: Phaser.Scene, x: number, y: number): void {
    scene.add.circle(x, y - 48, 36, 0x7c8aa5, 1).setStrokeStyle(5, 0x3f4b61, 1).setDepth(7);
    scene.add.rectangle(x, y - 48, 10, 62, 0xf8f2df, 1).setDepth(8);
    scene.add.rectangle(x, y - 48, 62, 10, 0xf8f2df, 1).setDepth(8);
  }

  private static drawSlot(scene: Phaser.Scene, x: number, y: number): void {
    scene.add.rectangle(x, y - 48, 74, 64, 0x58636f, 1).setStrokeStyle(4, 0x243447, 1).setDepth(7);
    scene.add.rectangle(x, y - 48, 46, 12, 0xf8f2df, 1).setDepth(8);
  }
}
