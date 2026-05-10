import express from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.static(path.join(__dirname, "public")));

wss.on("connection", (ws, req) => {
  // 'req' allows you to check headers or cookies if needed
  console.log(`Client connected from: ${req.socket.remoteAddress}`);

  ws.on("message", (msg) => {
    // msg is a Buffer by default in 'ws'
    const messageString = msg.toString();
    console.log("Received:", messageString);

    ws.send(`Server received your message: ${messageString}`);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
