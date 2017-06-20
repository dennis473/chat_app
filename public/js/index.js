/**
 * Created by gibsond on 6/16/2017.
 */
var socket =  io();   //initialize connection

var messageTextbox = $("#message");
var locationButton = $("#locationButton");
var messageList = $("#messages");

socket.on("connect", function(){
    console.log("Connected to server");
});
socket.on("disconnect", function(){
    console.log("Disconnected from server");
});

socket.on("newMessage",function(message){
    var template = $("#message_template").html();
    var formattedTime = moment(message.createdAt).format("h:mm:ss a");
    var html = Mustache.render(template,{
        text: message.text,
        from: message.from,
        createdAt: formattedTime

    });
    messageList.append(html);
   /* console.log("New Message: ", message);
    var formattedTime = moment(message.createdAt).format("h:mm:ss a");
    var li = $("<li></li>");
    li.text(`${message.from} ${formattedTime}: ${message.text}`);

    messageList.append(li);
    */

});

socket.on("newLocationMessage", function(message){
    var formattedTime = moment(message.createdAt).format("h:mm:ss a");
    var template = $("#location_message_template").html();
    var html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        createdAt: formattedTime
    });
    messageList.append(html);
   /* var li = $("<li></li>");
    var formattedTime = moment(message.createdAt).format("h:mm:ss a");
    var a = $("<a target='_blank'>My current location</a>");
    li.text(`${message.from} ${formattedTime}: `);
    a.attr("href",message.url);
    li.append(a);
    messageList.append(li);
    */
});

/*socket.emit("createMessage",{
    from : "Frank",
    text: "Hi from Frank"
}, function(data){
    console.log("Got it: ", data);
}); */



    $("#sendButton").on("click", function(evt){
   // evt.preventDefault();
   // console.log("message sent");
        console.log("Textbox value: ", messageTextbox.val());
    socket.emit("createMessage",{
        from: "User",
        text: messageTextbox.val()
    },function(data){
       messageTextbox.val("");  //clear out message text field
    });
});



locationButton.on("click",function(evt){
    if( !navigator.geolocation)
    {
        return alert("Geolocation not supported by your browser.  Sorry");
    }
    locationButton.attr("disabled","disabled");
    locationButton.text("Setting location...");
    navigator.geolocation.getCurrentPosition(function(position){
       // console.log("Position: ", position);
        locationButton.removeAttr("disabled");
        locationButton.text("Send Location");
        socket.emit("createLocationMessage",{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    },function(error){
        locationButton.removeAttr("disabled");
        locationButton.text("Send Location");
        alert("Unable to fetch location");
    });
});