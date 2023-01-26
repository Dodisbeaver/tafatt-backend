const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http").Server(app);
const PORT = 4000;
// const { Novu } = require("@novu/node");
// const novu = new Novu(<API_KEY>);
const socketIO = require("socket.io")(http, {
	cors: {
		origin: "http://localhost:3000",
	},
});

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const fetchID = () => Math.random().toString(36).substring(2, 10);

let tasks = {
    pending: {
        title: "pending",
        id: fetchID(),
        items: [
            {
                id: fetchID(),
                username: "Ninja Kitten",
                title: "Take out trash",
                comments: [],
                reward: 5
            },
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
        id: fetchID(),
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
        id: fetchID(),
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

socketIO.on("connection", (socket) => {
	console.log(`⚡: ${socket.id} user just connected!`);

	socket.on("createTask", (data) => {
		const newTask = { id: fetchID(), title: data.task, comments: [] };
		tasks["pending"].items.push(newTask);
		socket.emit("tasks", tasks);

		// 👇🏻 sends notification via Novu
		// sendNotification(data.userId);
	});

	socket.on("taskDragged", (data) => {
		const { source, destination } = data;
		const itemMoved = {
			...tasks[source.droppableId].items[source.index].id,
		};
		console.log("ItemMoved>>> ", itemMoved);
		tasks[source.droppableId].items.splice(source.index, 1);
		tasks[destination.droppableId].items.splice(
			destination.index,
			0,
			itemMoved
		);
		console.log("Source >>>", tasks[source.droppableId].items);
		console.log("Destination >>>", tasks[destination.droppableId].items);
		socket.emit("tasks", tasks);
	});

	socket.on("fetchComments", (data) => {
		const taskItems = tasks[data.category].items;
		for (let i = 0; i < taskItems.length; i++) {
			if (taskItems[i].id === data.id) {
				socket.emit("comments", taskItems[i].comments);
			}
		}
	});
	socket.on("addComment", (data) => {
		const taskItems = tasks[data.category].items;
		for (let i = 0; i < taskItems.length; i++) {
			if (taskItems[i].id === data.id) {
				taskItems[i].comments.push({
					name: data.userId,
					text: data.comment,
					id: fetchID(),
				});
				socket.emit("comments", taskItems[i].comments);
			}
		}
	});
	socket.on("disconnect", () => {
		socket.disconnect();
		console.log("🔥: A user disconnected");
	});
});

app.get("/api", (req, res) => {
	res.json(tasks);
});

http.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
});