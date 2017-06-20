const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");

const {generateMessage,generateLocationMessage} = require("./utils/message.js");
const {isRealString} = require("./utils/validation.js");
const {Users} = require("./utils/users.js");

const publicPath = path.join(__dirname,"../public");
const port = process.env.PORT || 3000;
//console.log(__dirname + "/../public");
//console.log(publicPath);
var app = express();
var server = http.createServer( app );
var io = socketIO(server);

var users = new Users();

app.use(express.static(publicPath));

io.on("connection", function(socket){
    console.log("New User connected");




    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
           return  callback('Name and room name are required.');
        }
        socket.join(params.room);
        //socket.leave("params.room")  // is how to leave the room
        users.removeUser(socket.id); //remove user from other room if joining this room.
        users.addUser(socket.id, params.name,params.room);

        io.to(params.room).emit("updateUserList", users.getUserList(params.room));

        socket.emit("newMessage",generateMessage("Admin","Welcome to the chat app"));
        socket.broadcast.to(params.room).emit("newMessage",generateMessage("Admin", params.name + " has joined"));
        callback();
    });

    socket.on("createMessage", (message, callback)=>{
      //  console.log("createMessage",message);
        var user = users.getUser(socket.id);
        if(user && isRealString(message.text))
        {
            io.to(user.room).emit("newMessage", generateMessage(user.name,message.text));   //emits to all sockets, not just the current socket  ==> broadcast
        }

   /*   socket.broadcast.emit("newMessage",generateMessage(message.from,message.text); //broadcasts to all other sockets, except this one  **/
        callback("This is from the server.");
    });

    socket.on("createLocationMessage", (coords)=>{
        var user = users.getUser(socket.id);
        if(user)
        {
            io.to(user.room).emit("newLocationMessage", generateLocationMessage(user.name,coords.latitude,coords.longitude));   //emits to all sockets in room, not just the current socket  ==> broadcast
        }
    });

    socket.on("disconnect", ()=>{
       // console.log("User was disconnected");
        var user = users.removeUser(socket.id);
        if(user)
        {
            io.to(user.room).emit("updateUserList",users.getUserList(user.room));
            io.to(user.room).emit("newMessage",generateMessage("Admin",user.name + " has left."));
        }
    });

});

server.listen(port, () =>{
    console.log("Server is up on port " + port);
});
