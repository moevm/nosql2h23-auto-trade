var express = require('express');
const path = require("path");
const {ObjectId, BSON} = require("mongodb");
const fs = require("fs");
var router = express.Router();
var url = "mongodb://localhost:27017/";
var backup_path = "backup.bson"
const docker_status = false;
if (docker_status) {
    url = "mongodb://mongo:27017/";
    backup_path = "data/db/backup.bson"
}
let data_filters;
let data_ads;
let page = 1;
let page_filter = 0;
let index_low;
let index_high;
let index_low_filter;
let index_high_filter;
let pages_filter;

const MongoClient = require("mongodb").MongoClient;
const name_db = 'autotrade';
const name_collection = 'users';

router.use("/public", express.static(path.join(__dirname + '/public')));

router.get('/', (req, res, next) => {
    res.render('authorization', {title: 'Авторизация'});
});

router.get("/create_advertisment", (req, res) => {
    res.render("create_advt", {title: 'Добавление'})
})

router.post('/mainauth', (req, res) => {
    if(!req.body) return res.sendStatus(400);
    // const MongoClient = require("mongodb").MongoClient;
//     const url = "mongodb://localhost:27017/";
    console.log("Main auth!")
    // const name_db = 'autotrade';
    // const name_collection = 'users';
    async function authCheck() {
       const mongoClient = new MongoClient(url);
       try {
           console.log("auth check");
           await mongoClient.connect();
           const db = mongoClient.db(name_db);
           const collection = db.collection(name_collection);

           data = await collection.find({}).toArray();
           // console.log(data)
           count = 0;
           for (let i=0; i<data.length;i++){
               if (req.body.login == data[i].login && req.body.password == data[i].password){
                   console.log(data[i].login, data[i].password);
                   console.log('login and password ok')
                   req.session._id = data[i]._id
                   req.session.status = data[i].user_status
                   // res.redirect('/main');
                   // console.log('-------------------------------------------');
                   // console.log(data[0].name);
                   // console.log('-------------------------------------------');

                   // data1 = await collection.find({}).project({ _id : 0, ads : 1 }).toArray();
                   // console.log("Data1");
                   // console.log(data1[0].ads[0].brand);
                   // res.redirect('/create_advertisment')
                   console.log(req.session.status)
                   // res.render('main-menu', {title: 'Главная', adds: data1, status: req.session.status});
                   res.redirect('/main');
                   break;
               }
               else {
                   count = count + 1;
//                    console.log("Yes");
                   if (count == data.length) res.redirect('back');
               }
           }
       } catch (error) {
           console.error('An error has occurred:', error);
       } finally {
           await mongoClient.close();
       }
   }
   authCheck();
    // console.log(req.body);
//     res.send(`${req.body.login} - ${req.body.password}`);
})

router.get('/main', (req, res) => {
    // const MongoClient = require("mongodb").MongoClient;
//     const url = "mongodb://localhost:27017/";
    console.log("Main!")
    // const name_db = 'autotrade';
    // const name_collection = 'users';
    async function mainRender() {
        const mongoClient = new MongoClient(url);
        try {
            console.log("main render");
            await mongoClient.connect();
            const db = mongoClient.db(name_db);
            const collection = db.collection(name_collection);

            let query = [];
            query.push({$eq: [ '$$ad.status', 'Опубликовано' ]})
            // data1 = await collection.find({ ads : { status: "Опубликовано" } }).project({ _id : 0, ads : 1 }).toArray();
            data1 = await collection.aggregate([{
                $project: {
                    "ads": {
                        $filter: {
                            input: "$ads",
                            as: "ad",
                            cond: {
                                "$and" : query
                            }
                        }
                    }
                }
            }]).project({ _id : 0, ads : 1 }).toArray();
            data1 = data1.reduce((temp, curr) => {
                if (curr.ads.length > 0) {
                    temp = temp.concat(curr.ads);
                }
                return temp;
            }, []);

            // page = 1;
            let count = data1.length

            let pages = Math.ceil(count / 6)
            if (pages == 0) pages = 1

            let index_low = 0
            let index_high = 6

            if (req.body.left == '' && page - 1 > 0) {
                page -= 1
                index_low = 6 * (page - 1)
                index_high = count }

            if (req.body.right == '' && page + 1 <= pages) {
                page += 1
                index_low = 6 * (page - 1)
                index_high = index_low + 6 }

            if (req.body.left != '' && req.body.right != '') {
                console.log('main page')
                page = 1
                page_filter = 0
                index_low_filter = 0
                index_high_filter = 6}
            console.log(count, pages, page)
            console.log(index_low, index_high)
            // console.log(data1.length)
            // console.log(data1)
            // res.redirect('/create_advertisment')
            data = [
                "Марка",
                "Модель",
                "Год",
                "Цвет",
                "Кузов",
                "Пробег",
                "Двигатель",
                "Коробка",
                "Привод",
                "Руль"
            ]
            // console.log("1")
            //console.log(data1)
            res.render('main-menu', {title: 'Главная', adds: data1.slice(index_low, index_high), status: req.session.status, filter_data: data, page: page, pages: pages, url: '/main'});
            // res.render('my-acc', {title: 'Главная', adds: data1.slice(index_low, index_high), status: req.session.status, filter_data: data, page: page, pages: pages, url: '/main'});
            // res.render('user-page', {title: 'Главная', adds: data1.slice(index_low, index_high), status: req.session.status, filter_data: data, page: page, pages: pages, url: '/main'});
            // res.render('my-messages', {title: 'Главная', adds: data1.slice(index_low, index_high), status: req.session.status, filter_data: data, page: page, pages: pages, url: '/main'});
        } catch (error) {
            console.error('An error has occurred:', error);
        } finally {
            await mongoClient.close();
        }
    }
    mainRender();
    // console.log(req.body);
//     res.send(`${req.body.login} - ${req.body.password}`);
})

