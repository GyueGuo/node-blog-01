var fs = require("fs");
var express = require("express");

var router = express.Router();

var base64 = function(imageData,res){
	var name = "./temp/G" + (new Date()).getTime() +".png";
	imageData = decodeURIComponent(imageData);
	var base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
	for (var i = 0; i < base64Data.length; ++i) {
	    if (base64Data[i] < 0) {// 调整异常数据
	        base64Data[i] += 256;
	    }
	}
	var dataBuffer = new Buffer(base64Data, 'base64');
	fs.writeFile(name, dataBuffer, function(err) {
	    if(err){
			res.status(500).send("can't connect to server");
	    }else{
			res.status(200).send( {url : name.slice(1)} );
	    }
	});
};

router.post("/", function(req, res){
    var datas = req.body;
    if(!("type" in datas) || !("data" in datas)){
    	res.status(400).send({error : "1", description : 'elements are not enough' }); //帐号密码不匹配
		return;
	}
	if(datas.type === "base64" && ("data" in datas) && datas.data.length >0 ){
		base64( datas.data, res );
	}
});



exports.start = router;