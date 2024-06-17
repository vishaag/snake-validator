import { createServer } from './server.js';

const games = {};
const app = createServer(games);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Snake validator running on port ${PORT}`);
});
