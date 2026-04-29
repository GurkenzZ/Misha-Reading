import Phaser from "phaser";

export interface RoutePoint {
  readonly x: number;
  readonly y: number;
}

export interface ReadingRouteConfig {
  readonly startX: number;
  readonly endX: number;
  readonly baseY: number;
}

export class ReadingRoute {
  public readonly startX: number;
  public readonly endX: number;

  private readonly baseY: number;

  public constructor(config: ReadingRouteConfig) {
    this.startX = config.startX;
    this.endX = config.endX;
    this.baseY = config.baseY;
  }

  public getPoint(routeX: number): RoutePoint {
    const x = Phaser.Math.Clamp(routeX, this.startX, this.endX);
    const progress = (x - this.startX) / (this.endX - this.startX);
    const y = this.baseY - Math.sin(progress * Math.PI * 1.4) * 54 + Math.sin(progress * Math.PI * 3) * 12;

    return { x, y };
  }
}
