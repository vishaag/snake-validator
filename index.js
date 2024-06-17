import express from "express";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from "uuid";

const app = express();
app.use(bodyParser.json());

class GameState {
  constructor(width, height) {
    this.gameId = uuidv4();
    this.width = width;
    this.height = height;
    this.score = 0;
    this.fruit = this.generateFruitPosition();
    this.snake = { x: 0, y: 0, velX: 1, velY: 0 };
  }

  generateFruitPosition() {
    return {
      x: Math.floor(Math.random() * this.width),
      y: Math.floor(Math.random() * this.height),
    };
  }

  moveSnake(tick) {
    this.snake.x += tick.velX;
    this.snake.y += tick.velY;
  }

  isValidMove(tick) {
    // Prevent 180-degree turns
    if (tick.velX === -this.snake.velX && tick.velY === -this.snake.velY) {
      return false;
    }

    // Calculate the new position after the move
    const newX = this.snake.x + tick.velX;
    const newY = this.snake.y + tick.velY;

    // Check if the new position is within the boundaries of the board
    return newX >= 0 && newX < this.width && newY >= 0 && newY < this.height;
  }

  hasFoundFruit() {
    return this.snake.x === this.fruit.x && this.snake.y === this.fruit.y;
  }
}

const games = {};

app.get("/new", (req, res) => {
  try {
    const width = parseInt(req.query.w);
    const height = parseInt(req.query.h);

    if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
      return res.status(400).json({ error: "Invalid request" });
    }

    const newGame = new GameState(width, height);
    games[newGame.gameId] = newGame;

    res.status(200).json(newGame);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/validate", (req, res) => {
  const { gameId, ticks } = req.body;
  const game = games[gameId];

  if (!game) {
    return res.status(400).json({ error: "Invalid request" });
  }

  for (const tick of ticks) {
    if (!game.isValidMove(tick)) {
      return res.status(418).json({ error: "Game is over, invalid move" });
    }
    game.moveSnake(tick);
  }

  if (game.hasFoundFruit()) {
    game.score += 1;
    game.fruit = game.generateFruitPosition();
    return res.status(200).json(game);
  } else {
    return res
      .status(404)
      .json({ error: "Fruit not found, invalid move sequence" });
  }
});

app.use((req, res, next) => {
  res.status(405).json({ error: "Invalid method" });
});

app.listen(3000, () => {
  console.log("Snake validator running on port 3000");
});
