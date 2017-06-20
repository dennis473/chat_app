
var moment = require("moment");

var date = moment();
date.add(1,'year');
console.log( date.format("MMM Do, YYYY"));

var someTimestamp = moment().valueOf();
console.log(someTimestamp);

var createdAt = 1234;
var date = moment(createdAt);
console.log(date.format("MMMM Do, YYYY h:mm:ss"));