import express from 'express'
import {Server} from "socket.io"
import http from 'http'

const app=express();
const server=http.createServer(app);

const io=new Server(server);

io.on('connection',(socket)=>{
    console.log(`A user is connected with id ${socket.id}`)
})

server.listen(3000,()=>{
    console.log("App listens on Port 3000")
})