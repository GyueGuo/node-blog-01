var express = require("express");
var uuid = require("node-uuid");
var md5 = require("./md5").md5;
var handlers = require("./dbHandler").handlers;

var router = express.Router();

router.get("/", function(req, res) {
    var user = res.locals.user;
    if ( typeof(user) === "object" ) {
        res.redirect(301, "setting");

    } else {
        res.render("login&register", {
            "title": "注册",
            "user": user,
            "action" : "register"
        });
    }
});

router.post("/", function(req, res) {
    var json = req.body;
    if (!json.username || !json.password) {
        res.status(400).send({ error: '1', description: "elements are not enough" });
        return;
    }
    var myHandler = handlers.userModel;
    var newNotice = new handlers.noticeModel( { content : "恭喜！您已注册成功，开始体验网站功能吧。",owener : json.username} );
    var _token = md5(uuid.v1());
    var temp = new myHandler({ "username": json.username, "password": md5(json.password), "token": _token });
    myHandler.count({ "username": json.username }, function(err, doc) {
        if (err) {
            res.status(500).send("can't connect to server");
        } else {
            if (doc === 0) {
                temp.save(function(err, data) {
                    if (err) {
                        res.status(500).send("can't connect to server");
                    } else {
                        newNotice.save();
                        res.status(200).send({ 'success': '1', "token": encodeURIComponent(_token) });
                    }
                });
            } else {
            	res.status(400).send({ error: '2', description: "username has been registerdd" });
            }
        }
    });
});

exports.start = router;
