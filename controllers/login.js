var express = require("express");
var uuid = require("node-uuid");
var md5  = require("./md5").md5;
var handlers = require("./dbHandler").handlers;

var router = express.Router();


router.get("/", function(req, res){
	var user = res.locals.user;
	if( typeof(user) === "object"){
		res.redirect( 301,  "/setting");
		return;
	} else {
		res.render( "login&register", {
			"title" : "登录",
			"user" : user,
			"action" : "login"
		});
	}
});

router.post("/", function(req, res){
	var json = req.body;
	if(!json.username || !json.password){
		res.status(400).send({ error: '1', description: "elements are not enough" });
        return;
	}
	var myHandler = handlers.userModel;
	var _pwd = md5(json.password);
	myHandler.findOne({ "username" : json.username }, function(err, doc){
		if( err ){
			res.status(500).send("can't connect to server");
		}else{
			if( !doc ){
				res.status(400).send({error : "2", description : 'this user is not existed' });
			}else{
				if(doc.password === _pwd){
					doc.update({last_login : Date.now() });
					if(!("nick" in doc) || (doc.nick.length === 0)){
						res.status(200).send({'success' : '2',"token":doc.token}); //没有昵称
					}else{
						res.status(200).send({'success' : '1',"token":doc.token}); 
					}
				}else{
					res.status(400).send({error : "3", description : 'account password is not matching' }); //帐号密码不匹配
				}
			}
		}
	});
});

exports.start = router;