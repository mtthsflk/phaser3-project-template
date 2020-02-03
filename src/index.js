import "phaser";
import config from "./config/config";

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
    this.load.image("wall", wallFile);
    this.load.image("coin", coinFile);
    this.load.image("enemy", enemyFile);
  }

  create() {
    // Set the background color to blue
    this.cameras.main.setBackgroundColor("#3598db");

    // Create the player in the middle of the game
    this.player = this.add.graphics();
    this.player.clear();
    this.player.fillStyle(0xffffff, 1);
    this.player.fillRect(0, 0, 16, 16);
    this.physics.add.existing(this.player);
    this.player.body.gravity.y = 600;
    this.player.body.setSize(16, 16);
    this.player.x = 100;
    this.player.y = 70;

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
    if (this.cursor.left.isDown) this.player.body.velocity.x = -200;
    else if (this.cursor.right.isDown) this.player.body.velocity.x = 200;
    else this.player.body.velocity.x = 0;

    // Make the player jump if he is touching the ground
    if (this.cursor.up.isDown && this.player.body.touching.down)
      this.player.body.velocity.y = -250;
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