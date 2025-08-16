const express = require('express');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

const server = app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

const wss = new WebSocket.Server({ server });

let scoreData = {
  name1: 'Player 1',
  score1: 0,
  name2: 'Player 2',
  score2: 0
};

wss.on('connection', ws => {
  ws.send(JSON.stringify(scoreData));

  ws.on('message', message => {
    try {
      const data = JSON.parse(message);
      scoreData = { ...scoreData, ...data };
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(scoreData));
        }
      });
    } catch (e) {
      console.error('Invalid message', e);
    }
  });
});