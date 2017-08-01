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
        var myHandler = handlers.noticeModel;
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
                        temp.format = moment(temp.created).format("YYYY-MM-DD HH:mm:ss");
                    }
                    res.render("notice", {
                        "title": "消息通知",
                        "user": user,
                        "notice" : datas,
                        "total" : len,
                        "action" : "notice",
                        "cur_page" : cur_page,
                        "limit" : limit
                    });
                });
            }
        });
        // noticeHandler.find({"owener" : user.username}).sort({"_id" : -1}).exec(function(err, datas){
        //     if( datas ){
        //         var len = datas.length;
        //         var total = Math.ceil( len / limit );
        //         if( cur_page > total ){
        //             cur_page = total;
        //         }
        //         if(cur_page === 0){
        //             cur_page = 1;
        //         }
        //         var start = ( cur_page - 1 ) * limit;
        //         var end = cur_page * limit - 1;
        //         var cnt = datas.slice(start, end);
        //         for(var i = 0; i < cnt.length ; i++){
        //             cnt[i].format = moment(cnt[i].created).format("YYYY-MM-DD HH:mm:ss");
        //         }
        //     }
        //     res.render("notice", {
        //         "title": "消息通知",
        //         "user": user,
        //         "action" : "notice",
        //         "notice" : cnt,
        //         "total" : len,
        //         "cur_page" : cur_page,
        //         "limit" : limit
        //     });
        // });
    }
});

//消息通知
exports.start = router;
