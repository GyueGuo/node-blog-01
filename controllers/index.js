var express = require("express");
var moment = require("moment");
var handlers = require("./dbHandler").handlers;

var router = express.Router();

router.get("/", function(req, res) {
    var user = res.locals.user;
    var parms = req.query; 
    var cur_page = parms.page || 1;
    const limit = 10;
    var myHandler = handlers.articleModel;
    myHandler.count({}, function(err , total){
        if( err ){
            console.log( err )
        }else{
            var totalPage = Math.ceil( total / limit );
            if( cur_page > total ){
                cur_page = total;
            }
            if( cur_page === 0 ){
                cur_page = 1;
            }
            var start = ( cur_page - 1 ) * limit;
            myHandler.find().sort({"_id" : -1}).skip(start).limit(limit).exec(function(err, datas){
                var len = datas.length;
                var  i = 0, temp;
                for( ; i < len; i++){
                    var temp = datas[i];
                    delete temp.content;
                    temp.format = moment(temp.created).format("YYYY-MM-DD HH:mm:ss");
                }
                res.render("index", {
                    "title": "文章",
                    "user": user,
                    "articles" : datas,
                    "total" : len,
                    "action" : "index",
                    "cur_page" : cur_page,
                    "limit" : limit
                });
            });
        }
    });
});


exports.start = router;