router.post('/main', (req, res) => {
    // const MongoClient = require("mongodb").MongoClient;
//     const url = "mongodb://localhost:27017/";
    console.log("Main page!")
    // const name_db = 'autotrade';
    // const name_collection = 'users';
    async function mainRender() {
        const mongoClient = new MongoClient(url);
        try {
            console.log("main page");
            await mongoClient.connect();
            const db = mongoClient.db(name_db);
            const collection = db.collection(name_collection);

            let query = [];
            query.push({$eq: [ '$$ad.status', 'Опубликовано' ]})
            // data1 = await collection.find({ ads : { status: "Опубликовано" } }).project({ _id : 0, ads : 1 }).toArray();
            data_main = await collection.aggregate([{
                $project: {
                    "ads": {
                        $filter: {
                            input: "$ads",
                            as: "ad",
                            cond: {
                                "$and" : query
                            }
                        }
                    }
                }
            }]).project({ _id : 0, ads : 1 }).toArray();
            data_main = data_main.reduce((temp, curr) => {
                if (curr.ads.length > 0) {
                    temp = temp.concat(curr.ads);
                }
                return temp;
            }, []);

            // page = 1;
            let count = data_main.length

            let pages = Math.ceil(count / 6)
            if (pages == 0) pages = 1

            console.log(req.body)
            if (req.body.left == '' && page - 1 > 0) {
                page -= 1
                index_low = 6 * (page - 1)
                index_high = index_low + 6 }

            if (req.body.right == '' && page + 1 <= pages) {
                page += 1
                index_low = 6 * (page - 1)
                index_high = index_low + 6 }

            if (req.body.left != '' && req.body.right != '') {
                console.log('main page')
                page = 1 }
            console.log(count, pages, page)
            console.log(index_low, index_high)
            // console.log(data_main.length)
            // console.log(data_main)
            // res.redirect('/create_advertisment')
            data = [
                "Марка",
                "Модель",
                "Год",
                "Цвет",
                "Кузов",
                "Пробег",
                "Двигатель",
                "Коробка",
                "Привод",
                "Руль"
            ]
            // console.log("1")
            // console.log(data)
            res.render('main-menu', {title: 'Главная', adds: data_main.slice(index_low, index_high), status: req.session.status, filter_data: data, page: page, pages: pages, url: '/main'});
        } catch (error) {
            console.error('An error has occurred:', error);
        } finally {
            await mongoClient.close();
        }
    }
    mainRender();
    // console.log(req.body);
//     res.send(`${req.body.login} - ${req.body.password}`);
})

