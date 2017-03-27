var express = require("express");
var uuid = require("node-uuid");
var md5  = require("./md5").md5;
var handlers = require("./dbHandler").handlers;

var router = express.Router();

router.get("/", function(req, res){
	var user = res.locals.user;
    if (typeof(user) !== "object") {
        res.redirect(301, "login");
    } else {
        res.render("setting", {
            "title": "个人设置",
            "user": user,
            "action" : "setting"
        });
    }
});

router.put("/", function(req, res){
	var user = res.locals.user;
    var datas = req.body;
	var _token = user.token || datas.token;
	if ( _token.length === 0 ) {
        res.status(401).send("no authorization");
        return;
    }
	if( !datas.nick || !datas.portrait ){
		res.status(400).send({"error" : '1', "description" : "elements are not enough"});//缺少参数
		return;
	}
	var myHandler = handlers.userModel;
	myHandler.findOne({ "token" : _token }, function(err, doc){
		if( err ){
			res.status(500).send("can't connect to server");
		}else{
			if( doc ){
				myHandler.findOne({ "nick" : decodeURIComponent(datas.nick) }, function(err, user){
					if(err){
						res.status(500).send("can't connect to server");
					}else{
						if(user && (user.nick === datas.nick) &&( user.token === _token )){
							return;
						}
						doc.update( {"portrait" : decodeURIComponent(datas.portrait), "nick" :decodeURIComponent(datas.nick)}, function(err, data){
						if( err ){
							res.status(500).send("can't connect to server");
						}else{
							res.status(200).send({"success" : '1'});
						}
					});
					}
				});
			}else{
       			res.status(401).send("no authorization");
			}
		}
	});
});


//用户设置
exports.start = router;