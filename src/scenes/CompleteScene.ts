import Phaser from "phaser";

export class CompleteScene extends Phaser.Scene {
  public constructor() {
    super("CompleteScene");
  }

  public create(): void {
    const { width, height } = this.scale;

    this.add.rectangle(width / 2, height / 2, width, height, 0xf8f2df);
    this.add
      .text(width / 2, height / 2, "Готово!", {
        color: "#243447",
        fontFamily: "Arial, sans-serif",
        fontSize: "48px",
        fontStyle: "700"
      })
      .setOrigin(0.5);
  }
}
