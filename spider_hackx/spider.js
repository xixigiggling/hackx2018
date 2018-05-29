const http = require('http');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const request = require('request');
const rq = require("request-promise");
const async = require("async");
const signale = require("signale");
const MongoClient = require("mongodb").MongoClient;
// Connection URL
const dbUrl = "mongodb://localhost:27017/cnblogs";

const url = "https://www.cnblogs.com/AllBloggers.aspx";
let userLinks = [];
let pageLinks = [];
let users = {};
request( url, function (error, response, body) {
  dealIndex(body);
});

// 取20位用户用作demmo展示
function dealIndex(body) {
  let $  = cheerio.load(body);
  // console.log($.html());
  for (let i = 2800; i < 2820; i++) {
    const element = $("a.BlogRss")[i];
    let str = element.attribs.href;
    // 去掉rss.aspx
    let user = {}; 
    let name = str.substring(23, str.length - 9);
    user.username = name;
    user.defaultPage = str.substring(0, str.length - 8) + 'default.html?page=';
    // 得到所有的页面url
    let pagelink = str.substring(0, str.length - 8) + "default.html?page=2";
    pageLinks.push(pagelink);
    user.pages = pagelink;
    // userLinks.push(str.substring(0, str.length - 8));
    users[name] = user;
  }
  // 用rq 来避免js的回调地狱
    for (let key in users) {
    rq(users[key].pages)
      .then((body)=>{
        let titles = [];
        let reads = 0;
        let replys = 0;
        for (let i = 0; i < getPageNum(body); i++) {
          // console.log(users[key].defaultPage + "" + i);
          rq(users[key].defaultPage + '' + i)
            .then((body) => {
              // 提取当前page的所有title和阅读数和评论数，存到users[key].articles
              let $ = cheerio.load(body);
              console.log('--------------------------------------titles------------------------------------------')
              if ($(".postTitle a").text() === '') {
                $(".post h2 a").each(function (i, elem) {
                  titles.push($(this).text());
                })
              }
              else {
                $(".postTitle a").each(function (i, elem) {
                  titles.push($(this).text());
                });
              }
              // console.log($(".postTitle a").text());
              console.log('-------------------------------------titles-------------------------------------------')

              console.log("--------------------------------------footer------------------------------------------");
              if ($(".postDesc").text() === '') {
                let arr = $(".postfoot")
                  .text()
                  .match(/-?[0-9]+d*/g);
                if (arr !== null) {
                  reads += parseInt(arr[arr.length - 2]);
                  replys += parseInt(arr[arr.length - 1]);
                }
              } else {
                let arr = $(".postDesc")
                  .text()
                  .match(/-?[0-9]+d*/g);
                if (arr !== null) {
                  reads += parseInt(arr[arr.length - 2]);
                  replys += parseInt(arr[arr.length - 1]);
                }
              }
              console.log("--------------------------------------footer------------------------------------------");
              users[key].articles = titles;
              users[key].readNum = reads;
              users[key].replyNum = replys;
              // console.log(users[key]);
              // console.log(users);
              console.log(1);
              fs.writeFile("users2.json", JSON.stringify(users),
                function (err) {
                  if (err) throw err;
                  console.log('It\'s saved!');
                }
              );
            }).catch (function (err) {
              console.log(err);
            });
        }
      }).catch(function (err) {
        console.log(err);
      });
    };
  // console.log(users);
  // userLinks.forEach((elem)=>{
  //   elem += 'default.html?page=2';
  //   user.defaultPage = elem
  //   pageLinks.push(elem);
  // });
  // parse_page(pageLinks);
  // pageLinks.forEach((pagelink) => {
  //   addUserPageNum(pagelink); 
  // })
  // console.log(users);
  // for (let key in users) {
  //   request(users[key].pages, (error, response, body) => {
  //     let titles = [];
  //     let reads = 0;
  //     let replys = 0;
  //     for (let i = 0; i < getPageNum(body); i++) {
  //       // console.log(users[key].defaultPage + "" + i);
  //       request(users[key].defaultPage + '' + i, (error, response, body) => {
  //         // 提取当前page的所有title和阅读数和评论数，存到users[key].articles
  //         let $ = cheerio.load(body);
  //         console.log('--------------------------------------titles------------------------------------------')
  //         if ($(".postTitle a").text()==='') {
  //           $(".post h2 a").each(function (i, elem) {
  //             titles.push($(this).text());
  //           })
  //         }
  //         else {
  //           $(".postTitle a").each(function (i, elem) {
  //             titles.push($(this).text());
  //           });
  //         }  
  //           // console.log($(".postTitle a").text());
  //         console.log('-------------------------------------titles-------------------------------------------')

  //         console.log("--------------------------------------footer------------------------------------------");
  //         if($(".postDesc").text()==='') {
  //           let arr = $(".postfoot")
  //             .text()
  //             .match(/-?[0-9]+d*/g);
  //           if (arr !== null) {
  //             reads += parseInt(arr[arr.length - 2]);
  //             replys += parseInt(arr[arr.length - 1]);
  //           }  
  //         }else {
  //           let arr = $(".postDesc")
  //             .text()
  //             .match(/-?[0-9]+d*/g);
  //           if (arr !==null) {
  //             reads += parseInt(arr[arr.length - 2]);
  //             replys += parseInt(arr[arr.length - 1]);
  //           }
  //         }
  //         console.log("--------------------------------------footer------------------------------------------");
  //         users[key].articles = titles;
  //         users[key].readNum = reads;
  //         users[key].replyNum = replys;
  //         console.log(users[key]);
  //         console.log(users);
  //         // fs.writeFile(
  //         //   "users.json",
  //         //   JSON.stringify(users),
  //         //   function (err) {
  //         //     if (err) throw err;
  //         //     console.log('It\'s saved!');
  //         //   }
  //         // );
  //         // setTimeout((users) => {
  //         //   console.log(users);
  //         //   fs.writeFile("users.json", JSON.stringify(users),
  //         //     function (err) {
  //         //       if (err) throw err;
  //         //       console.log('It\'s saved!');
  //         //     }
  //         //   );
  //         // }, 1000 * 1 * 60);
  //       });
  //     }
      
  //   });
  // }

  // setTimeout((users) => {
  //   console.log(users);
  //   fs.writeFile("users.json",JSON.stringify(users),
  //     function (err) {
  //       if (err) throw err;
  //       console.log('It\'s saved!');
  //     }
  //   );
  // }, 1000*1*60);
  // setTimeout(
    // function writeTodb(users) {
    //   let MongoClient = require("mongodb").MongoClient;
    //   // Connection URL
    //   let dbUrl = "mongodb://localhost:27017/cnblogs";

    //   let insertDocuments = function(db, users, callback) {
    //     // Get the documents collection
    //     let collection = db.collection("users");
    //     // Insert some documents
    //     collection.insert(users, function(err, result) {
    //       // assert.equal(3, result.result.n);
    //       // assert.equal(3, result.ops.length);
    //       console.log("Inserted a article into the collection");
    //       callback(result);
    //     });
    //   };

    //   // Use connect method to connect to the server
    //   MongoClient.connect(dbUrl, function(err, db) {
    //     console.log("Connected successfully to server");
    //     insertDocuments(db, users, function() {
    //       db.close();
    //     });
    //   });
    // }, 1000 * 3 * 60); 
}

