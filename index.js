const express = require("express");
const mongoose = require('mongoose');
const app = express();
const cors = require("cors");
const http = require("http").Server(app);
require('dotenv').config();
const PORT = process.env.PORT || 4001;
console.log(process.env.DOTENV_WORKS);

mongoose.connect(process.env.DB_URL);
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.on('open', () => console.log('Connected to DB'));
// const { Novu } = require("@novu/node");
// const novu = new Novu(<API_KEY>);
const socketIO = require("socket.io")(http, {
	cors: {
		origin: "http://localhost:3000",
	},
});

app.use(cors());

const taskRouter = require('./routes/tasks');
const boardRouter = require('./routes/boards');
const fetchID = () => Math.random().toString(36).substring(2, 10);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/tasks', taskRouter)
app.use('/boards', boardRouter)
let tasks = [
    [{
        
        id: fetchID(),
        title: "pending",
        username: "Ninja Kitten",
        task: "Take out trash",
        comments: [],
        reward: 5
    },
    {   
        
        id: fetchID(),
        title: "pending",
        username: "Quartermaster",
        task: "Buy groceries",
        comments: [],
        reward: 5
    },
    ],
    
    [
    {
       
        id: fetchID(),  
        title: "ongoing", 
        username: "Dragon Slayer",
        task: "Do homework",
        comments: [
            {
                name: "Quartermaster",
                text: "Remember to read chapter 2-3",
                id: fetchID(),
            },
                ],
        reward: 10
            
        
    },],
    [{
        
        id: fetchID(),
        title: "completed",
        username: "Ninja Kitten",
        task: "Do homework",
        comments: [
            {
            name: "Quartermaster",
            text: "Good job!",
            id: fetchID(),
            },
                ],
        reward: 10
        
    },]
];

app.get("/", (req, res) => {
    res.json({

        message: "Hello world",

    });
});

socketIO.on("connection", (socket) => {
	console.log(`⚡: ${socket.id} user just connected!`);

	socket.on("createTask", (data) => {
        console.log(data)
		const newTask = { id: fetchID(), username: "New Task", title: "pending", comments: [], task: data.task };
		tasks[0].push(newTask);
		socket.emit("tasks", tasks);

		// 👇🏻 sends notification via Novu
		// sendNotification(data.userId);
	});

	socket.on("taskDragged", (data) => {
        console.log(data)
		const { source, destination } = data;
        console.log(source.index)
		const itemMoved = {
			...tasks[source.index].id,
		};
		console.log("ItemMoved>>> ", itemMoved);
		tasks[source.droppableId].splice(source.index, 1);
		tasks[destination.droppableId].splice(
			destination.index,
			0,
			itemMoved
		);
		console.log("Source >>>", tasks[source.droppableId]);
		console.log("Destination >>>", tasks[destination.droppableId]);
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
    // console.log(tasks)
});

http.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
});