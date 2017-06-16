const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");

const {generateMessage} = require("./utils/message.js");
const publicPath = path.join(__dirname,"../public");
const port = process.env.PORT || 3000;
//console.log(__dirname + "/../public");
//console.log(publicPath);
var app = express();
var server = http.createServer( app );
var io = socketIO(server);

app.use(express.static(publicPath));

io.on("connection", function(socket){
    console.log("New User connected");

    socket.emit("newMessage",generateMessage("Admin","Welcome to the chat app"));
    socket.broadcast.emit("newMessage",generateMessage("Admin", "New User joined"));

    socket.on("createMessage", (message, callback)=>{
      //  console.log("createMessage",message);
       io.emit("newMessage", generateMessage(message.from,message.text));   //emits to all sockets, not just the current socket  ==> broadcast
   /*   socket.broadcast.emit("newMessage",generateMessage(message.from,message.text); //broadcasts to all other sockets, except this one  **/
        callback("This is from the server.");
    });

    socket.on("disconnect", ()=>{
        console.log("User was disconnected");
    });

});

server.listen(port, () =>{
    console.log("Server is up on port " + port);
});
