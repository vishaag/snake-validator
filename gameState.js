import { v4 as uuidv4 } from "uuid";

export class GameState {
  constructor(width, height) {
    this.gameId = uuidv4();
    this.width = width;
    this.height = height;
    this.score = 0;
    this.fruit = this.generateFruitPosition();
    this.snake = { x: 0, y: 0, velX: 1, velY: 0 };
  }

  generateFruitPosition() {
    let fruitPosition;
    do {
      fruitPosition = {
        x: Math.floor(Math.random() * this.width),
        y: Math.floor(Math.random() * this.height),
      };
    } while (fruitPosition.x === 0 && fruitPosition.y === 0); // Ensure fruit is not at the initial snake position
    return fruitPosition;
  }

  moveSnake(tick) {
    this.snake.x += tick.velX;
    this.snake.y += tick.velY;
  }

  isValidMove(tick) {
    if (tick.velX === -this.snake.velX && tick.velY === -this.snake.velY) {
      return false;
    }
    const newX = this.snake.x + tick.velX;
    const newY = this.snake.y + tick.velY;
    return newX >= 0 && newX < this.width && newY >= 0 && newY < this.height;
  }

  hasFoundFruit() {
    return this.snake.x === this.fruit.x && this.snake.y === this.fruit.y;
  }
}
