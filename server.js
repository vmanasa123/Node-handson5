const express=require('express');
const path=require('path')
const app=express();
const socket=require('socket.io')

app.use(express.static(path.join(__dirname,'./public')))

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/public/index.html")
})

const server=app.listen(3001,()=>{
    console.log("server running on localhost:3001")
});
let user=[];
const io=socket(server,{cors:{origin:"*"}});
io.on("connection",(socket)=>{

    socket.on("client",(client)=>{
        user[socket.id]=client;
       socket.broadcast.emit("userjoin",client)
         console.log(`${client} has joined`);
    })

    socket.on("text",(text)=>{
       
        socket.broadcast.emit("textTransfer",{txt:text,name:user[socket.id]})
    })
    socket.on("disconnect",(msg)=>{
        socket.broadcast.emit("userleft",user[socket.id])
        delete user[socket.id]
        

    })
   
})