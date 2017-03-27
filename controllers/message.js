var express = require("express");
var moment = require("moment");
var handlers = require("./dbHandler").handlers;

var router = express.Router();

router.get("/", function(req, res) {
    var user = res.locals.user;
    var parms = req.query; 
    var cur_page = parms.page || 1;
    const limit = 10;
    var myHandler = handlers.messageModel;
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
                res.render("message", {
                    "title": "留言板",
                    "user": user,
                    "message" : datas,
                    "total" : len,
                    "action" : "message",
                    "cur_page" : cur_page,
                    "limit" : limit
                });
            });
        }
    });
    // messageHandler.find().sort({"_id" : -1}).exec(function(err, datas){
    //     if( datas ){
    //         var arr = ([]).concat(datas);
    //         var len = arr.length;
    //         var total = Math.ceil( len / limit );
    //         if( cur_page > total ){
    //             cur_page = total;
    //         }
    //         if(cur_page === 0){
    //             cur_page = 1;
    //         }
    //         var start = ( cur_page - 1 ) * limit;
    //         var end = cur_page * limit - 1;
    //         var cnt = arr.slice(start, end);
    //         for(var i = 0; i < cnt.length ; i++){
    //             delete cnt[i].content;
    //             cnt[i].format = moment(cnt[i].created).format("YYYY-MM-DD HH:mm:ss");
    //         }
    //     }
    //     res.render("message", {
    //         "title": "留言板",
    //         "user": user,
    //         "message" : cnt,
    //         "action" : "message",
    //         "total" : len,
    //         "cur_page" : cur_page,
    //         "limit" : limit
    //     });
    // });
});


router.post("/", function(req, res) {
    var user = res.locals.user;
    var json = req.body;
    if( typeof(user) !== "object" ){
        res.status(401).send("no authoriation");
        return;
    }
    if (!json.content) {
        res.status(400).send({ error: '1', description: "elements are not enough" });
        return;
    }
    var myHandler = handlers.messageModel;
    var temp = new myHandler({ "author": user.username, "content": json.content, "tags": json.tags });
    temp.save(function(err, data) {
        if (err) {
            res.status(500).send("can't connect to server");
        } else {
            res.status(200).send({ 'success': '1' });
        }
    });
});

router.put("/", function(req, res) {
    var user = res.locals.user;
    var json = req.body;
    if( typeof(user) !== "object" ){
        res.status(401).send("no authoriation");
        return;
    }
    if(json._id.length === 0 ){
        res.status(400).send({"error" : 1, "description" : "_id is required"});
        return;
    }
    if ( json.opinion !== 1 && json.opinion !== 0 ) {
        res.status(400).send({"error" : 2, "description" : "opinion not allowed"});
        return;
    }
    if ( json.action !== 1 && json.action !== 0 ) {
        res.status(400).send({"error" : 3, "description" : "action not allowed"});
        return;
    }
    var myHandler = handlers.messageModel;
    myHandler.findOne({_id : json._id}, function(err, data) {
        if (err) {
            res.status(500).send("can't connect to server");
        } else {
            if(data){
                if(json.opinion === 1){
                    var temp = ([]).concat(data.favor);
                    var index = temp.indexOf( user.username );
                    if(json.action === 1){
                        if( index === -1 ){
                            temp.push( user.username );
                        }
                    }else{
                        if( index > -1 ){
                            temp.splice( index, 1 );
                        }
                    }
                    action = { favor : temp };
                }else{
                    var temp = ([]).concat(data.opposition);
                    var index = temp.indexOf( user.username );
                    if(json.action === 1){
                        if( index === -1 ){
                            temp.push( user.username );
                        }
                    }else{
                        if( index > -1 ){
                            temp.splice( index, 1 );
                        }
                    }
                    action = { opposition : temp };
                }
                
                data.update( action,function(err, result){
                    if (err) {
                        res.status(500).send("can't connect to server");
                    }else{
                        res.status(200).send({"success" : 1, "length" : temp.length});
                    }
               });
            }else{
                res.status(400).send({ 'error': '4', "description":"this _id is not avialible" });
            }
        }
    });
});

//留言板
exports.start = router;
