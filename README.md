# WebSocket Lab: Real-Time Communication

A hands-on exploration of bi-directional communication using **WebSockets**. This project follows the evolution of a real-time app: from a simple "Echo" server to a fully synchronized **Global Chat** with state management and presence indicators.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20+ recommended)
- [npm](https://www.npmjs.com/)

### Installation

```bash
# Install dependencies
npm install

```

### Running the Project

```bash
# Launch the server with hot-reload
npm run dev

```

Navigate to `http://localhost:3000` in multiple browser tabs to test the synchronization.

---

## 📚 The WebSocket Roadmap

The project evolves through several key milestones to solve the challenges of real-time state.

| Milestone              | Strategy              | Key Concept                                     | Use Case Hint                                       |
| ---------------------- | --------------------- | ----------------------------------------------- | --------------------------------------------------- |
| **01-The Echo**        | `ws.send()`           | Basic request-reply pattern.                    | Simple health checks or command-line tools.         |
| **02-The Broadcast**   | `wss.clients.forEach` | Sending data to all connected users.            | Global notifications or live sports tickers.        |
| **03-Stateful Chat**   | `JSON.parse()`        | Handling complex objects (Logins vs. Messages). | Full-featured messaging apps (Slack/Discord).       |
| **04-Synchronization** | `chatHistory`         | Server-side memory buffer for late-joiners.     | Ensuring users don't see a blank screen on refresh. |

---

## 🛠️ Key Technical Features

### 1. State Persistence (The "History" Fix)

In a standard WebSocket setup, data is "fire and forget." We implemented a **Memory Buffer** on the server to store the last 100 messages. When a new user logs in, the server immediately pushes this history to them, ensuring they aren't entering an empty room.

### 2. Presence & Typing Indicators

- **Join/Leave Events**: Leveraging the `connection` and `close` listeners to broadcast system alerts.
- **Typing Throttling**: Using a `setTimeout` strategy on the frontend to detect when a user stops typing, preventing the server from being flooded with a message for every single keystroke.

### 3. "Me vs. Them" UI Logic

The client uses local state to distinguish its own messages from the broadcast.

- **Your messages**: Aligned right with unique accent styling.
- **Others' messages**: Aligned left with standard border styling.

---

## 💡 Learning Objectives

While testing this chat, observe the following in your **Network Tab** (`F12` > `WS`):

- **The Upgrade Header**: Notice the `HTTP 101 Switching Protocols` response. This is the moment the server agrees to stop talking "Standard Web" (HTTP) and start talking "Live Stream" (WS).
- **JSON Framing**: Unlike REST APIs, WebSockets don't have built-in "routes." We learned to use a `type` field in our JSON objects (e.g., `{ "type": "chat" }`) to act as a custom router.
- **Auto-Focus & UX**: Real-time apps feel "broken" if you have to click the text box every time. We implemented manual `.focus()` calls to keep the user flow seamless after joining and sending messages.

---

### Pro-Tip: Testing Scalability

To see the broadcast in action, open **three or more tabs**. Type in one and watch the **Typing Indicator** update across all other windows simultaneously.
