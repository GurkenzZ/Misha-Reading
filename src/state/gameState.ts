export interface GameState {
  readonly currentLevelId: string;
}

export function getInitialGameState(): GameState {
  return {
    currentLevelId: "demo"
  };
}
