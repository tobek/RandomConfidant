module.exports.mysql= require('mysql').createConnection({
  host: 'localhost',
  user: 'node',
  password: 'firebead',
  database: 'random_confidant'
});

module.exports.JSONlog = function(json) {
  var cache = [];
  console.log(JSON.stringify(json, function(key, value) {
      if (typeof value === 'object' && value !== null) {
          if (cache.indexOf(value) !== -1) {
              // Circular reference found, discard key
              return;
          }
          // Store value in our collection
          cache.push(value);
      }
      return value;
  }));
  cache = null;
}