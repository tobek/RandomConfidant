var DB_NAME = "random_confidant";
var HOST = 'localhost';
var USER = 'node';
var PASSWORD = 'firebead';

/* create database as user with appropriate privileges:
  CREATE DATABASE random_confidant DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;
  CREATE USER 'node'@'localhost' IDENTIFIED BY 'firebead';
  GRANT ALL ON random_confidant.* TO 'node'@'localhost';
*/

var tables = "\
  CREATE TABLE users (\
    id INT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,\
    name varchar(255) NOT NULL,\
    email varchar(255) NOT NULL,\
    avatar_url varchar(255),\
    PRIMARY KEY (id)\
  ) ENGINE=InnoDB;\
\
  CREATE TABLE conversations (\
    id SERIAL,\
    user1_id INT UNSIGNED NOT NULL,\
    user2_id INT UNSIGNED,\
    active BOOL NOT NULL DEFAULT 1,\
    PRIMARY KEY (id),\
    FOREIGN KEY (user1_id) REFERENCES users(id),\
    FOREIGN KEY (user2_id) REFERENCES users(id)\
  ) ENGINE=InnoDB;\
\
  CREATE TABLE messages (\
    id SERIAL,\
    convo_id BIGINT UNSIGNED NOT NULL,\
    timestamp INT NOT NULL,\
    sender_id INT UNSIGNED NOT NULL,\
    message MEDIUMTEXT NOT NULL,\
    PRIMARY KEY (id),\
    FOREIGN KEY (convo_id) REFERENCES conversations(id),\
    FOREIGN KEY (sender_id) REFERENCES users(id)\
  ) ENGINE=InnoDB;";

var users = [
  { name: "Martial",
    email: "marq@adaptly.com" },
  { name: "Ece",
    email: "ecedogrucu@gmail.com" },
  { name: "Toby",
    email: "tobyfox@gmail.com" }
];

// ###################

var async = require('async');

console.log("Connecting to MySQL...");

var mysql = require('mysql').createConnection({
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: DB_NAME,
    multipleStatements: true
  });

console.log("Setting up tables..");

mysql.query(tables, function(err, result) {
  if (err) throw err;
  console.log("Tables created");

  console.log("Setting up sample users...");

  async.each(users, function(user, cb){
    mysql.query("INSERT INTO users SET ?", user, function(err, result) {
      if (err) cb(err);
      else {
        console.log("User inserted");
        cb();
      }
    });
  }, function(err){
    if (err) throw err;
    mysql.end(function(err) {
      if (err) throw err;
      console.log("All done!");
    });
  });

});

// TODO: 