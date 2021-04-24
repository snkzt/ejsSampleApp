var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('db.sqlite3');

exports.index = function(req, res) {
  db.serialize(function() {
    var message = "";

    // Create a record
    if (req.body.submitBtn === "add") {
      db.run("INSERT INTO users (name) VALUES (?)", req.body.name);
      message = "1 new record added";
    }

    // Delete a record
    if (req.body.action === "delete") {
      db.run("DELETE FROM users WHERE id = ?", req.body.target);
      message = `User id ${req.body.target} is deleted`;
    }

    // Search a record
    if (req.body.submitBtn === "search") {
      message = "Showing the search result";
      console.log(`SELECT id, name FROM users WHERE name like ${req.body.searchText}`);
      db.all(`SELECT id, name FROM users WHERE name like '${req.body.searchText}'`, function(err, rows) {
        if (!err) {
          if (rows.length === 0) {
            message = "No record";
          }
          res.render ('index', {
            messages: message,
            users: rows
          });
        }
        else {
          console.log(err);
        }
      });
    }

    // Get all records
    else {
      db.all("SELECT id, name FROM users", function(err, rows) {
        if(!err) {
          res.render('index', {
            messages: message,
            users: rows
          });
        } else {
          console.log(err);
        }
      });
    }
  });
}
