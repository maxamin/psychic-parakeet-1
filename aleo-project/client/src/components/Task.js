import React from 'react'

// Importing the Components
import Nav from "./Nav";
import AddTask from "./AddTask";
import TasksContainer from "./TasksContainer";

// importing the packages
import socketIO from "socket.io-client"

/*
    Pass Socket.io into the required components where 
    communications are made with the server
*/

const socket = socketIO.connect("http://localhost:4000")

const Task = () => {
    return (
        <div>
            <Nav />
            <AddTask socket={socket} />
            <TasksContainer socket={socket} />
        </div>
    );
};

export default Task