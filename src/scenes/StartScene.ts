import Phaser from "phaser";

export class StartScene extends Phaser.Scene {
  public constructor() {
    super("StartScene");
  }

  public create(): void {
    const { width, height } = this.scale;
    const centerX = width / 2;

    this.add.rectangle(centerX, height / 2, width, height, 0xf8f2df);
    this.drawSoftHills(width, height);

    this.add
      .text(centerX, 142, "Misha Reading", {
        color: "#243447",
        fontFamily: "Arial, sans-serif",
        fontSize: "52px",
        fontStyle: "700"
      })
      .setOrigin(0.5);

    this.add
      .text(centerX, 202, "Прототип мягкой игры для первых слов", {
        color: "#566573",
        fontFamily: "Arial, sans-serif",
        fontSize: "24px"
      })
      .setOrigin(0.5);

    this.createStartButton(centerX, 306);

    this.add
      .text(centerX, 408, "Для родителя: пока это безопасный web-first shell без внешних ассетов.", {
        align: "center",
        color: "#64748b",
        fontFamily: "Arial, sans-serif",
        fontSize: "18px",
        wordWrap: { width: 680 }
      })
      .setOrigin(0.5);
  }

  private createStartButton(x: number, y: number): void {
    const button = this.add.container(x, y);
    const background = this.add
      .rectangle(0, 0, 220, 72, 0x6aa56f, 1)
      .setStrokeStyle(4, 0xffffff, 0.86);
    const label = this.add
      .text(0, 0, "Начать", {
        color: "#ffffff",
        fontFamily: "Arial, sans-serif",
        fontSize: "30px",
        fontStyle: "700"
      })
      .setOrigin(0.5);

    button.add([background, label]);
    button.setSize(220, 72);
    button.setInteractive({ useHandCursor: true });
    button.on("pointerover", () => background.setFillStyle(0x5b9561));
    button.on("pointerout", () => background.setFillStyle(0x6aa56f));
    button.on("pointerdown", () => {
      this.scene.start("RunScene");
    });
  }

  private drawSoftHills(width: number, height: number): void {
    const graphics = this.add.graphics();
    graphics.fillStyle(0xddebcf, 1);
    graphics.fillEllipse(width * 0.22, height + 18, 620, 190);
    graphics.fillStyle(0xcbe2c7, 1);
    graphics.fillEllipse(width * 0.78, height + 4, 700, 220);
  }
}
