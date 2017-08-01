var express = require("express");
var moment = require("moment");
var handlers = require("./dbHandler").handlers;

var router = express.Router();


router.get("*", function(req, res) {
    var user = res.locals.user;
    var _id = req.path.replace("/", "");
    var myHandler = handlers.articleModel;
    myHandler.findOne({"_id" : _id}, function(err, data){
        if( data ){
            data.format = moment(data.created).format("YYYY年MM月DD日 HH:mm:ss");
            res.render("articleDisplay", {
                "title": "文章",
                "user": user,
                "article" : data,
                "action" : "articleDisplay"
            });
            data.update({"view" : (data.view + 1)},function(err){
                if(err){
                    console.log(err)
                }
            });
        }
    });
});


exports.start = router;