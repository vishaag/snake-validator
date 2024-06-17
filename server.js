import express from 'express';
import bodyParser from 'body-parser';
import { GameState } from './gameState.js';

export function createServer(games) {
  const app = express();
  app.use(bodyParser.json());

  app.get('/new', (req, res) => {
    try {
      const width = parseInt(req.query.w);
      const height = parseInt(req.query.h);

      if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
        return res.status(400).json({ error: 'Invalid request' });
      }

      const newGame = new GameState(width, height);
      games[newGame.gameId] = newGame;

      res.status(200).json(newGame);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/validate', (req, res) => {
    const { gameId, ticks } = req.body;
    const game = games[gameId];

    if (!game) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    try {
      for (const tick of ticks) {
        if (!game.isValidMove(tick)) {
          return res.status(418).json({ error: 'Game is over, invalid move' });
        }
        game.moveSnake(tick);
      }

      if (game.hasFoundFruit()) {
        game.score += 1;
        game.fruit = game.generateFruitPosition();
        return res.status(200).json(game);
      } else {
        return res.status(404).json({ error: 'Fruit not found, invalid move sequence' });
      }
    } catch (error) {
      res.status(400).json({ error: 'Invalid request' });
    }
  });

  app.use((req, res, next) => {
    res.status(405).json({ error: 'Invalid method' });
  });

  return app;
}
