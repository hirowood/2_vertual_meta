import Phaser from 'phaser';

export class Player {
  public sprite: Phaser.Physics.Arcade.Sprite;
  public userId: string;
  public userName: string;
  private nameText: Phaser.GameObjects.Text;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    userId: string,
    userName: string
  ) {
    this.userId = userId;
    this.userName = userName;

    // スプライトの作成
    this.sprite = scene.physics.add.sprite(x, y, 'player');
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setScale(1.5);

    // 名前表示の作成
    this.nameText = scene.add.text(x, y - 30, userName, {
      fontSize: '12px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 4, y: 2 },
    });
    this.nameText.setOrigin(0.5, 0.5);
  }

  move(vx: number, vy: number) {
    this.sprite.setVelocity(vx, vy);

    // 名前テキストの位置を更新
    this.nameText.x = this.sprite.x;
    this.nameText.y = this.sprite.y - 30;

    // 移動方向に応じてスプライトの向きを変更
    if (vx < 0) {
      this.sprite.setFlipX(true);
    } else if (vx > 0) {
      this.sprite.setFlipX(false);
    }
  }

  destroy() {
    this.sprite.destroy();
    this.nameText.destroy();
  }
}
