const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const pty = require('node-pty');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const PORT = process.env.PORT || 3000;

// Serve Static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

wss.on('connection', (ws) => {
  const shell = process.env.SHELL || 'bash';
  
  // Create PTY Process
  const ptyProcess = pty.spawn(shell, [], {
    name: 'xterm-color',
    cols: 80,
    rows: 24,
    cwd: process.env.HOME || process.cwd(),
    env: process.env
  });

  // PTY -> WebSocket (Output to Browser)
  ptyProcess.on('data', (data) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(data);
    }
  });

  // WebSocket -> PTY (Input from Browser)
  ws.on('message', (message) => {
    ptyProcess.write(message.toString());
  });

  // Handle Disconnect
  ws.on('close', () => {
    ptyProcess.kill();
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
