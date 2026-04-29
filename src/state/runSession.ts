export type RunSessionState = "idle" | "running" | "blocked" | "complete";

export interface RunSessionSnapshot {
  readonly state: RunSessionState;
  readonly obstacleIndex: number;
  readonly heroRouteX: number;
}

export class RunSessionRuntime {
  private state: RunSessionState = "idle";
  private obstacleIndex = 0;
  private heroRouteX: number;

  public constructor(startRouteX: number) {
    this.heroRouteX = startRouteX;
  }

  public getSnapshot(): RunSessionSnapshot {
    return {
      state: this.state,
      obstacleIndex: this.obstacleIndex,
      heroRouteX: this.heroRouteX
    };
  }

  public start(): void {
    if (this.state === "idle") {
      this.state = "running";
    }
  }

  public moveHero(routeX: number): void {
    this.heroRouteX = routeX;
  }

  public blockAtObstacle(obstacleIndex: number, routeX: number): void {
    this.obstacleIndex = obstacleIndex;
    this.heroRouteX = routeX;
    this.state = "blocked";
  }

  public complete(routeX: number): void {
    this.heroRouteX = routeX;
    this.state = "complete";
  }

  public resolveCurrentObstacle(routeX: number): void {
    if (this.state !== "blocked") {
      return;
    }

    this.obstacleIndex += 1;
    this.heroRouteX = routeX;
    this.state = "running";
  }

  public isRunning(): boolean {
    return this.state === "running";
  }
}
