const express = require('express')
const fs = require('fs')
const router = express()
const url = require('url')


router.use('/public', express.static('public'))

// router.post('/' (req, res) => )

router.get('/', (req, res)=>{
    res.render('authorization', {title: 'Library'})
})



// router.get('/', (req, res)=>{
//     let obj = url.parse(req.url, true).query
//
//     if (obj.id === 'stock') {
//         if (obj.state === 'true') {
//             res.end(JSON.stringify(db.filter(book => book.inLibrary === 'yes')))
//             return;
//         }
//         res.end(JSON.stringify(db))
//         return;
//     }
//
//     if (obj.id === 'returnDate') {
//         if (obj.state === 'true') {
//             res.end(JSON.stringify(db.filter(book => book.inLibrary === 'no' &&
//                 new Date(book.returnDate + 'T23:59:59.999Z') <= new Date())))
//             return;
//         }
//         res.end(JSON.stringify(db))
//         return;
//     }
//
//     res.render('authorization', {title: 'Library', books: db})
// })
//
// router.post('/book/:num([0-9]{1,})', (req, res)=>{
//     let id = req.params.num
//     db.forEach((v, i) => {
//         if (v.id == id) {
//             db.splice(i, 1)
//             res.redirect('/')
//         }
//     });
// })
//
// router.get('/book/:num([0-9]{1,})', (req, res)=>{
//     let id = req.params.num
//     for (let item of db){
//         if (item.id == id) {
//             res.render('book', {
//                 title: 'Library',
//                 id: `${item.id}`,
//                 name: `${item.name}`,
//                 author: `${item.author}`,
//                 year: `${item.year}`,
//                 inLibrary: `${item.inLibrary}`,
//                 briefly: `${item.briefly}`,
//                 reader: `${item.reader}`,
//                 returnDate: `${item.returnDate}`
//             });
//             return;
//         }
//     }
// })
//
// router.post('/book/reader/:num([0-9]{1,})', (req, res) => {
//     let id = req.params.num
//     for (let item of db) {
//         if (item.id == id) {
//             item.reader = req.body.name
//             item.returnDate = req.body.year
//             item.inLibrary = "no"
//         }
//     }
//     res.redirect('/')
// });
//
// router.post('/book/backBook/:num([0-9]{1,})', (req, res, next) => {
//     let id = req.params.num
//     for (let item of db)
//         if (item.id == id) {
//             item.reader = ""
//             item.returnDate = ""
//             item.inLibrary = "yes"
//         }
//     res.redirect('/')
// });
//
// router.post('/book/edit/:num([0-9]{1,})', (req, res) => {
//     let id = req.params.num
//     for (let item of db)
//         if (item.id == id) {
//             if (req.body.name)
//                 item.name = req.body.name
//             if (req.body.author)
//                 item.author = req.body.author
//             if (req.body.year)
//                 item.year = req.body.year
//             if (req.body.briefly)
//                 item.briefly = req.body.briefly
//         }
//     res.redirect('/')
// })
//
// router.post("/addBook", (req, res) => {
//     db.push({
//         "id": idInd,
//         "name": req.body.name,
//         "author": req.body.author,
//         "year": req.body.year,
//         "briefly": req.body.briefly,
//         "inLibrary": "yes",
//         "reader": "",
//         "returnDate": ""
//
//     });
//     idInd += 1
//     res.redirect('/');
// })

router.get("*", (req, res) => {
    res.status(404)
    res.end("Page not found")
})

module.exports = router