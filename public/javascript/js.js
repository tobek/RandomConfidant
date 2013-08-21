"use strict";

var socket = io.connect('http://localhost');

$(function() { // upon DOM load

  $("#pickUser li").click(function(e) {
    $.getJSON("/login?id=" + $(e.target).attr("data-id"), function(data){
      if (data.error) {
        alert("Failed to log in: " + data.error);
        return;
      };
      $("#welcome-msg .name").html(data.name);
      $("body").attr("class", "logged-in");
    });
  });

  $("#submit").click(function(e){
    e.preventDefault();
    var msg = $("#startConvo .msg").val();
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
    $("#startConvo .msg").val(""); // clear it
  })

});

socket.on('received', function (data) {
  console.log('received message: ' + data.message);
  printMessage(data.message);
});

function printMessage(msg) {
  $("#messages")[0].innerHTML = '<li><input type="submit" value="Respond" class="respond-button">' + msg + '</li>' + $("#messages")[0].innerHTML;
}
