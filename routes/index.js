/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', {
    title: 'Random Confidant',
    scripts: ["/socket.io/socket.io.js", "//ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js", "/javascript/js.js"]
  });
};