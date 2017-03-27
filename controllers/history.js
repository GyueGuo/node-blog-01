var express = require("express");
var moment = require("moment");
var handlers = require("./dbHandler").handlers;

var router = express.Router();

router.get("/", function(req, res) {
    var user = res.locals.user;
    if ( typeof(user) !== "object" ) {
        res.redirect(301, "login");
    } else {
        var parms = req.query; 
        var cur_page = parms.page || 1;
        const limit = 10;
        var myHandler = handlers.articleModel;
        myHandler.count({}, function(err , total){
            if( err ){
                console.log( err );
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
                    if( err ){
                        console.log( err );
                    }else{
                        var len = datas.length;
                        var  i = 0, temp;
                        for( ; i < len; i++){
                            var temp = datas[i];
                            delete temp.content;
                            temp.format = moment(temp.created).format("YYYY-MM-DD HH:mm:ss");
                        }
                        res.render("history", {
                            "title": "历史文章",
                            "user": user,
                            "history" : datas,
                            "total" : len,
                            "action" : "history",
                            "cur_page" : cur_page,
                            "limit" : limit
                        });
                    }
                });
            }
        });
        // articleHandler.find({"author" : user.username}).sort({"_id" : -1}).exec(function(err, datas){
        //     if( datas ){
        //         var arr = ([]).concat(datas);
        //         var len = arr.length;
        //         var total = Math.ceil( len / limit );
        //         if( cur_page > total ){
        //             cur_page = total;
        //         }
        //         var start = ( cur_page - 1 ) * limit;
        //         var end = cur_page * limit - 1;
        //         var cnt = arr.slice(start, end);
        //         for(var i = 0; i < cnt.length ; i++){
        //             delete cnt[i].content;
        //             cnt[i].format = moment(cnt[i].created).format("YYYY-MM-DD HH:mm:ss");
        //         }
        //     }
        //     res.render("history", {
        //         "title": "历史文章",
        //         "user": user,
        //         "action" : "history",
        //         "history" : cnt,
        //         "total" : len,
        //         "cur_page" : cur_page,
        //         "limit" : limit
        //     });
        // });
    }
});

//消息通知
exports.start = router;
