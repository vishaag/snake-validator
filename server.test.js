import request from 'supertest';
import { createServer } from './server.js';
import { GameState } from './gameState.js';

describe('Snake Game Validator API', () => {
  let app;
  let games;

  beforeEach(() => {
    games = {};
    app = createServer(games);
  });

  test('should start a new game and ensure fruit is not at (0, 0)', async () => {
    const res = await request(app).get('/new?w=5&h=5');
    expect(res.status).toBe(200);
    expect(res.body.width).toBe(5);
    expect(res.body.height).toBe(5);
    expect(res.body.snake.x).toBe(0);
    expect(res.body.snake.y).toBe(0);
    expect(res.body.fruit.x).not.toBe(0);
    expect(res.body.fruit.y).not.toBe(0);
  });

  test('should validate a valid move sequence where snake eats the fruit', async () => {
    const game = new GameState(5, 5);
    game.fruit = { x: 2, y: 3 }; // Set fruit position
    games[game.gameId] = game;

    const res = await request(app)
      .post('/validate')
      .send({
        gameId: game.gameId,
        ticks: [
          { velX: 1, velY: 0 },  // Move right to (1, 0)
          { velX: 1, velY: 0 },  // Move right to (2, 0)
          { velX: 0, velY: 1 },  // Move down to (2, 1)
          { velX: 0, velY: 1 },  // Move down to (2, 2)
          { velX: 0, velY: 1 }   // Move down to (2, 3)
        ],
      });

    expect(res.status).toBe(200);
    expect(res.body.score).toBe(1);
    expect(res.body.snake.x).toBe(2);
    expect(res.body.snake.y).toBe(3);
  });

  test('should return 400 for invalid game ID', async () => {
    const res = await request(app)
      .post('/validate')
      .send({
        gameId: 'invalid-game-id',
        ticks: [{ velX: 1, velY: 0 }],
      });

    expect(res.status).toBe(400);
  });

  test('should return 418 for invalid move (180-degree turn)', async () => {
    const game = new GameState(5, 5);
    games[game.gameId] = game;

    const res = await request(app)
      .post('/validate')
      .send({
        gameId: game.gameId,
        ticks: [
          { velX: -1, velY: 0 }, // Invalid move (180-degree turn)
        ],
      });

    expect(res.status).toBe(418);
  });

  test('should handle snake moving out of bounds', async () => {
    const game = new GameState(5, 5);
    games[game.gameId] = game;

    const res = await request(app)
      .post('/validate')
      .send({
        gameId: game.gameId,
        ticks: [
          { velX: 1, velY: 0 },  // Move right to (1, 0)
          { velX: 1, velY: 0 },  // Move right to (2, 0)
          { velX: 1, velY: 0 },  // Move right to (3, 0)
          { velX: 1, velY: 0 },  // Move right to (4, 0)
          { velX: 1, velY: 0 }   // Move right to (5, 0) (out of bounds)
        ],
      });

    expect(res.status).toBe(418);
  });

  test('should validate an empty move sequence', async () => {
    const game = new GameState(5, 5);
    games[game.gameId] = game;

    const res = await request(app)
      .post('/validate')
      .send({
        gameId: game.gameId,
        ticks: [],
      });

    expect(res.status).toBe(404);
  });
});
