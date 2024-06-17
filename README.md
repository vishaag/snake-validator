# Snake Game Validator

This is a simple validator for the Snake game. The validator exposes a web server with two routes to start a new game and validate a series of moves.

## Installation

1. Clone the repository
2. Navigate to the project directory
3. Install the dependencies

```bash
git clone https://github.com/your-repo/snake-validator.git
cd snake-validator
npm install
```

## Usage
### Start the server:

```bash
npm start
```

## Endpoints
1. Start a New Game

```bash
GET /new?w=[width]&h=[height]
```
Starts a new game with the specified width and height.
Example: 
```bash
/new?w=5&h=5
```
2. Validate Moves

```bash
POST /validate
```
Validates a series of moves for the game.

Example POST Request Body:
```bash
{
  "gameId": "your-game-id",
  "ticks": [
    { "velX": 1, "velY": 0 },
    { "velX": 0, "velY": 1 }
  ]
}
```
