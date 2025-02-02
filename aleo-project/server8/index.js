const express = require("express");
const app = express();

// importing the http and cors liberary to allow data transfer between client and server domains
const cors = require("cors")
const http = require("http");
const PORT = 4000;

// importing socket.io to create a real time chat connection
const socketIO = require("socket.io")(http, {
    cors: {
        origin: "http://localhost:3000"
    }
});


// returns a JSON object when you visit the website
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Generate a random string
const fetchID = () => Math.random().toString(36).substring(2, 10);
const tasks = {
    pending: {
        title: "pending",
        items: [
            {
                id: fetchID(),
                title: "Send the Figma file to Dima",
                comments: [],
            },
        ],
    },
    ongoing: {
        title: "ongoing",
        items: [
            {
                id: fetchID(),
                title: "Review Github issues",
                comments: [
                    {
                        name: "David",
                        text: "Ensure you review before merging",
                        id: fetchID(),
                    },
                ],
            },
        ],
    },
    completed: {
        title: "completed",
        items: [
            {
                id: fetchID(),
                title: "Completed technical contents",
                comments: [
                    {
                        name: "Dima",
                        text: "Make sure you check the requirements",
                        id: fetchID(),
                    },
                ],
            },
        ],
    },
};


// it establishes a connection with react app then creates a unique ID for each socket and logs the ID to console
socketIO.on("connection", (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);

    // Create a Task
    socket.on("createTask", (data) => {
        // Construct an object according to the data strcuture
        const newTask = { id: fetchID(), title: data.task, comment: [] };
        // add the task to pending category
        tasks["pending"].items.push(newTask);
        // Fire the task
        socket.emit("tasks", tasks);
    });

    socket.on('taskDragged', (data) => {
        const { source, destination } = data;
        const itemMoved = {
            ...tasks[source.droppableId].items[source.index],
        };
        console.log("ItemMoved>>>", itemMoved);
        tasks[source.droppableId].items.splice(source.index, 1);
        tasks[destination.droppedId].items.splice(
            destination.index,
            0,
            itemMoved
        );
        console.log("Source >>>", tasks[source.droppableId].items);
        console.log("Destination >>>", tasks[destination.droppableId].items);
        socket.emit("tasks", tasks);
    });

    // event ot trigger the comments event to return the list of comments matching the item's ID and category
    socket.on("fetchComments", (data) => {
        // const { category, id } = data;
        const taskItems = tasks[data.category].items;
        for (let i = 0; i < taskItems.length; i++) {
            if (taskItems[i].id === data.id) {
                socket.emit("comments", taskItems[i].comments)
            }
        }
    });

    // Event listener on the server to add the comment to the specific task via it's ID
    socket.on("addComment", (data) => {
        const { category, userID, comment, id } = data;
        // get the items in the task's ceteogory
        const taskItems = tasks[category].items;

        // traverse through the list of items to find a mathing ID
        for (let i = 0; i < taskItems.length; i++) {
            if (taskItems[i].id == id) {
                // Then add the comment to the list of comments under the item(task)
                taskItems[i].comments.push({
                    name: userID,
                    text: comment,
                    id: fetchID()
                });

                // send a new event to the react app
                socket.emit("comments", taskItems[i].comments);
            }
        }
    });

    socket.on('disconnect', () => {
        socket.disconnect()
        console.log("🔥:A user disconnected")
    })
})


app.get("/api", (req, res) => {
    res.json(tasks);
});

app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
})


