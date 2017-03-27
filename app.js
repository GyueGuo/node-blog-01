var path = require("path");
var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var favicon = require("serve-favicon");
var session = require("express-session");
var ueditor = require("ueditor");
//var morgan = require('morgan')

/*数据库模型*/
var dbHandlers = require("./controllers/dbHandler");
var handlers = dbHandlers.handlers;
var db = dbHandlers.db

/*路由处理js*/
var ueditor = require("ueditor");
var index = require("./controllers/index").start;
var register = require("./controllers/register").start;
var login = require("./controllers/login").start;
var article = require("./controllers/article").start;
var notice = require("./controllers/notice").start;
var imageUpload = require("./controllers/imageUpload").start;
var userSetting = require("./controllers/userSetting").start;
var message = require("./controllers/message").start;
var history = require("./controllers/history").start;
var articleDisplay = require("./controllers/articleDisplay").start;
var websocket = require("./controllers/websocket").start;

/*websocket*/
var socket = require("./controllers/ws");
/*express 设置*/
var app = express();
var options = {
    dotfiles: 'ignore',
    etag: false,
    extensions: ['htm', 'html'],
    index: false,
    maxAge: 48 * 3600 * 1000,
    redirect: false,
    setHeaders: function(res, path, stat) {
        res.set('x-timestamp', Date.now());
    }
}

app.set('views', __dirname + '/template')
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html');

app.use("*", function(req, res, next){
    if( !path.extname(req.url) ){
        res.setHeader("cache-control", "no-cache");
    }
    next();
});
app.use("/temp", express.static("temp", options));
app.use("/static/ueditorFile", express.static("ueditorFile", options));
app.use("/static", express.static('static', options));

app.use(favicon(__dirname + '/favicon.ico', {maxAge : 8640000000}));
app.use(bodyParser.json({limit : "2mb"}));
app.use(bodyParser.urlencoded({ extended: true, limit : "2mb"}));
app.use(cookieParser());
/*app.user(session({
    secret: settings.session_secret,
    store: new RedisStore({
        port: settings.redis_port,
        host: settings.redis_host,
        pass : settings.redis_psd,
        ttl: 1800 // 过期时间
    }),
    resave: true,
    saveUninitialized: true
}));*/

app.use(function(req, res, next) {
    var cookies = req.cookies;
    if ("Gtoken" in cookies) {
        var hander = handlers.userModel;
        hander.findOne({ "token": cookies.Gtoken }, function(err, data) {
            if( data ){
                delete data.password;
                res.locals.user = data;
                res.cookie("Gtoken", data.token, { maxAge : 172800000, domain : req.hostname});
                next();
            }else{
                res.locals.user = "";
                next();
            }
        });
    } else {
        res.locals.user = "";
        next();
    }
});

app.use( '/index', index );
app.use( '/register', register );
app.use( '/login', login );
app.use( '/notice', notice );
app.use( '/imageUpload', imageUpload );
app.use( '/setting', userSetting );
app.use( '/article', article );
app.use( '/history', history );
app.use( '/message', message );
app.use( '/articleDisplay', articleDisplay );
app.use( '/websocket', websocket );

/*ueditor*/
app.use("/static/ueditor/ue", ueditor("/node/", function (req, res, next) {
    //客户端上传文件设置
     var ActionType = req.query.action;
    if (ActionType === 'uploadimage' || ActionType === 'uploadfile' || ActionType === 'uploadvideo') {
        var file_url = '/static/ueditorFile/images';//默认图片上传地址
        /*其他上传格式的地址*/
        // if (ActionType === 'uploadfile') {
        //     file_url = '/file/ueditor/'; //附件
        // }
        // if (ActionType === 'uploadvideo') {
        //     file_url = '/video/ueditor/'; //视频
        // }
        res.ue_up(file_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
    }
    //  客户端发起图片列表请求
    else if (req.query.action === 'listimage') {
        var dir_url = '/static/ueditorFile/images';
        res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片
    }
    // 客户端发起其它请求
    else {
        res.setHeader('Content-Type', 'application/json');
        res.redirect('/static/ueditor/nodejs/config.json');
    }
}));

//404错误
app.use(function(req, res, next) {
    err = new Error()
    err.status = 404;
    res.render('error', {
        message: err.message,
        error: err
    });
});

// error handlers
// development error handler    will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.send( err.message );
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send( err.message );
});

app.listen(8080, function(){
    console.log('app listen : 8080');
});
