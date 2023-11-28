var express = require('express');
const path = require("path");
var router = express.Router();

router.use("/public", express.static(path.join(__dirname + '/public')));

router.get('/', (req, res, next) => {
    res.render('authorization', {title: 'Библиотека'});
});




router.get("*", (req, res) => {
    res.status(404)
    res.end("Page not found")
})

module.exports = router