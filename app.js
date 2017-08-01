let path = require("path");
let express = require("express");
let bodyParser = require("body-parser");
let cookieParser = require("cookie-parser");
let favicon = require("serve-favicon");
let session = require("express-session");
let ueditor = require("ueditor");

/*数据库模型*/
let dbHandlers = require("./controllers/dbHandler");
let handlers = dbHandlers.handlers;
let db = dbHandlers.db

/*路由处理js*/
let indexRedirect = require("./controllers/indexRedirect").start;
let index = require("./controllers/index").start;
let register = require("./controllers/register").start;
let login = require("./controllers/login").start;
let article = require("./controllers/article").start;
let notice = require("./controllers/notice").start;
let imageUpload = require("./controllers/imageUpload").start;
let userSetting = require("./controllers/userSetting").start;
let message = require("./controllers/message").start;
let history = require("./controllers/history").start;
let articleDisplay = require("./controllers/articleDisplay").start;
let websocket = require("./controllers/websocket").start;

/*websocket*/
let socket = require("./controllers/ws");
/*express 设置*/
let app = express();
let options = {
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

app.use("*", function(req, res, next) {
    if (!path.extname(req.url)) {
        res.setHeader("cache-control", "no-cache");
    }
    next();
});
app.use("/temp", express.static("temp", options));
app.use("/static/ueditorFile", express.static("ueditorFile", options));
app.use("/static", express.static('static', options));

app.use(favicon(__dirname + '/favicon.ico', { maxAge: 8640000000 }));
app.use(bodyParser.json({ limit: "2mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "2mb" }));
app.use(cookieParser());

app.use(function(req, res, next) {
    let cookies = req.cookies;
    if ("Gtoken" in cookies) {
        let hander = handlers.userModel;
        hander.findOne({ "token": cookies.Gtoken }, function(err, data) {
            if (data) {
                delete data.password;
                res.locals.user = data;
                res.cookie("Gtoken", data.token, { maxAge: 172800000, domain: req.hostname });
                next();
            } else {
                res.locals.user = "";
                next();
            }
        });
    } else {
        res.locals.user = "";
        next();
    }
});
app.use('/', indexRedirect);
app.use('/index', index);
app.use('/register', register);
app.use('/login', login);
app.use('/notice', notice);
app.use('/imageUpload', imageUpload);
app.use('/setting', userSetting);
app.use('/article', article);
app.use('/history', history);
app.use('/message', message);
app.use('/articleDisplay', articleDisplay);
app.use('/websocket', websocket);

/*ueditor*/
app.use("/static/ueditor/ue", ueditor("/node/", function(req, res, next) {
    //客户端上传文件设置
    let ActionType = req.query.action;
    if (ActionType === 'uploadimage' || ActionType === 'uploadfile' || ActionType === 'uploadvideo') {
        let file_url = '/static/ueditorFile/images'; //默认图片上传地址
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
        let dir_url = '/static/ueditorFile/images';
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
        res.send(err.message);
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send(err.message);
});

app.listen(8080, function() {
    console.log('app listen : 8080');
});