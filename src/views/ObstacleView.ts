import Phaser from "phaser";
import { ObstacleKind, RouteObstacleContent } from "../content/obstacleTypes";
import { ReadingRoute } from "../systems/readingRoute";

type ObstacleParts =
  | {
      readonly kind: "door";
      readonly door: Phaser.GameObjects.Rectangle;
      readonly knob: Phaser.GameObjects.Arc;
      readonly glow: Phaser.GameObjects.Arc;
    }
  | {
      readonly kind: "bridge";
      readonly deck: Phaser.GameObjects.Rectangle;
      readonly leftPost: Phaser.GameObjects.Rectangle;
      readonly rightPost: Phaser.GameObjects.Rectangle;
    }
  | {
      readonly kind: "mechanism";
      readonly wheel: Phaser.GameObjects.Arc;
      readonly bars: Phaser.GameObjects.Container;
    }
  | {
      readonly kind: "slot";
      readonly frame: Phaser.GameObjects.Rectangle;
      readonly mouth: Phaser.GameObjects.Rectangle;
      readonly glow: Phaser.GameObjects.Rectangle;
    };

export class ObstacleView {
  public readonly id: string;

  private readonly scene: Phaser.Scene;
  private readonly container: Phaser.GameObjects.Container;
  private readonly parts: ObstacleParts;
  private resolved = false;

  private constructor(scene: Phaser.Scene, obstacle: RouteObstacleContent, x: number, y: number) {
    this.scene = scene;
    this.id = obstacle.id;
    this.container = scene.add.container(x, y).setDepth(7);
    this.parts = this.createParts(obstacle.kind);

    const title = scene.add
      .text(0, -104, obstacle.title, {
        color: "#243447",
        fontFamily: "Arial, sans-serif",
        fontSize: "13px",
        fontStyle: "700"
      })
      .setOrigin(0.5);

    this.container.add(title);
  }

  public static drawAll(
    scene: Phaser.Scene,
    route: ReadingRoute,
    obstacles: readonly RouteObstacleContent[]
  ): Map<string, ObstacleView> {
    const views = new Map<string, ObstacleView>();

    obstacles.forEach((obstacle) => {
      const point = route.getPoint(obstacle.routeX);
      const view = new ObstacleView(scene, obstacle, point.x, point.y);
      views.set(obstacle.id, view);
    });

    return views;
  }

  public resolve(onComplete: () => void): void {
    if (this.resolved) {
      onComplete();
      return;
    }

    this.resolved = true;

    switch (this.parts.kind) {
      case "door":
        this.resolveDoor(this.parts, onComplete);
        break;
      case "bridge":
        this.resolveBridge(this.parts, onComplete);
        break;
      case "mechanism":
        this.resolveMechanism(this.parts, onComplete);
        break;
      case "slot":
        this.resolveSlot(this.parts, onComplete);
        break;
    }
  }

  private createParts(kind: ObstacleKind): ObstacleParts {
    switch (kind) {
      case "door":
        return this.createDoorParts();
      case "bridge":
        return this.createBridgeParts();
      case "mechanism":
        return this.createMechanismParts();
      case "slot":
        return this.createSlotParts();
    }
  }

  private createDoorParts(): ObstacleParts {
    const glow = this.scene.add.circle(0, -48, 44, 0xfff7c2, 0).setScale(0.6);
    const door = this.scene.add.rectangle(0, -48, 58, 92, 0x9b6b43, 1).setStrokeStyle(4, 0x6f4e37, 1);
    const knob = this.scene.add.circle(17, -44, 5, 0xf7d26a, 1);

    this.container.add([glow, door, knob]);

    return {
      kind: "door",
      door,
      knob,
      glow
    };
  }

  private createBridgeParts(): ObstacleParts {
    const leftPost = this.scene.add.rectangle(-30, -12, 12, 30, 0x6f4e37, 1);
    const rightPost = this.scene.add.rectangle(30, -12, 12, 30, 0x6f4e37, 1);
    const deck = this.scene.add.rectangle(0, -62, 92, 20, 0x8b6f47, 1).setAngle(-8);

    this.container.add([leftPost, rightPost, deck]);

    return {
      kind: "bridge",
      deck,
      leftPost,
      rightPost
    };
  }

  private createMechanismParts(): ObstacleParts {
    const wheel = this.scene.add.circle(0, -48, 36, 0x7c8aa5, 1).setStrokeStyle(5, 0x3f4b61, 1);
    const bars = this.scene.add.container(0, -48);
    const vertical = this.scene.add.rectangle(0, 0, 10, 62, 0xf8f2df, 1);
    const horizontal = this.scene.add.rectangle(0, 0, 62, 10, 0xf8f2df, 1);

    bars.add([vertical, horizontal]);
    this.container.add([wheel, bars]);

    return {
      kind: "mechanism",
      wheel,
      bars
    };
  }

  private createSlotParts(): ObstacleParts {
    const glow = this.scene.add.rectangle(0, -48, 84, 74, 0xfff7c2, 0).setScale(0.8);
    const frame = this.scene.add.rectangle(0, -48, 74, 64, 0x58636f, 1).setStrokeStyle(4, 0x243447, 1);
    const mouth = this.scene.add.rectangle(0, -48, 46, 12, 0xf8f2df, 1);

    this.container.add([glow, frame, mouth]);

    return {
      kind: "slot",
      frame,
      mouth,
      glow
    };
  }

  private resolveDoor(parts: Extract<ObstacleParts, { readonly kind: "door" }>, onComplete: () => void): void {
    this.scene.tweens.add({
      targets: parts.glow,
      alpha: 0.78,
      scaleX: 1,
      scaleY: 1,
      duration: 180,
      ease: "Sine.easeOut"
    });
    this.scene.tweens.add({
      targets: parts.door,
      x: -22,
      scaleX: 0.22,
      alpha: 0.86,
      duration: 300,
      ease: "Sine.easeOut",
      onComplete
    });
    this.scene.tweens.add({
      targets: parts.knob,
      alpha: 0,
      duration: 150,
      ease: "Sine.easeOut"
    });
  }

  private resolveBridge(parts: Extract<ObstacleParts, { readonly kind: "bridge" }>, onComplete: () => void): void {
    this.scene.tweens.add({
      targets: parts.deck,
      y: -24,
      angle: 0,
      duration: 320,
      ease: "Sine.easeOut",
      onComplete
    });
    this.scene.tweens.add({
      targets: [parts.leftPost, parts.rightPost],
      scaleY: 1.12,
      y: -10,
      duration: 220,
      ease: "Sine.easeOut"
    });
  }

  private resolveMechanism(
    parts: Extract<ObstacleParts, { readonly kind: "mechanism" }>,
    onComplete: () => void
  ): void {
    parts.wheel.setFillStyle(0x6aa56f, 1);
    this.scene.tweens.add({
      targets: parts.bars,
      angle: 90,
      duration: 360,
      ease: "Sine.easeInOut",
      onComplete
    });
  }

  private resolveSlot(parts: Extract<ObstacleParts, { readonly kind: "slot" }>, onComplete: () => void): void {
    parts.frame.setFillStyle(0x6aa56f, 1);
    parts.mouth.setFillStyle(0xffffff, 1);
    this.scene.tweens.add({
      targets: parts.glow,
      alpha: 0.82,
      scaleX: 1.1,
      scaleY: 1.04,
      duration: 260,
      ease: "Sine.easeOut",
      onComplete
    });
  }
}
