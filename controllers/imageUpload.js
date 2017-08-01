var fs = require("fs");
var express = require("express");
var qn = require("./qiniu").client;

var router = express.Router();

var base64 = function(imageData,res){
	var name = "./temp/G" + (new Date()).getTime() +".png",
		i = 0;
	imageData = decodeURIComponent(imageData);
	var base64Data = imageData.replace(/^data:image\/\w+;base64,/, ""),
		n = base64Data.length,
		temp;
	for ( ; i < n; ++i) {
		temp = base64Data[i];
	    if ( temp < 0) {  // 调整异常数据
			temp += 256;
	    }
	}
	var dataBuffer = new Buffer(base64Data, 'base64');
	fs.writeFile(name, dataBuffer, function(err) {
	    if(err){
			res.status(500).send("can't connect to server");
	    }else{
	    	qn.uploadFile( name, {key: (new Date().getTime().toString() +".png")}, function (err, result) {
				if(err){
					res.status(500).send("can't connect to server");
				}else{
					res.status(200).send( {url : result.url} );
					fs.unlink(name);
				}
			});
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