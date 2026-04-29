import Phaser from "phaser";
import { LetterSlot } from "../ui/LetterSlot";
import { LetterTile } from "../ui/LetterTile";
import { ObstacleOverlayLayout } from "../ui/obstacleOverlayLayout";

export interface ObstacleOverlayPayload {
  readonly obstacleId: string;
  readonly targetLetter: string;
  readonly candidateLetters: readonly [string, string, string];
}

export interface ObstacleSolvedPayload {
  readonly obstacleId: string;
  readonly targetLetter: string;
}

export class ObstacleOverlayScene extends Phaser.Scene {
  private payload: ObstacleOverlayPayload | null = null;
  private layout: ObstacleOverlayLayout | null = null;
  private slot: LetterSlot | null = null;
  private tiles: LetterTile[] = [];
  private inputLocked = false;

  public constructor() {
    super("ObstacleOverlayScene");
  }

  public init(data: ObstacleOverlayPayload): void {
    this.payload = data;
    this.layout = null;
    this.slot = null;
    this.tiles = [];
    this.inputLocked = false;
  }

  public create(): void {
    const payload = this.payload;

    if (payload === null) {
      return;
    }

    const layout = new ObstacleOverlayLayout({
      width: this.scale.width,
      height: this.scale.height
    });

    this.layout = layout;
    layout.drawFrame(this);
    this.drawPrompt(payload, layout);

    this.slot = new LetterSlot(this, layout.slotCenter);
    this.tiles = payload.candidateLetters.map((letter, index) => {
      return new LetterTile(this, letter, layout.tileCenters[index]);
    });

    this.input.on("dragstart", this.handleDragStart, this);
    this.input.on("drag", this.handleDrag, this);
    this.input.on("drop", this.handleDrop, this);
    this.input.on("dragend", this.handleDragEnd, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.removeInputHandlers, this);
  }

  private drawPrompt(payload: ObstacleOverlayPayload, layout: ObstacleOverlayLayout): void {
    this.add
      .text(layout.center.x, layout.panel.y + 38, "\u041c\u043d\u0435 \u043d\u0443\u0436\u043d\u0430 \u0431\u0443\u043a\u0432\u0430.", {
        align: "center",
        color: "#243447",
        fontFamily: "Arial, sans-serif",
        fontSize: "24px",
        fontStyle: "700"
      })
      .setOrigin(0.5)
      .setDepth(31);
    this.add
      .text(layout.center.x, layout.lineY, `\u041d\u0430\u0439\u0434\u0438: ${payload.targetLetter}`, {
        align: "center",
        color: "#566573",
        fontFamily: "Arial, sans-serif",
        fontSize: "18px"
      })
      .setOrigin(0.5)
      .setDepth(31);
    this.add
      .text(layout.feedbackCenter.x, layout.feedbackCenter.y, "\u041f\u0435\u0440\u0435\u0442\u0430\u0449\u0438 \u0431\u0443\u043a\u0432\u0443 \u0432 \u0441\u043b\u043e\u0442.", {
        align: "center",
        color: "#64748b",
        fontFamily: "Arial, sans-serif",
        fontSize: "16px"
      })
      .setOrigin(0.5)
      .setDepth(31);
  }

  private handleDragStart(_pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.GameObject): void {
    if (this.inputLocked) {
      return;
    }

    this.findTile(gameObject)?.lift();
    this.slot?.resetFeedback();
  }

  private handleDrag(
    _pointer: Phaser.Input.Pointer,
    gameObject: Phaser.GameObjects.GameObject,
    dragX: number,
    dragY: number
  ): void {
    if (this.inputLocked) {
      return;
    }

    this.findTile(gameObject)?.dragTo(dragX, dragY);
  }

  private handleDrop(
    _pointer: Phaser.Input.Pointer,
    gameObject: Phaser.GameObjects.GameObject,
    dropZone: Phaser.GameObjects.GameObject
  ): void {
    const payload = this.payload;
    const layout = this.layout;
    const slot = this.slot;
    const tile = this.findTile(gameObject);

    if (this.inputLocked || payload === null || layout === null || slot === null || tile === null) {
      return;
    }

    if (dropZone !== slot.dropZone) {
      tile.returnHome(this);
      return;
    }

    if (tile.letter === payload.targetLetter) {
      this.acceptCorrectTile(tile, slot, layout, payload);
      return;
    }

    slot.showWrongFeedback();
    tile.reject(this);
    this.time.delayedCall(260, () => {
      slot.resetFeedback();
    });
  }

  private handleDragEnd(
    _pointer: Phaser.Input.Pointer,
    gameObject: Phaser.GameObjects.GameObject,
    dropped: boolean
  ): void {
    if (this.inputLocked || dropped) {
      return;
    }

    this.findTile(gameObject)?.returnHome(this);
  }

  private acceptCorrectTile(
    tile: LetterTile,
    slot: LetterSlot,
    layout: ObstacleOverlayLayout,
    payload: ObstacleOverlayPayload
  ): void {
    this.inputLocked = true;
    this.tiles.forEach((candidateTile) => {
      candidateTile.container.disableInteractive();
    });

    slot.accept(tile.letter);
    tile.acceptAt(this, layout.slotCenter);

    this.time.delayedCall(480, () => {
      const solvedPayload: ObstacleSolvedPayload = {
        obstacleId: payload.obstacleId,
        targetLetter: payload.targetLetter
      };

      this.events.emit("obstacleSolved", solvedPayload);
      this.scene.stop();
    });
  }

  private findTile(gameObject: Phaser.GameObjects.GameObject): LetterTile | null {
    return this.tiles.find((tile) => tile.container === gameObject) ?? null;
  }

  private removeInputHandlers(): void {
    this.input.off("dragstart", this.handleDragStart, this);
    this.input.off("drag", this.handleDrag, this);
    this.input.off("drop", this.handleDrop, this);
    this.input.off("dragend", this.handleDragEnd, this);
  }
}
