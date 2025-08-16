const express = require('express');
const path = require('path');
const WebSocket = require('ws');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const wss = new WebSocket.Server({ server });

let currentData = { name1: '', score1: 0, name2: '', score2: 0 };

wss.on('connection', ws => {
  // Отправляем текущее состояние новым клиентам
  ws.send(JSON.stringify(currentData));

  ws.on('message', message => {
    try {
      const data = JSON.parse(message);
      currentData = data;
      // Рассылаем всем клиентам
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(currentData));
        }
      });
    } catch (e) {
      console.error('Invalid message:', e);
    }
  });
});
