var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var hbs = require('express-hbs');
var path = require('path');
var logger = require('morgan');
var settings = require('./settings');
var RedisStore = require('connect-redis')(session);
var app = express();
var fs = require('fs');

var errorLog = fs.createWriteStream('tmp/log/error.log', {flags: 'a'});
// custom log format
if ('test' != process.env.NODE_ENV) app.use(logger('\t:method :url'));

app.engine('hbs', hbs.express3({
    partialsDir: __dirname + '/views'
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use('/public', express.static(path.join(__dirname, 'assets')));
app.enable('trust proxy');//信任代理
app.use(flash());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//app.use(cookieParser(settings.cookieSecret));
app.use(session({
    secret: settings.cookieSecret,
    key: settings.cookieName,//cookie name
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
    store : new RedisStore(settings.redis)
}));

hbs.registerHelper("compare",function(v1,v2,options){
    if(v1==v2){
        return options.fn(this);
    }else{
        return options.inverse(this);
    }
});

//初始化路由
require('./routers')(app);


/***
 * logger
 */
app.use(function (err, req, res, next) {
    var meta = '[' + new Date() + '] ' + req.url + '\n';
    errorLog.write(meta + err.stack + '\n');
    //res.render('error',{ 'msg':err.message,'stack':err.stack});
    next();
});

/***
 * 启动服务，监听端口
 * @type {http.Server}
 */
var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});

module.exports = app;

