import { RouteObstacleContent } from "../content/obstacleTypes";
import { ReadingRoute } from "./readingRoute";

export interface RouteMotionResult {
  readonly routeX: number;
  readonly blockedObstacleIndex: number | null;
  readonly completed: boolean;
}

export interface RouteMotionConfig {
  readonly speedPixelsPerSecond: number;
  readonly obstacleStopDistance: number;
}

export class RouteMotion {
  private readonly route: ReadingRoute;
  private readonly obstacles: readonly RouteObstacleContent[];
  private readonly speedPixelsPerSecond: number;
  private readonly obstacleStopDistance: number;

  public constructor(route: ReadingRoute, obstacles: readonly RouteObstacleContent[], config: RouteMotionConfig) {
    this.route = route;
    this.obstacles = obstacles;
    this.speedPixelsPerSecond = config.speedPixelsPerSecond;
    this.obstacleStopDistance = config.obstacleStopDistance;
  }

  public advance(routeX: number, obstacleIndex: number, deltaMs: number): RouteMotionResult {
    const nextObstacle = this.obstacles[obstacleIndex];
    const targetX = nextObstacle === undefined ? this.route.endX : nextObstacle.routeX - this.obstacleStopDistance;
    const unclampedNextX = routeX + (this.speedPixelsPerSecond * deltaMs) / 1000;
    const nextX = Math.min(unclampedNextX, targetX);

    if (nextObstacle !== undefined && nextX >= targetX) {
      return {
        routeX: targetX,
        blockedObstacleIndex: obstacleIndex,
        completed: false
      };
    }

    return {
      routeX: nextX,
      blockedObstacleIndex: null,
      completed: nextX >= this.route.endX
    };
  }
}