router.post('/maincreate', (req, res) => {
    if(!req.body) return res.sendStatus(400);
    // const MongoClient = require("mongodb").MongoClient;
//     const url = "mongodb://localhost:27017/";
    console.log("Main create!")
    // const name_db = 'autotrade';
    // const name_collection = 'users';
    async function adCreate() {
       const mongoClient = new MongoClient(url);
       try {
           console.log("ad create");
           await mongoClient.connect();
           const db = mongoClient.db(name_db);
           const collection = db.collection(name_collection);
           data = await collection.find({}).toArray();
           // console.log(data)
           // const { ObjectId } = require('mongodb');
           let today_date = new Date();
           let date = ("0" + today_date.getDate()).slice(-2);
           let month = ("0" + (today_date.getMonth() + 1)).slice(-2);
           let year = today_date.getFullYear();
           let hours = today_date.getHours();
           let minutes = today_date.getMinutes();
           let seconds = today_date.getSeconds();
           let create_date = year + "-" + month + "-" + date;
           let create_date_message = year + "-" + month + "-" + date + "T" + hours + ":" + minutes + ":" + seconds + "Z";
           console.log(create_date);
           console.log(create_date_message);
           const newData = {
               ad_id: new ObjectId(),
               photo: '/cars_photos/sellBestCarEver.jpg',
               brand: req.body.brand,
               model: req.body.model,
               year: Number(req.body.year),
               color: req.body.color,
               body: req.body.body,
               mileage: Number(req.body.mileage),
               engine: req.body.engine,
               transmission: req.body.transmission,
               drive: req.body.drive,
               helm: req.body.helm,
               price: Number(req.body.price),
               create_date: create_date,
               edit_date: null,
               view: 0,
               status: 'Проверка'
           };
           // console.log(newData)
           // console.log(req.session._id)
           const data1 = await collection.updateOne({ _id: new ObjectId(req.session._id)}, {$push: { ads: newData }},
            (updateErr, result) => {
            if (updateErr) throw updateErr;
            console.log(`Документ с id ${newData.ad_id} обновлен`);
            client.close();
           });
           // console.log(data1)
           // data2 = await collection.find({}).project({ _id : 0, ads : 1 }).toArray();
           res.redirect('/main')
       } catch (error) {
           console.error('An error has occurred:', error);
       } finally {
           await mongoClient.close();
       }
    }
    adCreate();
    // console.log(req.body);
    // res.render('main-menu', {title: 'Главная', adds: data});
//     res.send(`${req.body.login} - ${req.body.password}`);
})

router.get('/mainfilter', (req, res) => {
    // const MongoClient = require("mongodb").MongoClient;
//     const url = "mongodb://localhost:27017/";
    console.log("Main filter page!")
    res.render('main-menu', {title: 'Главная', adds: data_ads.slice(index_low_filter, index_high_filter), status: req.session.status, filter_data: data_filters, page: page_filter, pages: pages_filter, url: '/mainfilter'});
    // console.log(req.body);
//     res.send(`${req.body.login} - ${req.body.password}`);
})

