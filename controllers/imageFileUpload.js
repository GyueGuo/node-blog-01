var fs = require("fs");
var path = require('path');
var express = require("express");
var busboy = require('busboy');


var router = express.Router();

router.post("/", function(req, res){
	console.log(req.body)
	return;
});



exports.start = router;