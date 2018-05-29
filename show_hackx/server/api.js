/*
 * @Author: xixigiggling 
 * @Date: 2018-05-09 14:57:05 
 * @Last Modified by: xixigiggling
 * @Last Modified time: 2018-05-27 09:59:07
 * 
 * 连接mongoDB, 提供express的router的api
 */

// const Models = require('./db');
const express = require('express');
const router = express.Router();
/************** 创建(create) 读取(get) 更新(update) 删除(delete) **************/
const MongoClient = require('mongodb').MongoClient
// Connection URL
const url = 'mongodb://localhost:27017/cnblogs';

/**
 * 登录的时候请求的接口
 * @param username
 * @return 该用户的技能图谱，工程师得分
 */
router.post('/api/user', (req, res) => {
  var finduser = function(db, callback) {
    var collection = db.collection('users');
    console.log(req);
    var username = req.query.username;
    console.log("usename is ", username);
    collection.find({ "username": username }).toArray(function(err, result) {
      callback(result);
    });
  }
  MongoClient.connect(url, function(err, db) {
    finduser(db, data => {
      res.send(data);
      db.close();
    });
  });
});
// 
/**
 * 点击感兴趣的方向，得到推荐的大牛
 * @param type: 感兴趣的方向 
 *        score: 该用户的工程师得分
 * @return 得到工程师得分比该用户高的大牛
 */
router.post('/api/expert', (req, res) => {
  var finduser = function (db, callback) {
    var collection = db.collection('users');
    var type = req.query.type;
    var score = req.query.score;
    console.log("type is",type);
    console.log("score is", score);
    collection.find({ 'type': type, 'score': { '$gt': parseInt(score)}}).toArray(function (err, result) {
      callback(result);
    });
  }
  MongoClient.connect(url, function (err, db) {
    finduser(db, data => {
      res.send(data);
      db.close();
    });
  });
});

module.exports = router;