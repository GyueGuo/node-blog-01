var express = require("express");

var router = express.Router();

router.get("/", function(req, res) {
    var user = res.locals.user;
    if ( typeof(user) !== "object" ) {
        res.redirect(301, "login");
    } else {
        res.render("websocket", {
            "title": "聊天室",
            "user": user,
            "action" : "websocket"
        });
    }
});

//消息通知
exports.start = router;
