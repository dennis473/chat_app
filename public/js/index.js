/**
 * Created by gibsond on 6/16/2017.
 */
var socket =  io();   //initialize connection
socket.on("connect", function(){
    console.log("Connected to server");
});
socket.on("disconnect", function(){
    console.log("Disconnected from server");
});

socket.on("newMessage",function(message){
    console.log("New Message: ", message);
    var li = $("<li></li>");
    li.text(`${message.from}: ${message.text}`);
    $("#messages").append(li);
});

/*socket.emit("createMessage",{
    from : "Frank",
    text: "Hi from Frank"
}, function(data){
    console.log("Got it: ", data);
}); */

$("#sendButton").on("click", function(evt){
   // evt.preventDefault();
    console.log("message sent");
    socket.emit("createMessage",{
        from: "User",
        text: $("#message").val()
    },function(data){
        console.log("Data returned: ", data);
    });
});