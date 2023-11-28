var express = require('express');
var router = express.Router();

router.use('/public', express.static('public'))


router.get('/', (req, res, next) => {
    res.render('authorization', {title: 'Библиотека'});
});




router.get("*", (req, res) => {
    res.status(404)
    res.end("Page not found")
})

module.exports = router