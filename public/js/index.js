/**
 * Created by gibsond on 6/16/2017.
 */
var socket =  io();   //initialize connection
socket.on("connect", function(){
    console.log("Connected to server");
    socket.emit("createMessage",{
        from: "Andrew",
        text: "Yup, works for me"
    });
});
socket.on("disconnect", function(){
    console.log("Disconnected from server");
});

socket.on("newMessage",function(message){
    console.log("New Message: ", message);
});