const url = "http://www.cnblogs.com/haochuang/rss.aspx";
const page = "http://www.cnblogs.com/liuzhendong/default.html?page=2"; 
const footer = "posted @ 2015-01-09 14:02 BobLiu 阅读(959) 评论(0)";
let str = url; 
// console.log(url.substring(0,url.length-8));
// console.log(url.substring(23, url.length - 9));
// console.log(page.substring(23, page.length-20));
// console.log(page.slice(0,page.length-1)+'3');

console.log(footer.match(/-?[0-9]+d*/g));


const pageNum = "共19页: 上一页 1 2 3 4 5 6 7 8 9 下一页 末页";
let arr = pageNum.match(/-?[0-9]+d*/g);
let sum = 0;
arr.forEach((elem)=>{
    if (parseInt(elem) > sum) {
        sum = parseInt(elem);
    }
})
console.log(pageNum.match(/-?[1-9]+d*/g));
console.log(sum);
  // 共19页: 上一页 1 2 3 4 5 6 7 8 9 下一页 末页