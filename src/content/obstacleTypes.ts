export const OBSTACLE_KINDS = ["door", "bridge", "mechanism", "slot"] as const;

export type ObstacleKind = (typeof OBSTACLE_KINDS)[number];

export interface RouteObstacleContent {
  readonly id: string;
  readonly kind: ObstacleKind;
  readonly title: string;
  readonly routeX: number;
}

export function isRouteObstacleContentArray(value: unknown): value is readonly RouteObstacleContent[] {
  return Array.isArray(value) && value.every(isRouteObstacleContent);
}

function isRouteObstacleContent(value: unknown): value is RouteObstacleContent {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    isObstacleKind(value.kind) &&
    typeof value.title === "string" &&
    typeof value.routeX === "number" &&
    Number.isFinite(value.routeX)
  );
}

function isObstacleKind(value: unknown): value is ObstacleKind {
  return typeof value === "string" && OBSTACLE_KINDS.includes(value as ObstacleKind);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