router.post('/mainfilter', (req, res) => {
    // if(!req.body) return res.sendStatus(400);
    // const MongoClient = require("mongodb").MongoClient;
//     const url = "mongodb://localhost:27017/";
    console.log("Main filter!")
    // const name_db = 'autotrade';
    // const name_collection = 'users';
    async function mainFilter() {
        const mongoClient = new MongoClient(url);
        try {
            console.log("main filter");
            if (req.body.submit == '') {
                await mongoClient.connect();
                const db = mongoClient.db(name_db);
                const collection = db.collection(name_collection);
                // console.log(req.body)
                let query = [];
                if (req.body.filter_brand !== "Марка") {
                    query.push({$eq: ['$$ad.brand', req.body.filter_brand]})
                }
                if (req.body.filter_model !== "Модель") {
                    query.push({$eq: ['$$ad.model', req.body.filter_model]})
                }
                if (req.body.filter_year != "") {
                    query.push({$eq: ['$$ad.year', Number(req.body.filter_year)]})
                }
                if (req.body.filter_color !== "Цвет") {
                    query.push({$eq: ['$$ad.color', req.body.filter_color.toLowerCase()]})
                }
                if (req.body.filter_body !== "Кузов") {
                    query.push({$eq: ['$$ad.body', req.body.filter_body.toLowerCase()]})
                }
                if (req.body.filter_mileage != "") {
                    query.push({$eq: ['$$ad.mileage', Number(req.body.filter_mileage)]})
                }
                if (req.body.filter_engine !== "Двигатель") {
                    query.push({$eq: ['$$ad.engine', req.body.filter_engine.toLowerCase()]})
                }
                if (req.body.filter_transmission !== "Коробка") {
                    query.push({$eq: ['$$ad.transmission', req.body.filter_transmission.toLowerCase()]})
                }
                if (req.body.filter_drive !== "Привод") {
                    query.push({$eq: ['$$ad.drive', req.body.filter_drive.toLowerCase()]})
                }
                if (req.body.filter_helm !== "Руль") {
                    query.push({$eq: ['$$ad.helm', req.body.filter_helm.toLowerCase()]})
                }
                query.push({$eq: ['$$ad.status', 'Опубликовано']})

                let filter_year_box;
                if (req.body.filter_year !== 'Год') filter_year_box = 'Год ' + req.body.filter_year;
                else filter_year_box = req.body.filter_year;
                let filter_mileage_box;
                if (req.body.filter_mileage !== 'Пробег') filter_mileage_box = 'Пробег ' + req.body.filter_mileage;
                else filter_mileage_box = req.body.filter_mileage;

                data_filters = [
                    req.body.filter_brand,
                    req.body.filter_model,
                    filter_year_box,
                    req.body.filter_color,
                    req.body.filter_body,
                    filter_mileage_box,
                    req.body.filter_engine,
                    req.body.filter_transmission,
                    req.body.filter_drive,
                    req.body.filter_helm
                ]
                // console.log("2")
                // console.log(data_filters)
                data_ads = await collection.aggregate([{
                    $project: {
                        "ads": {
                            $filter: {
                                input: "$ads",
                                as: "ad",
                                cond: {
                                    "$and": query
                                }
                            }
                        }
                    }
                }]).project({_id: 0, ads: 1}).toArray();
                data_ads = data_ads.reduce((temp, curr) => {
                    if (curr.ads.length > 0) {
                        temp = temp.concat(curr.ads);
                    }
                    return temp;
                }, []);

                page_filter += 1
            }
            // console.log(page_filter)
            // console.log(data_ads, data_filters)
            console.log(req.body)
            let count = data_ads.length

            pages_filter = Math.ceil(count / 6)
            if (pages_filter == 0) pages_filter = 1

            if (page_filter != pages_filter) {
            index_low_filter = 0
            index_high_filter = 6 }

            if (req.body.left == '' && page_filter - 1 > 0) {
                page_filter -= 1
                index_low_filter = 6 * (page_filter - 1)
                index_high_filter = index_low_filter + 6 }

            if (req.body.right == '' && page_filter + 1 <= pages_filter) {
                page_filter += 1
                index_low_filter = 6 * (page_filter - 1)
                index_high_filter = index_low_filter + 6 }

            if (req.body.left != '' && req.body.right != '') {
                console.log('main filter page')
                page_filter = 1 }
            console.log('main filter page log')
            console.log(count, pages_filter, page_filter)
            console.log(index_low_filter, index_high_filter)
            res.redirect('/mainfilter')
            // console.log(query)
            // console.log(data_ads)
            // return res.send(data1)
        } catch (error) {
            console.error('An error has occurred:', error);
        } finally {
            await mongoClient.close();
        }
    }
    mainFilter();
//     res.send(`${req.body.login} - ${req.body.password}`);
})

// router.post('/mainpage', (req, res) => {
//     if(!req.body) return res.sendStatus(400);
// // const MongoClient = require("mongodb").MongoClient;
// // const url = "mongodb://localhost:27017/";
//     console.log("Main page!")
// // const name_db = 'autotrade';
// // const name_collection = 'users';
//     async function changePage() {
//         const mongoClient = new MongoClient(url);
//         try {
//             console.log("change page");
//             await mongoClient.connect();
//             const db = mongoClient.db(name_db);
//             const collection = db.collection(name_collection);
//             data2 = await collection.find({}).project({ _id : 0, ads : 1 }).toArray();
//             data2 = data2.reduce((temp, curr) => {
//                 if (curr.ads.length > 0) {
//                     temp = temp.concat(curr.ads);
//                 }
//                 return temp;
//             }, []);
//
//             let count = data2.length
//
//             let pages = Math.ceil(count / 6)
//
//             let index_low = 0
//             let index_high = 6
//
//             if (req.body.left == '' && page - 1 > 0) {
//                 page -= 1
//                 index_low = 6 * (page - 1)
//                 index_high = count }
//
//             if (req.body.right == '' && page + 1 <= pages) {
//                 page += 1
//                 index_low = 6 * (page - 1)
//                 index_high = index_low + 6 }
//             console.log(count, pages, page)
//             console.log(index_low, index_high)
//             res.render('main-menu', {title: 'Главная', adds: data2.slice(index_low, index_high), status: req.session.status, filter_data: data, page: page});
//         } catch (error) {
//             console.error('An error has occurred:', error);
//         } finally {
//             await mongoClient.close();
//         }
//     }
//     changePage();
// // console.log(req.body);
// // res.render('main-menu', {title: 'Главная', adds: data});
// // res.send(`${req.body.login} - ${req.body.password}`);
// })

