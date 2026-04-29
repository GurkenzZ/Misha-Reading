export const OBSTACLE_KINDS = ["door", "bridge", "mechanism", "slot"] as const;

export type ObstacleKind = (typeof OBSTACLE_KINDS)[number];

export interface RouteObstacleContent {
  readonly id: string;
  readonly kind: ObstacleKind;
  readonly title: string;
  readonly routeX: number;
  readonly targetLetter: string;
  readonly candidateLetters: readonly [string, string, string];
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
    Number.isFinite(value.routeX) &&
    typeof value.targetLetter === "string" &&
    isThreeStringArray(value.candidateLetters) &&
    value.candidateLetters.includes(value.targetLetter)
  );
}

function isObstacleKind(value: unknown): value is ObstacleKind {
  return typeof value === "string" && OBSTACLE_KINDS.includes(value as ObstacleKind);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isThreeStringArray(value: unknown): value is readonly [string, string, string] {
  return (
    Array.isArray(value) &&
    value.length === 3 &&
    value.every((item) => typeof item === "string")
  );
}