// 之前用到的一些函数 后来发现没什么用。。。
function addUserPageNum (pagelink) {
  request(pagelink, (error, response, body) => {
    // 得到最大值
    // getPageNum(body);
    // 当前用户
    let nowUser = pagelink.substring(23, pagelink.length - 20);
    for (let i = 0; i < getPageNum(body); i++) {
      users.forEach((user) => {
        if (user.username === nowUser) {
          // user.articleNum = getPageNum(body);
          request(pagelink.slice(0, pagelink.length - 1) + '' + i, (error, response, body) => {
            dealPage(body,user);
          })
        }
      });
      request(pagelink.slice(0, pagelink.length - 1) + '' + i, (error, response, body) => {
        user = dealPage(body);
        console.log(user);
      })
    }
    // users.forEach((elem)=>{
    //   if (elem.username === pagelink.substring(23, pagelink.length - 20)) {
    //     elem.articleNum = getPageNum(body);
    //   }
    // });
    // console.log(users);
  });
}
function dealPage(body,user){
  let $ = cheerio.load(body);
  let allTitles = $("#homepage1_HomePageDays_DaysList_ctl01_DayList_TitleUrl_0").text();
  user.articles = [];
  user.articles.push(allTitles);
  // let allReadNum = $("p.postfoot").text();
  // console.log(allTitles);
  // console.log(allReadNum);
  // for (let i = 0; i < allTitles.length; i++) {
  // }
  return user;
}

function parse_page(pageLinks) {
  pageLinks.forEach((pageUrl)=>{
    request(pageUrl, function(error, response, body) {
      getPageNum(body);
    });
  })
}
// 得到页面的
function getPageNum(page) {
  let $ = cheerio.load(page);
  let pageNum = $("div.pager").text();
  let arr = pageNum.match(/-?[1-9]+d*/g);
  let sum = 0;
  arr.forEach((elem) => {
    if (parseInt(elem) > sum) {
      sum = parseInt(elem);
    }
  })
  //sum就是最大页码
  return sum
  // 共19页: 上一页 1 2 3 4 5 6 7 8 9 下一页 末页
  // signale.success($("div.pager").text());
}
// 一个json 要有用户名，最大页码，