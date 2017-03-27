var express = require("express");
var uuid = require("node-uuid");
var md5 = require("./md5").md5;
var dbHandlers = require("./dbHandler");
var handlers = dbHandlers.handlers;
var db = dbHandlers.db

var router = express.Router();

router.get("/", function(req, res) {
    var user = res.locals.user;
    if ( typeof(user) !== "object" ) {
        res.redirect(301, "login");
    } else {
        res.render("article", {
            "title": "发布文章",
            "user": user,
            "action" : "article"
        });
    }
});

router.post("/", function(req, res) {
    var user = res.locals.user;
    var json = req.body;
    if( !user ){
        res.status(401).send("no authorization");
        return;
    }
    if ( !json.title || !json.content ) {
        res.status(400).send({ error: '1', description: "elements are not enough" });
        return;
    }
    var myHandler = handlers.articleModel;
    var temp = new myHandler({ "title": json.title, "content": json.content, "author" : user.username });
    ( json.cover.length > 0 ) && ( temp.cover = ([]).concat( json.cover ) );
    temp.save( function(err, doc) {
        if ( err ) {
            res.status(500).send("can't connect to server");
        } else {
            res.status(200).send({ 'success': '1'});
        }
    });
});

exports.start = router;
