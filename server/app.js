const express = require("express")
const {Server} = require("socket.io")
const {createServer} = require("http")
const cors = require("cors")

const PORT = 3000

const app = express()
const server = createServer(app)

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
})

app.use(cors())

app.get("/", (req, res) => {
    res.send("Hello World")
})

//middleware
// io.use( (socket, next)=> {
//     //authentication
//     next()
// })

io.on("connection", (socket) => {
    console.log("User connected: ", socket.id);

    socket.on("message", (data) => {
        console.log(data);

        socket.to(data.room).emit("receive-message", data.message)
        // io.to(data.room).emit("receive-message", data.message)    ///same
    })

    socket.on("join-room", (roomName) => {
        socket.join(roomName)
        console.log("user joined room:", roomName);
    })

    socket.on("disconnect", () => {
        console.log("user disconnected: ", socket.id);
    })
})

server.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
})