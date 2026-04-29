import Phaser from "phaser";

interface CompleteSceneData {
  readonly solvedObstacleCount: number;
  readonly totalObstacleCount: number;
}

export class CompleteScene extends Phaser.Scene {
  public constructor() {
    super("CompleteScene");
  }

  public create(data?: CompleteSceneData): void {
    const { width, height } = this.scale;
    const solvedObstacleCount = data?.solvedObstacleCount ?? 0;
    const totalObstacleCount = data?.totalObstacleCount ?? solvedObstacleCount;

    this.add.rectangle(width / 2, height / 2, width, height, 0xf8f2df);
    this.drawSoftHills(width, height);

    const title = this.add
      .text(width / 2, 148, "\u0413\u043e\u0442\u043e\u0432\u043e!", {
        color: "#243447",
        fontFamily: "Arial, sans-serif",
        fontSize: "52px",
        fontStyle: "700"
      })
      .setOrigin(0.5);
    const message = this.add
      .text(width / 2, 214, "\u0412\u0441\u0435 \u043f\u0440\u0435\u0433\u0440\u0430\u0434\u044b \u043f\u0440\u043e\u0439\u0434\u0435\u043d\u044b.", {
        align: "center",
        color: "#566573",
        fontFamily: "Arial, sans-serif",
        fontSize: "24px"
      })
      .setOrigin(0.5);
    const progress = this.add
      .text(width / 2, 264, `${solvedObstacleCount} / ${totalObstacleCount}`, {
        align: "center",
        color: "#243447",
        fontFamily: "Arial, sans-serif",
        fontSize: "30px",
        fontStyle: "700"
      })
      .setOrigin(0.5);

    this.createReplayButton(width / 2, 354);

    this.tweens.add({
      targets: [title, message, progress],
      y: "-=8",
      alpha: { from: 0, to: 1 },
      duration: 320,
      ease: "Sine.easeOut"
    });
  }

  private createReplayButton(x: number, y: number): void {
    const button = this.add.container(x, y);
    const background = this.add
      .rectangle(0, 0, 260, 70, 0x6aa56f, 1)
      .setStrokeStyle(4, 0xffffff, 0.86);
    const label = this.add
      .text(0, 0, "\u0421\u044b\u0433\u0440\u0430\u0442\u044c \u0441\u043d\u043e\u0432\u0430", {
        color: "#ffffff",
        fontFamily: "Arial, sans-serif",
        fontSize: "26px",
        fontStyle: "700"
      })
      .setOrigin(0.5);

    button.add([background, label]);
    button.setSize(260, 70);
    button.setInteractive({ useHandCursor: true });
    button.on("pointerover", () => {
      background.setFillStyle(0x5b9561);
      this.tweens.add({
        targets: button,
        scaleX: 1.03,
        scaleY: 1.03,
        duration: 120,
        ease: "Sine.easeOut"
      });
    });
    button.on("pointerout", () => {
      background.setFillStyle(0x6aa56f);
      this.tweens.add({
        targets: button,
        scaleX: 1,
        scaleY: 1,
        duration: 120,
        ease: "Sine.easeOut"
      });
    });
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
