import Phaser from 'phaser';

export class OtherPlayer {
  public sprite: Phaser.Physics.Arcade.Sprite;
  public userId: string;
  public userName: string;
  private nameText: Phaser.GameObjects.Text;
  private scene: Phaser.Scene;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    userId: string,
    userName: string
  ) {
    this.scene = scene;
    this.userId = userId;
    this.userName = userName;

    // スプライトの作成
    this.sprite = scene.physics.add.sprite(x, y, 'player');
    this.sprite.setScale(1.5);
    this.sprite.setTint(0x888888); // 他のプレイヤーは少し暗く表示

    // 名前表示の作成
    this.nameText = scene.add.text(x, y - 30, userName, {
      fontSize: '12px',
      color: '#cccccc',
      backgroundColor: '#000000',
      padding: { x: 4, y: 2 },
    });
    this.nameText.setOrigin(0.5, 0.5);
  }

  updatePosition(x: number, y: number) {
    // 滑らかな移動のための補間
    this.scene.tweens.add({
      targets: this.sprite,
      x: x,
      y: y,
      duration: 100,
      ease: 'Linear',
      onUpdate: () => {
        this.nameText.x = this.sprite.x;
        this.nameText.y = this.sprite.y - 30;
      },
    });
  }

  destroy() {
    this.sprite.destroy();
    this.nameText.destroy();
  }
}
