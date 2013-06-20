"use strict";

var socket = io.connect('http://localhost');

$(function() { // upon DOM load
  $("#submit").click(function(){
    console.log('submitting message '+$("#text").val());
    socket.emit('submit', { message: $("#text").val() }, function(err){
      if (err) {
        console.log('something went wrong: ' + err);
      }
      else {
        console.log('server received message');
        printMessage($("#text").val());
      }
    });
  })
});

socket.on('received', function (data) {
  console.log('received message: ' + data.message);
  printMessage(data.message);
});

function printMessage(msg) {
  $("#messages")[0].innerHTML += '<li>' + msg + '</li>';
}