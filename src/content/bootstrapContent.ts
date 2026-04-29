import Phaser from "phaser";
import { isRouteObstacleContentArray, RouteObstacleContent } from "./obstacleTypes";
import { CONTENT_KEYS } from "./paths";

export interface BootstrapLevelContent {
  readonly id: string;
  readonly title: string;
  readonly routeLabel: string;
  readonly targetLetters: readonly string[];
  readonly words: readonly string[];
  readonly obstacles: readonly RouteObstacleContent[];
}

export type BootstrapLevelResult =
  | {
      readonly ok: true;
      readonly level: BootstrapLevelContent;
    }
  | {
      readonly ok: false;
      readonly message: string;
    };

export function readBootstrapLevel(cache: Phaser.Cache.BaseCache): BootstrapLevelResult {
  const rawContent: unknown = cache.get(CONTENT_KEYS.bootstrapLevel);

  if (rawContent === undefined) {
    return {
      ok: false,
      message: `Missing loaded JSON for key "${CONTENT_KEYS.bootstrapLevel}".`
    };
  }

  if (!isBootstrapLevelContent(rawContent)) {
    return {
      ok: false,
      message: "bootstrap.json has an unexpected shape."
    };
  }

  return {
    ok: true,
    level: rawContent
  };
}

function isBootstrapLevelContent(value: unknown): value is BootstrapLevelContent {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    typeof value.title === "string" &&
    typeof value.routeLabel === "string" &&
    isStringArray(value.targetLetters) &&
    isStringArray(value.words) &&
    isRouteObstacleContentArray(value.obstacles)
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isStringArray(value: unknown): value is readonly string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}
