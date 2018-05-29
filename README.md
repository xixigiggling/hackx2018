### hackx 2018 华中 

主要思路： 爬取博客园的用户所发的文章，根据他们博文中涉及到的专业词汇，来利用词频给用户进行技能分类以及熟练程度甄别

api: [jieba](https://github.com/fxsjy/jieba)、[word_cloud](https://github.com/amueller/word_cloud)

参考库：[cnblogs](https://github.com/hao15239129517/cnblogs)

![](https://github.com/xixigiggling/markdownImgs/raw/master/res/2983-%E8%90%8C%E5%B0%8FQ.jpg)


demo数据改成nodejs来爬，爬了20位用户，先写成json，再一次性存的mongodb，效率大大提高

结果展示页面:

![](https://github.com/xixigiggling/markdownImgs/raw/master/res/login.png)

登录页面: 取爬到的20位用户之一的用户名即可

![](https://github.com/xixigiggling/markdownImgs/raw/master/res/choose.png)

选择感兴趣的领域：会推荐出相应方面的大牛

![](https://github.com/xixigiggling/markdownImgs/raw/master/res/result.png)

展示出你的技能数据和推荐数据
