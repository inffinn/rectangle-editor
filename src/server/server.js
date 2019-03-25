var express = require('express');
var path = require('path');
const fileAssets = express.static(path.join(__dirname, '../../dist')) //прдоставляет стат. файлы по пути


const buildHTMLPage = () => `<html lang='en'>
<div id='app'></div>
<script src='./assets/bundle.js' type='text/javascript'></script>
</html>
`
//создание пустой html странички и js скриптов

const respond = (req, res, next) => {
    return (res.status(200).send(buildHTMLPage()))
}

var app = express()
    .use(fileAssets)
    .use(respond)
var http = require('http').Server(app).listen(process.env.PORT || 3000, function () {
    console.log('listening on *:3000');
});
