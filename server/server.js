const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");

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


    socket.emit("newMessage", {
        from : "Steve",
        text: "See ya soon",
        createdAt: new Date().getTime()
    })

    socket.on("disconnect", ()=>{
        console.log("User was disconnected");
    });

});

server.listen(port, () =>{
    console.log("Server is up on port " + port);
});