router.get("/admin", (req, res) => {
    res.render('admin');
})

router.get("/adminexport", (req, res) => {
    async function exportDatabase() {
        const mongoClient = new MongoClient(url);
        try {
            console.log("Imhereexport");
            await mongoClient.connect();
            const db = mongoClient.db(name_db);
            const collection = db.collection(name_collection);

            data = await collection.find({}).toArray();
            const wrappedData = { arrayData: data };
            const BSONData = BSON.serialize(wrappedData);

            fs.writeFileSync(backup_path, BSONData);
            console.log('Данные успешно записаны в backup.bson');
        } catch (error) {
            console.error('An error has occurred:', error);
        } finally {
            await mongoClient.close();
        }
    }
    exportDatabase().then(r => {});
    res.redirect('/admin');
})

router.get("/adminimport", (req, res) => {
    async function importDatabase() {
        const mongoClient = new MongoClient(url);
        try {
            console.log("Imhereimport");
            await mongoClient.connect();
            const db = mongoClient.db(name_db);
            const collection = db.collection(name_collection);

            const fileData = fs.readFileSync(backup_path);
            console.log('Данные успешно прочитаны из backup.bson');
            const bsonData = BSON.deserialize(fileData);
            await collection.deleteMany({});
            const result = await collection.insertMany(bsonData.arrayData);
            console.log(`Импорт прошел успешно. ${result.insertedCount} элементов было добавлено в коллекцию users.`);
        } catch (error) {
            console.error('An error has occurred:', error);
        } finally {
            await mongoClient.close();
        }
    }
    importDatabase().then(r => {});
    res.redirect('/admin');
})

router.get("/adverts/:id", (req, res) => {
    advert_id = req.params.id
    advert_id = new ObjectId(advert_id)
    console.log(advert_id)
    async function adData() {
        const mongoClient = new MongoClient(url);
        try {
            console.log("ad data");
            await mongoClient.connect();
            const db = mongoClient.db(name_db);
            const collection = db.collection(name_collection);

            let query = [];
            query.push({$eq: [ '$$ad.ad_id', advert_id ]})
            // data1 = await collection.find({ ads : { status: "Опубликовано" } }).project({ _id : 0, ads : 1 }).toArray();
            data1 = await collection.aggregate([{
                $project: {
                    "ads": {
                        $filter: {
                            input: "$ads",
                            as: "ad",
                            cond: {
                                "$and" : query
                            }
                        }
                    }
                }
            }]).project({ _id : 1, ads : 1 }).toArray();
            data1 = data1.reduce((temp, curr) => {
                if (curr.ads.length > 0) {
                    temp = temp.concat(curr._id, curr.ads);
                }
                return temp;
            }, []);
            // console.log(data1)
            data2 = await collection.find({ _id : data1[0] }).project({ _id : 0, name : 1, rating : 1 }).toArray();
            // console.log(data2)
            if (req.session.status == 'Администратор') {
                status = "Администратор"
            } else {
                if (req.session._id == data1[0]) {
                    status = 'Продавец'
                }
                else {
                    status = 'Покупатель'
                }
            }
            // TODO add increment to views counter
            res.render("advertisment_page", {title: 'Страница объявления', name: data2[0].name, rating: data2[0].rating, data: data1[1], status: status})
        } catch (error) {
            console.error('An error has occurred:', error);
        } finally {
            await mongoClient.close();
        }
    }
    adData()
})

router.delete("/delete_advert/:id", (req, res) => {
    console.log(`Ad ${req.params.id} will be deleted, ho-ho-ho e-he-he`)
    // TODO delete ad with req.params.id from database
    res.status(200).send({msg: "Данные успешно удалены"});
})
router.get("*", (req, res) => {
    res.status(404)
    res.end("Page not found")
})


module.exports = router
