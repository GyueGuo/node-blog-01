var WebSocketServer = require('ws').Server;
var handlers = require("./dbHandler").handlers;
var hander = handlers.userModel;

var wss = new WebSocketServer({
    port: 8181, //监听接口
    verifyClient: socketVerify //可选，验证连接函数
});

var sswPool = [];

//连接请求验证
function socketVerify(info) {
    var origin = info.origin.match(/^(:?.+\:\/\/)([^\/]+)/);
    if ( origin.length >= 3 && ( origin[2] === "117.18.0.8" || origin[2].match("localhost") ) ) {
		return true; //如果是来自blog.luojia.me的连接，就接受
    }  else {
    	return false; //否则拒绝
    }
}
//时间转换
function convert(num){
    var str = "";
    if(num<10){
        str = "0"+num.toString();
    }else{
        str = num.toString();
    }
    return str;
}
//消息推送
function postMessage(ws, jsonStr) {
    var obj = JSON.parse( jsonStr );
    var token = ws.upgradeReq.headers.cookie.match(/Gtoken=([^;$]+)/);
    if ( !obj.msg || !token ) {
        return;
    }
    token =  token[1];
    hander.findOne({ "token": token }, function(err, data) {
        if( data ){
            var i = 0, n = sswPool.length;
            var now = new Date();
            var json = {
                type : 2,
                nick : data.nick,
                msg : obj.msg,
                date : ( now.getFullYear().toString() +"-"+ convert(now.getMonth()+1) +"-"+ convert(now.getDate()) +" " + convert(now.getHours()) + ":" + convert(now.getMinutes()) + ":" + convert(now.getSeconds()) )
            };
            json = JSON.stringify(json);
            sswPool.forEach(function(obj){
                obj.send( json );
            });
        }
    });
}
//新加入通知
function newParticipant(token, ws){
    hander.findOne({ "token": token }, function(err, data) {
        if( data ){
            ws.nick = data.nick;
            var json = {
                type : 1,
                msg : data.nick+"加入聊天，当前在线人数：" + sswPool.length
            };
            json = JSON.stringify(json);
            sswPool.forEach(function(obj){
                obj.send( json );
            });
        }
    });
}
//退出广播
function logout(){
    var i = 0, n = sswPool.length, temp, that = this;
    var now = new Date();
    var json = {
        type : 0,
        msg : that.nick+"退出聊天",
    };
    json = JSON.stringify(json);
    sswPool.forEach(function(obj, i){
        if ( that === obj){
            sswPool.splice( i, 1 );
        } else {
            obj.send( json );
        }
    });
}
// 初始化  
wss.on('connection', function(ws) {
    var cookie = ws.upgradeReq.headers.cookie;
    if( !cookie || !cookie.match("Gtoken=")){
        return;
    }
    sswPool.push( ws );
    // 发送消息
    ws.on('message', function(jsonStr){
        postMessage(this, jsonStr)
    });
    // 退出聊天  
    ws.on('close', logout); 
    newParticipant( cookie.match(/Gtoken=([^;$]+)/)[1], ws );
});