# Snake Game Validator

This is a simple validator for the Snake game. The validator exposes a web server with two routes to start a new game and validate a series of moves.

## Installation

1. Clone the repository
2. Navigate to the project directory
3. Install the dependencies

```bash
git clone https://github.com/vishaag/snake-validator.git
cd snake-validator
npm install
```

## Usage
### Start the server:

```bash
npm start
```

### Run tests 
```bash
npm test
```


## Endpoints
1. Start a New Game

Example:
```bash
GET /new?w=5&h=5
```
Example Response:
```json
{
  "gameId": "7ab70b4c-cb89-4493-ac2e-f942165efde9",
  "width": 5,
  "height": 5,
  "score": 0,
  "fruit": {
    "x": 3,
    "y": 0
  },
  "snake": {
    "x": 0,
    "y": 0,
    "velX": 1,
    "velY": 0
  }
}
```

2. Validate Moves

```bash
POST /validate
```
Validates a series of moves for the game.

Example POST Request Body:
```json
{
  "gameId": "7ab70b4c-cb89-4493-ac2e-f942165efde9",
  "ticks": [
  { "velX": 1, "velY": 0 },  
  { "velX": 1, "velY": 0 },
  { "velX": 1, "velY": 0 }
]
}

```
Example Response (case - valid series of moves where snake eats the fruit and score increments by 1):
```json
{
  "gameId": "7ab70b4c-cb89-4493-ac2e-f942165efde9",
  "width": 5,
  "height": 5,
  "score": 1,
  "fruit": {
    "x": 3,
    "y": 0
  },
  "snake": {
    "x": 3,
    "y": 0,
    "velX": 1,
    "velY": 0
  }
}
```
