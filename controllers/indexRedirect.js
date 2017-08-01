let router = require("express").Router();

router.get("/", function(req, res) {
    res.redirect(302, '/index')
});

exports.start = router;