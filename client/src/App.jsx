import { useEffect, useMemo, useState } from "react"
import {io} from "socket.io-client"
import {Box, Button, Container, Stack, TextField, Typography} from "@mui/material"

const App = () => {
  const socket = useMemo(() => io("http://localhost:3000/"), [])

  const [message, setMessage] = useState("")
  const [room, setRoom] = useState("")
  const [socketId, setSocketId] = useState("")
  const [messages, setMessages] = useState([])
  const [roomName, setRoomName] = useState("")
  
  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected: ", socket.id);
      setSocketId(socket.id)
    })

    socket.on("welcome", (message) => {
      console.log(message);
    })

    socket.on("receive-message", (message) => {
      console.log(message);
      setMessages((messages) => [...messages, message])
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    socket.emit("message", {message, room})
    setMessage("")
  }

  const handleJoinRoom = (e) => {
    e.preventDefault()
    socket.emit("join-room", roomName)
    setRoomName("")
  }


  return (
    <Container maxWidth="sm">
      <Box sx={{height: 300}} />
      <Typography variant="h6" component={"div"} gutterBottom >
        {socketId}
      </Typography>

      <form onSubmit={handleJoinRoom}>
        <h5>Join room</h5>

        <TextField 
          value={roomName} 
          onChange={(e) => setRoomName(e.target.value)}  
          id="outlined-basic" 
          label="Room Name" 
          variant="outlined"
        />

        <Button type="submit" variant="contained" color="primary" >Join</Button>
      </form>

      
      <form onSubmit={handleSubmit}>
        <TextField 
          value={message} 
          onChange={(e) => setMessage(e.target.value)}  
          id="outlined-basic" 
          label="Type Message" 
          variant="outlined"
        />

        <TextField 
          value={room} 
          onChange={(e) => setRoom(e.target.value)}  
          id="outlined-basic" 
          label="Room id" 
          variant="outlined"
        />

        <Button type="submit" variant="contained" color="primary" >Send</Button>
      </form>

      <Stack>
        {
          messages.map((message, i) => (
            <Typography key={i} variant="h6" component={"div"} gutterBottom >
              {message}
            </Typography>
          ))
        }
      </Stack>
    </Container>
  )
}

export default App
