import express from "express";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

interface ExtWebSocket extends WebSocket {
  username?: string;
}

app.use(express.static(path.join(__dirname, "public")));

const chatHistory: any[] = [];
const typingUsers = new Set<string>();

const broadcast = (data: object) => {
  const message = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

wss.on("connection", (ws: ExtWebSocket) => {
  console.log("New client connected via WebSocket");

  ws.on("message", (rawMsg) => {
    try {
      const parsed = JSON.parse(rawMsg.toString());

      switch (parsed.type) {
        case "login": {
          ws.username = parsed.username;
          ws.send(JSON.stringify({ type: "history", data: chatHistory }));
          broadcast({
            type: "system",
            content: `${ws.username} has joined the chat.`,
          });

          break;
        }

        case "chat": {
          const newMessage = {
            type: "chat",
            username: ws.username || "Anonymous",
            content: parsed.content,
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };

          chatHistory.push(newMessage);

          // Keep only the last 100 messages to prevent memory bloat
          if (chatHistory.length > 100) {
            chatHistory.shift();
          }

          broadcast(newMessage);
          break;
        }

        case "typing": {
          if (ws.username) {
            if (parsed.isTyping) {
              typingUsers.add(ws.username);
            } else {
              typingUsers.delete(ws.username);
            }

            broadcast({
              type: "typing_update",
              users: Array.from(typingUsers),
            });
          }
          break;
        }
      }
    } catch (err) {
      console.error("Failed to parse incoming message:", err);
    }
  });

  ws.on("close", () => {
    if (ws.username) {
      typingUsers.delete(ws.username);
      broadcast({ type: "typing_update", users: Array.from(typingUsers) });
      broadcast({
        type: "system",
        content: `${ws.username} has left the chat.`,
      });
    }
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Chat server running at http://localhost:${PORT}`);
});
