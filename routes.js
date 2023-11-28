var express = require('express');
var router = express.Router();
var bookshelves = require('./public/initialstate.json')
let id_is_there = false;

router.get('/', (req, res, next) => {
    res.render('entrance', {title: 'Библиотека'});
});

router.get('/library', (req, res, next) => {
    res.render('library', {title: 'Книжные полки', bookshelves: bookshelves, id_is_there: id_is_there});
    id_is_there = false;
});

router.get('/book/:num', (req, res, next) => {
    const id = req.params.num;
    if (id === 'filter_all') {
        let books_all = [];
        for (let book of bookshelves) books_all.push(book.id);
        res.end(JSON.stringify(books_all));
        return;
    }

    if (id === 'filter_in') {
        let books_taken = [];
        for (let book of bookshelves)
            if (book.status === "Нет") books_taken.push(book.id);
        res.end(JSON.stringify(books_taken));
        return;
    }

    if (id === 'filter_taken') {
        let books_in = [];
        let today_date = new Date();
        for (let book of bookshelves) {
            let date_return_book = new Date(book.date_of_return);
            date_return_book.setDate(date_return_book.getDate() + 1);
            if (today_date < date_return_book || book.status === "Да")
                books_in.push(book.id);
        }
        res.end(JSON.stringify(books_in));
        return;
    }
    for (let book of bookshelves) {
        if (book.id == id) {
            res.render('book', {title: 'Книга', id: `${book.id}`, name: `${book.name}`, author: `${book.author}`,
                date_of_publication: `${book.date_of_publication}`, status: `${book.status}`, reader: `${book.reader}`,
                date_of_return: `${book.date_of_return}`});
            return;
        }
    }
});

router.post('/add', (req, res, next) => {
    for (let book of bookshelves) {
        if (book.id == req.body.id) {
            id_is_there = true;
            res.redirect('/library');
            return;
        }
    }
    bookshelves.push({"id": req.body.id, "name": req.body.name, "author": req.body.author, "date_of_publication": req.body.date_of_publication,
        "status": "Да", "reader": "-", "date_of_return": "-"});
    //console.log(bookshelves);
    res.redirect('/library');
});

router.post('/book/:num', (req, res, next) => {
    let id = req.params.num;
    for (let i = 0; i < bookshelves.length; i++) {
        if (bookshelves[i].id == id) {
            bookshelves.splice(i, 1);
            res.redirect('/library');
        }
    }
});

router.post('/book/edit/:num', (req, res, next) => {
    let id = req.params.num;
    for (let book of bookshelves) {
        if (book.id == id) {
            if (req.body.name) book.name = req.body.name;
            if (req.body.author) book.author = req.body.author;
            if (req.body.date_of_publication) book.date_of_publication = req.body.date_of_publication;
        }
    }
    res.redirect('/library');
});

router.post('/book/reader/:num', (req, res, next) => {
    let id = req.params.num;
    for (let book of bookshelves) {
        if (book.id == id) {
            book.status = "Нет";
            book.reader = req.body.name;
            book.date_of_return = req.body.date_of_return;
        }
    }
    res.redirect('/library');
});

router.post('/book/return/:num', (req, res, next) => {
    let id = req.params.num;
    for (let book of bookshelves) {
        if (book.id == id) {
            book.status = "Да";
            book.reader = "-";
            book.date_of_return = "-";
        }
    }
    res.redirect('/library');
});

router.get("*", (req, res) => {
    res.status(404);
    res.end("Page not found");
})
module.exports = router;
