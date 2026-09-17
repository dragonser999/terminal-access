const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const pty = require('node-pty');
const path = require('path');
const os = require('os');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

// Fallback for root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Select available shell
const shell = process.env.SHELL || (os.platform() === 'win32' ? 'powershell.exe' : '/bin/bash');

io.on('connection', (socket) => {
    console.log('User connected');

    // Spawn the pty process
    const ptyProcess = pty.spawn(shell, [], {
        name: 'xterm-color',
        cols: 80,
        rows: 24,
        cwd: process.env.HOME || '/root',
        env: process.env
    });

    // Send terminal output to client
    ptyProcess.onData((data) => {
        socket.emit('output', data);
    });

    // Receive client input
    socket.on('input', (data) => {
        ptyProcess.write(data);
    });

    // Handle terminal resize
    socket.on('resize', (size) => {
        if (size && size.cols && size.rows) {
            try {
                ptyProcess.resize(size.cols, size.rows);
            } catch (err) {
                console.error(err);
            }
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
        ptyProcess.kill();
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
