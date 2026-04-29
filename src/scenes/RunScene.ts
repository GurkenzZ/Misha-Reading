import Phaser from "phaser";
import { readBootstrapLevel } from "../content/bootstrapContent";
import { RouteObstacleContent } from "../content/obstacleTypes";
import { ObstacleOverlayScene, ObstacleSolvedPayload } from "./ObstacleOverlayScene";
import { RunSessionRuntime } from "../state/runSession";
import { ReadingRoute } from "../systems/readingRoute";
import { RouteMotion } from "../systems/routeMotion";
import { RunDebugPanel } from "../ui/RunDebugPanel";
import { HeroView } from "../views/HeroView";
import { ObstacleView } from "../views/ObstacleView";

const HERO_SPEED_PIXELS_PER_SECOND = 92;
const OBSTACLE_STOP_DISTANCE = 52;

export class RunScene extends Phaser.Scene {
  private route: ReadingRoute | null = null;
  private hero: HeroView | null = null;
  private motion: RouteMotion | null = null;
  private session: RunSessionRuntime | null = null;
  private debugPanel: RunDebugPanel | null = null;
  private obstacles: readonly RouteObstacleContent[] = [];
  private readonly handleObstacleSolved = (payload: ObstacleSolvedPayload): void => {
    if (this.session === null) {
      return;
    }

    const snapshot = this.session.getSnapshot();
    const currentObstacle = this.obstacles[snapshot.obstacleIndex];

    if (currentObstacle?.id !== payload.obstacleId) {
      return;
    }

    this.session.resolveCurrentObstacle(snapshot.heroRouteX);
    this.debugPanel?.update(this.session.getSnapshot());
  };

  public constructor() {
    super("RunScene");
  }

  public create(): void {
    const { width, height } = this.scale;
    const route = new ReadingRoute({
      startX: 90,
      endX: width - 84,
      baseY: height * 0.72
    });

    this.drawBackground(width, height);
    this.drawRoute(route);

    this.add
      .text(32, 28, "\u041c\u0430\u0440\u0448\u0440\u0443\u0442 \u0447\u0442\u0435\u043d\u0438\u044f", {
        color: "#243447",
        fontFamily: "Arial, sans-serif",
        fontSize: "28px",
        fontStyle: "700"
      })
      .setOrigin(0, 0);

    const levelResult = readBootstrapLevel(this.cache.json);
    if (!levelResult.ok) {
      this.showDebugError(levelResult.message);
      return;
    }

    this.obstacles = [...levelResult.level.obstacles].sort((left, right) => left.routeX - right.routeX);
    ObstacleView.drawAll(this, route, this.obstacles);

    this.add
      .text(32, 72, levelResult.level.title, {
        color: "#566573",
        fontFamily: "Arial, sans-serif",
        fontSize: "20px"
      })
      .setOrigin(0, 0);

    const hero = new HeroView(this, route.getPoint(route.startX));
    const session = new RunSessionRuntime(route.startX);

    this.route = route;
    this.hero = hero;
    this.session = session;
    this.motion = new RouteMotion(route, this.obstacles, {
      speedPixelsPerSecond: HERO_SPEED_PIXELS_PER_SECOND,
      obstacleStopDistance: OBSTACLE_STOP_DISTANCE
    });

    if (import.meta.env.DEV) {
      this.debugPanel = new RunDebugPanel(this, 16, height - 96);
      this.debugPanel.update(session.getSnapshot());
    }

    session.start();
  }

  public update(_time: number, delta: number): void {
    if (this.route === null || this.hero === null || this.motion === null || this.session === null) {
      return;
    }

    if (this.session.isRunning()) {
      const snapshot = this.session.getSnapshot();
      const motionResult = this.motion.advance(snapshot.heroRouteX, snapshot.obstacleIndex, delta);
      const routePoint = this.route.getPoint(motionResult.routeX);

      this.hero.setRoutePoint(routePoint);

      if (motionResult.blockedObstacleIndex !== null) {
        this.session.blockAtObstacle(motionResult.blockedObstacleIndex, motionResult.routeX);
        this.showObstacleOverlay(motionResult.blockedObstacleIndex);
      } else if (motionResult.completed) {
        this.session.complete(motionResult.routeX);
      } else {
        this.session.moveHero(motionResult.routeX);
      }
    }

    this.debugPanel?.update(this.session.getSnapshot());
  }

  private drawBackground(width: number, height: number): void {
    const graphics = this.add.graphics();
    graphics.fillStyle(0xdff1f0, 1);
    graphics.fillRect(0, 0, width, height);
    graphics.fillStyle(0xf9e8a8, 1);
    graphics.fillCircle(width - 96, 86, 42);
    graphics.fillStyle(0xc8dfb8, 1);
    graphics.fillEllipse(width * 0.28, height + 22, 700, 220);
    graphics.fillStyle(0xb4d3a8, 1);
    graphics.fillEllipse(width * 0.78, height + 36, 740, 250);
  }

  private drawRoute(route: ReadingRoute): void {
    const graphics = this.add.graphics();

    graphics.lineStyle(24, 0xe0b46f, 1);
    this.strokeRoute(graphics, route);

    graphics.lineStyle(4, 0xffffff, 0.72);
    this.strokeRoute(graphics, route);
  }

  private strokeRoute(graphics: Phaser.GameObjects.Graphics, route: ReadingRoute): void {
    const steps = 42;
    const firstPoint = route.getPoint(route.startX);

    graphics.beginPath();
    graphics.moveTo(firstPoint.x, firstPoint.y);

    for (let index = 1; index <= steps; index += 1) {
      const routeX = Phaser.Math.Linear(route.startX, route.endX, index / steps);
      const point = route.getPoint(routeX);
      graphics.lineTo(point.x, point.y);
    }

    graphics.strokePath();
  }

  private showObstacleOverlay(obstacleIndex: number): void {
    const obstacle = this.obstacles[obstacleIndex];

    if (obstacle === undefined) {
      return;
    }

    const overlayScene = this.scene.get("ObstacleOverlayScene") as ObstacleOverlayScene;
    overlayScene.events.once("obstacleSolved", this.handleObstacleSolved);
    this.scene.launch("ObstacleOverlayScene", {
      obstacleId: obstacle.id,
      targetLetter: obstacle.targetLetter,
      candidateLetters: obstacle.candidateLetters
    });
    this.scene.bringToTop("ObstacleOverlayScene");
  }

  private showDebugError(message: string): void {
    this.add
      .rectangle(480, 116, 760, 68, 0xfff1f2, 0.94)
      .setStrokeStyle(2, 0xe11d48, 0.9);
    this.add
      .text(120, 94, `Content debug: ${message}`, {
        color: "#9f1239",
        fontFamily: "Arial, sans-serif",
        fontSize: "18px",
        wordWrap: { width: 720 }
      })
      .setOrigin(0, 0);
  }
}
