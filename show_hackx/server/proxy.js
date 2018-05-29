var express = require('express');
var proxy = require('http-proxy-middleware');

var app = express();

app.use('/api', proxy({target: 'http:47.106.158.44:8080', changeOrigin: true}));
app.listen(3000);
console.log('success listen2…………');