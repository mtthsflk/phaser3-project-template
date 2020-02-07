import "phaser";
import config from "./config/config";

import player1File from "./assets/player/Sprite-1.png";
import player2File from "./assets/player/Sprite-2.png";
import player4File from "./assets/player/Sprite-4.png";
import player5File from "./assets/player/Sprite-5.png";
import player6File from "./assets/player/Sprite-6.png";
import wallFile from "./assets/wall.png";
import coinFile from "./assets/coin.png";
import enemyFile from "./assets/enemy.png";

const game = new Phaser.Game(config);

class levelScene extends Phaser.Scene {
  constructor() {
    super({ key: "levelScene" });
  }

  preload() {
    console.log("loading files...");
    this.load.image("player1", player1File);
    this.load.image("player2", player2File);
    this.load.image("player3", player1File);
    this.load.image("player4", player4File);
    this.load.image("player5", player5File);
    this.load.image("player6", player6File);
    this.load.image("wall", wallFile);
    this.load.image("coin", coinFile);
    this.load.image("enemy", enemyFile);
  }

  create() {
    // Set the background color to blue
    this.cameras.main.setBackgroundColor("#3598db");

    // Create the player in the middle of the game
    /*
    this.player = this.add.graphics();
    this.player.clear();
    this.player.fillStyle(0xffffff, 1);
    this.player.fillRect(0, 0, 16, 16);
    this.physics.add.existing(this.player);
    this.player.body.gravity.y = 600;
    this.player.body.setSize(16, 16);
    this.player.x = 100;
    this.player.y = 70;
    */
   this.player = this.physics.add.sprite(100, 70, "player1");
   this.player.setOrigin(0.5, 0);
   this.anims.create({key: 'walking',
    frames:[
        {key: 'player1'},
        {key: 'player2'},
        {key: 'player3'},
        {key: 'player4'} ],
    frameRate: 8, repeat: -1 });
   this.anims.create({key: 'stopWalking',
    frames:[
        {key: 'player2'},
        {key: 'player3'} ],
    frameRate: 15, repeat: 0 });
    this.anims.create({key: 'idle',
    frames:[
        {key: 'player1'} ],
    frameRate: 0, repeat: 0 });
    this.anims.create({key: 'jump',
    frames:[
        {key: 'player5'} ],
    frameRate: 0, repeat: 0 });
    this.anims.create({key: 'fall',
    frames:[
        {key: 'player6'} ],
    frameRate: 0, repeat: 0 });
    this.player.body.gravity.y = 600;
    this.player.jumpCounter=0;

    // Variable to store the arrow key pressed
    this.cursor = this.input.keyboard.createCursorKeys();

    // Create 3 groups that will contain our objects
    this.walls = this.add.group();
    this.coins = this.add.group();
    this.enemies = this.add.group();

    // Design the level. x = wall, o = coin, ! = lava.
    var level = [
      "xxxxxxxxxxxxxxxxxxxxxx",
      "!         !          x",
      "!                 o  x",
      "!         o          x",
      "!                    x",
      "!     o   !    x     x",
      "xxxxxxxxxxxxxxxx!!!!!x"
    ];

    // Create the level by going through the array
    for (var i = 0; i < level.length; i++) {
      for (var j = 0; j < level[i].length; j++) {
        // Create a wall and add it to the 'walls' group
        if (level[i][j] === "x") {
          var wall = this.physics.add.sprite(30 + 20 * j, 30 + 20 * i, "wall");
          this.walls.add(wall);
          wall.body.immovable = true;
        }

        // Create a coin and add it to the 'coins' group
        else if (level[i][j] === "o") {
          var coin = this.physics.add.sprite(30 + 20 * j, 30 + 20 * i, "coin");
          this.coins.add(coin);
        }

        // Create a enemy and add it to the 'enemies' group
        else if (level[i][j] === "!") {
          var enemy = this.physics.add.sprite(
            30 + 20 * j,
            30 + 20 * i,
            "enemy"
          );
          this.enemies.add(enemy);
        }
      }
    }

    // Make the player and the walls collide
    this.physics.add.collider(this.player, this.walls);

    // Call the 'takeCoin' function when the player takes a coin
    this.physics.add.overlap(
      this.player,
      this.coins,
      this.takeCoin,
      null,
      this
    );

    // Call the 'restart' function when the player touches the enemy
    this.physics.add.overlap(
      this.player,
      this.enemies,
      this.getKilled,
      null,
      this
    );

    this.playerIsDead = false;
  }

  update() {
    if (this.playerIsDead) return;
    // Move the player when an arrow key is pressed
    if (this.cursor.left.isDown) {
        this.player.body.velocity.x = -100;
        if (!this.player.isWalking && !this.player.isFalling && !this.player.isJumping) {
            this.player.isWalking=true;
            this.anims.play("walking", this.player);
        }
        if (!this.player.isFalling && !this.player.isJumping) {
            this.player.setScale(-1,1);
            this.player.body.setOffset(18, 0);
        }
    } 
    else if (this.cursor.right.isDown) {
        this.player.body.velocity.x = 100;
        if (!this.player.isWalking && !this.player.isFalling && !this.player.isJumping) {
            this.player.isWalking=true;
            this.anims.play("walking", this.player);
        }
        if (!this.player.isFalling && !this.player.isJumping) {
            this.player.setScale(1,1);
            this.player.body.setOffset(0, 0);
        }

    }
    else {
        this.player.body.velocity.x = 0;
        if(this.player.isWalking && !this.player.isFalling && !this.player.isJumping) {
            this.player.isWalking = false;
            this.anims.play("stopWalking", this.player);
        }
    }

    // Make the player jump if he is touching the ground
    if (this.cursor.up.isDown && this.player.body.touching.down) {
        if(!this.player.isJumping) {
            this.player.isJumping = true;
            this.player.isFalling = false;
            this.player.body.velocity.y = -250;
            this.anims.play("jump", this.player);
        }
    }
    if (this.player.body.velocity.y > 0) {
        if(!this.player.isFalling) {
            this.player.isFalling = true;
            this.anims.play("fall", this.player);
        } 
    }
    if (this.player.body.touching.down && this.player.isFalling) {
        this.player.isFalling = false;
        this.player.isWalking = false;
        this.player.isJumping = false;
        this.player.jumpCounter = 0;
        this.anims.play("idle", this.player);
    }
    if (this.player.isJumping) this.player.jumpCounter+=1;
  }

  // Function to kill a coin
  takeCoin(player, coin) {
    coin.destroy();
  }

  // Function to restart the game
  getKilled() {
    this.player.destroy();
    this.playerIsDead = true;
    this.scene.restart();
  }
}

game.scene.add("levelScene", levelScene);
game.scene.start("levelScene");