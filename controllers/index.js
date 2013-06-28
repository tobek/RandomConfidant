/*
 * GET home page.
 */

var common = require('../lib/common.js');

exports.index = function(req, res){

  var view = {
    title: 'Random Confidant',
    scripts: ["/socket.io/socket.io.js", "//ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js", "/javascript/js.js"],
  };

  if (req.sesh.username) {
    view.username = req.sesh.username;
    res.render('index', view);
  }
  else {
    common.mysql.query("SELECT * FROM users", function(err, results){
      if (err) throw err;
      view.users = results;
      res.render('index', view);
    });
  }

};

exports.login = function (req, res){
  res.setHeader('content-type', 'application/javascript');

  common.mysql.query("SELECT name FROM users WHERE id = " + req.query.id, function(err, results){
    if (err) throw err;

    response = {};

    if (results.length == 0) {
      response.error = "Failed to log in with user id " + req.query.id;
    }
    else {
      req.sesh.userID = req.query.id;
      req.sesh.username = results[0].name;
      console.log(req.sesh.username + ' logged in.');
      response.name = results[0].name;
    }

    res.send(JSON.stringify(response));
  });
}

exports.logout = function (req, res) {
  req.sesh.reset();
  res.redirect('/');
}
