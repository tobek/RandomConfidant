"use strict";

var socket = io.connect('http://localhost');

$(function() { // upon DOM load
  $("#submit").click(function(e){
    e.preventDefault();
    var msg = $("#text").val();
    console.log('submitting message ' + msg);
    socket.emit('submit', { message: msg }, function(err){
      if (err) {
        console.log('something went wrong: ' + err);
      }
      else {
        console.log('server received message');
        printMessage(msg);
      }
    });
    $("#text").val(""); // clear it
  })
});

socket.on('received', function (data) {
  console.log('received message: ' + data.message);
  printMessage(data.message);
});

function printMessage(msg) {
  $("#messages")[0].innerHTML = '<li>' + msg + '</li>' + $("#messages")[0].innerHTML;
}