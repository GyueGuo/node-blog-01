var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
var db = mongoose.connect("mongodb://root:gjy547773673@localhost:27017/node_01");
// var db = mongoose.connect("mongodb://localhost:27017/MyPersonalDB");

/*用户骨架、涉及用户查询的操作*/
var userSchema = new mongoose.Schema({
	"username" : { type: String, default:"" },
	"password" : { type: String, default:"" },
	"portrait" : { type: String, default:"" },
	"nick" : { type: String, default:"" },
	"created" : { type: Date, default: Date.now },
	"token" : { type: String, default:"" },
	"last_login" : { type: Date, default: Date.now },
	"token" : { type: String, default:"" }
});
/*用户模型*/
var userModel = mongoose.model("users",userSchema);



/*文章骨架*/
var articleSchema = new mongoose.Schema({
	"author" : { type: String, default:"" },
	"title" : { type: String, default:"" },
	"content" : { type: String, default:"" },
	"cover" : {type : Array, default : []},
	"view" : {type : Number ,default : 0},
	"created" : { type: Date, default: Date.now },
	"status" : {type : Number ,default : 0} // 0待审核, 1已通过, 2未通过
});
/*登录模型*/
var articleModel = mongoose.model("articles",articleSchema);

/*通知骨架*/
var noticeSchema = new mongoose.Schema({
	"content" : { type: String, default:"" },
	"created" : { type: Date, default: Date.now },
	"owener" : { type: String, default:"" }
});
/*通知模型*/
var noticeModel = mongoose.model("notice",noticeSchema);

/*留言板骨架*/
var messageSchema = new mongoose.Schema({
	"content" : { type: String, default:"" },
	"created" : { type: Date, default: Date.now },
	"author" : { type: String, default:"" },
	"tags" : { type : Array, default : [] },
	"opposition" : {type : Array, default : [] },
	"favor" : {type : Array, default : [] },
	"status" : { type : Number ,default : 0 } // 0待审核, 1已通过, 2未通过
});
/*留言板模型*/
var messageModel = mongoose.model("message",messageSchema);

exports.handlers = {
	"userModel" : userModel,
	"articleModel" : articleModel,
	"noticeModel" : noticeModel,
	"messageModel" : messageModel
};
exports.db = db;
