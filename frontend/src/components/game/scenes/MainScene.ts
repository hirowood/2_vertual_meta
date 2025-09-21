import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { OtherPlayer } from '../entities/OtherPlayer';
import socket from '@/lib/socket';

export class MainScene extends Phaser.Scene {
  private player?: Player;
  private otherPlayers: Map<string, OtherPlayer> = new Map();
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super({ key: 'MainScene' });
  }

  preload() {
    // アセットの読み込み
    this.load.image('tiles', '/assets/tileset.png');
    this.load.image('player', '/assets/player.png');
    this.load.tilemapTiledJSON('map', '/assets/map.json');
  }

  create() {
    // マップの作成
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('tileset', 'tiles');
    
    // レイヤーの作成
    const groundLayer = map.createLayer('ground', tileset!, 0, 0);
    const wallsLayer = map.createLayer('walls', tileset!, 0, 0);
    
    // 衝突判定の設定
    wallsLayer?.setCollisionByProperty({ collides: true });

    // プレイヤーの作成
    const userId = this.game.registry.get('userId');
    const userName = this.game.registry.get('userName');
    
    this.player = new Player(this, 400, 300, userId, userName);
    
    // 衝突判定の設定
    if (wallsLayer && this.player) {
      this.physics.add.collider(this.player.sprite, wallsLayer);
    }

    // カメラの設定
    this.cameras.main.startFollow(this.player.sprite);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // キーボード入力の設定
    this.cursors = this.input.keyboard?.createCursorKeys();

    // Socket.io イベントの設定
    this.setupSocketEvents();

    // 初期位置を送信
    this.emitPlayerPosition();
  }

  update() {
    if (!this.player || !this.cursors) return;

    // プレイヤーの移動処理
    const speed = 160;
    let vx = 0;
    let vy = 0;

    if (this.cursors.left.isDown) {
      vx = -speed;
    } else if (this.cursors.right.isDown) {
      vx = speed;
    }

    if (this.cursors.up.isDown) {
      vy = -speed;
    } else if (this.cursors.down.isDown) {
      vy = speed;
    }

    this.player.move(vx, vy);

    // 位置情報の送信（移動時のみ）
    if (vx !== 0 || vy !== 0) {
      this.emitPlayerPosition();
    }
  }

  private setupSocketEvents() {
    // 他のプレイヤーの位置更新
    socket.on('player:moved', (data: { 
      userId: string; 
      x: number; 
      y: number; 
      userName: string 
    }) => {
      if (data.userId === this.player?.userId) return;

      if (!this.otherPlayers.has(data.userId)) {
        const otherPlayer = new OtherPlayer(
          this, 
          data.x, 
          data.y, 
          data.userId, 
          data.userName
        );
        this.otherPlayers.set(data.userId, otherPlayer);
      } else {
        const otherPlayer = this.otherPlayers.get(data.userId);
        otherPlayer?.updatePosition(data.x, data.y);
      }
    });

    // プレイヤーの切断
    socket.on('player:disconnected', (userId: string) => {
      const otherPlayer = this.otherPlayers.get(userId);
      if (otherPlayer) {
        otherPlayer.destroy();
        this.otherPlayers.delete(userId);
      }
    });

    // 既存のプレイヤーリスト取得
    socket.on('players:list', (players: Array<{
      userId: string;
      x: number;
      y: number;
      userName: string;
    }>) => {
      players.forEach(playerData => {
        if (playerData.userId !== this.player?.userId) {
          const otherPlayer = new OtherPlayer(
            this,
            playerData.x,
            playerData.y,
            playerData.userId,
            playerData.userName
          );
          this.otherPlayers.set(playerData.userId, otherPlayer);
        }
      });
    });
  }

  private emitPlayerPosition() {
    if (!this.player) return;

    socket.emit('player:move', {
      userId: this.player.userId,
      x: this.player.sprite.x,
      y: this.player.sprite.y,
      userName: this.player.userName,
    });
  }

  destroy() {
    // Socket.ioイベントのクリーンアップ
    socket.off('player:moved');
    socket.off('player:disconnected');
    socket.off('players:list');
  }
}
