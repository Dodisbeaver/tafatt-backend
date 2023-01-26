//👇🏻index.js
const express = require("express");
const app = express();
const PORT = 4000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//New imports
const http = require("http").Server(app);
const cors = require("cors");
app.use(cors());
const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000"
    }
});
//Add this before the app.get() block
socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);
    socket.on('disconnect', () => {
            socket.disconnect()
      console.log('🔥: A user disconnected');
    });
});
//👇🏻 Generates a random string
const fetchID = () => Math.random().toString(36).substring(2, 10);
//👇🏻 Nested object
let tasks = {
    pending: {
        title: "pending",
        items: [
            {
                id: fetchID(),
                username: "Ninja Kitten",
                title: "Take out trash",
                comments: [],
                reward: 5
            },
        ],
    },
    pending: {
        title: "pending",
        items: [
            {
                id: fetchID(),
                username: "Quartermaster",
                title: "Buy groceries",
                comments: [],
                reward: 5
            },
        ],
    },
    ongoing: {
        title: "ongoing",
        items: [
            {
                id: fetchID(),
                username: "Dragon Slayer",
                title: "Do homework",
                comments: [
                    {
                        name: "Quartermaster",
                        text: "Remember to read chapter 2-3",
                        id: fetchID(),
                    },
                ],
                reward: 10
            },
        ],
    },
    completed: {
        title: "completed",
        items: [
            {
                id: fetchID(),
                username: "Ninja Kitten",
                title: "Do homework",
                comments: [
                    {
                        name: "Quartermaster",
                        text: "Good job!",
                        id: fetchID(),
                    },
                ],
                reward: 10
            },
        ],
    },
};
app.get("/", (req, res) => {
    res.json({

        message: "Hello world",

    });
});
app.get("/api", (req, res) => {
    res.json(tasks);
});
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
