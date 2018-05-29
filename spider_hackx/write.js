const fs = require('fs');

fs.readFile("users.json",'utf-8', function (err, data) {
  if (err) {
    throw err;
  }
  writeTodb(data);
});  

// 把本地的users.json写入mongodb数据库
function writeTodb(users) {
  const MongoClient = require("mongodb").MongoClient;
  // Connection URL
  const url = 'mongodb://localhost:27017/cnblogs';

  const insertDocuments = function(db,users, callback) {
    // Get the documents collection
    var collection = db.collection('users');
    // Insert some documents
    for(let key in users) {
      // users.key 
      collection.insert(users.key, function(err, result) {
        console.log("Inserted a users into the collection");
        callback(result);
      });
    }
  }

  // Use connect method to connect to the server
  MongoClient.connect(url, function(err, db) {
    console.log("Connected successfully to server");
    insertDocuments(db, users, function() {
      db.close();
    });
  });
}