var express = require('express');
const path = require("path");
const {ObjectId, BSON} = require("mongodb");
const fs = require("fs");
var router = express.Router();

var url = "mongodb://localhost:27017/";
var backup_path = "backup.bson"
var dest = "./public/cars_photos"
const docker_status = true;
if (docker_status) {
    url = "mongodb://mongo:27017/";
    backup_path = "data/db/backup.bson"
    dest = "app/public/cars_photos"
}
let data_filters;
let data_ads;
let data_admin_filters;
let data_admin;
let count_admin;
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

const multer = require("multer");
//const upload = multer({ dest: dest });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(file)
        cb(null, dest)
    },
})

const upload = multer({storage: storage}).single("photo")

router.get('/', (req, res, next) => {
    res.render('authorization', {title: 'Авторизация'});
});

router.get("/create_advertisment", (req, res) => {
    res.render("create_advt", {title: 'Добавление', id: req.session._id})
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
                   req.session.name = data[i].name
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

            index_low = 0
            index_high = 6

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
                "Руль",
                "Цена"
            ]
            // console.log("1")
            //console.log(data1)
            res.render('main-menu', {title: 'Главная', adds: data1.slice(index_low, index_high), status: req.session.status, filter_data: data, page: page, pages: pages, url: '/main', id: req.session._id});
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
                "Руль",
                "Цена"
            ]
            // console.log("1")
            // console.log(data)
            res.render('main-menu', {title: 'Главная', adds: data_main.slice(index_low, index_high), status: req.session.status, filter_data: data, page: page, pages: pages, url: '/main', id: req.session._id});
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

router.get('/mainseller', (req, res) => {
    // const MongoClient = require("mongodb").MongoClient;
//     const url = "mongodb://localhost:27017/";
    console.log("Main seller!")
    // const name_db = 'autotrade';
    // const name_collection = 'users';
    async function mainsellerRender() {
        const mongoClient = new MongoClient(url);
        try {
            console.log("main seller render");
            await mongoClient.connect();
            const db = mongoClient.db(name_db);
            const collection = db.collection(name_collection);

            let query = [];
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
                if (curr.ads.length > 0 && curr._id == req.session._id) {
                    temp = temp.concat(curr.ads);
                }
                return temp;
            }, []);

            page = 1;
            let count = data1.length

            let pages = Math.ceil(count / 6)
            if (pages == 0) pages = 1

            index_low = 0
            index_high = 6

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
                "Руль",
                "Цена"
            ]
            // console.log("1")
            //console.log(data1)
            res.render('main-menu', {title: 'Главная', adds: data1.slice(index_low, index_high), status: req.session.status, filter_data: data, page: page, pages: pages, url: '/mainseller', id: req.session._id});
            // res.render('my-acc', {title: 'Главная', adds: data1.slice(index_low, index_high), status: req.session.status, filter_data: data, page: page, pages: pages, url: '/main'});
            // res.render('user-page', {title: 'Главная', adds: data1.slice(index_low, index_high), status: req.session.status, filter_data: data, page: page, pages: pages, url: '/main'});
            // res.render('my-messages', {title: 'Главная', adds: data1.slice(index_low, index_high), status: req.session.status, filter_data: data, page: page, pages: pages, url: '/main'});
        } catch (error) {
            console.error('An error has occurred:', error);
        } finally {
            await mongoClient.close();
        }
    }
    mainsellerRender();
    // console.log(req.body);
//     res.send(`${req.body.login} - ${req.body.password}`);
})

router.post('/mainseller', (req, res) => {
    // const MongoClient = require("mongodb").MongoClient;
//     const url = "mongodb://localhost:27017/";
    console.log("Main seller page post!")
    // const name_db = 'autotrade';
    // const name_collection = 'users';
    async function mainsellerRender() {
        const mongoClient = new MongoClient(url);
        try {
            console.log("main seller page post");
            await mongoClient.connect();
            const db = mongoClient.db(name_db);
            const collection = db.collection(name_collection);

            let query = [];
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
                if (curr.ads.length > 0 && curr._id == req.session._id) {
                    temp = temp.concat(curr.ads);
                }
                return temp;
            }, []);
            // console.log(data1)
            // page = 1;
            let count = data1.length

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
                "Руль",
                "Цена"
            ]
            // console.log("1")
            // console.log(data)
            res.render('main-menu', {title: 'Главная', adds: data1.slice(index_low, index_high), status: req.session.status, filter_data: data, page: page, pages: pages, url: '/mainseller', id: req.session._id});
        } catch (error) {
            console.error('An error has occurred:', error);
        } finally {
            await mongoClient.close();
        }
    }
    mainsellerRender();
    // console.log(req.body);
//     res.send(`${req.body.login} - ${req.body.password}`);
})

router.get('/mainadmin', (req, res) => {
    // const MongoClient = require("mongodb").MongoClient;
//     const url = "mongodb://localhost:27017/";
    console.log("Main admin!")
    // const name_db = 'autotrade';
    // const name_collection = 'users';
    async function mainadminRender() {
        const mongoClient = new MongoClient(url);
        try {
            console.log("main admin render");
            await mongoClient.connect();
            const db = mongoClient.db(name_db);
            const collection = db.collection(name_collection);

            let query = [];
            query.push({$eq: [ '$$ad.status', 'Проверка' ]})
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

            page = 1;
            let count = data1.length

            let pages = Math.ceil(count / 6)
            if (pages == 0) pages = 1

            index_low = 0
            index_high = 6

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
                "Руль",
                "Цена"
            ]
            // console.log("1")
            //console.log(data1)
            res.render('main-menu', {title: 'Главная', adds: data1.slice(index_low, index_high), status: req.session.status, filter_data: data, page: page, pages: pages, url: '/mainadmin'});
            // res.render('my-acc', {title: 'Главная', adds: data1.slice(index_low, index_high), status: req.session.status, filter_data: data, page: page, pages: pages, url: '/main'});
            // res.render('user-page', {title: 'Главная', adds: data1.slice(index_low, index_high), status: req.session.status, filter_data: data, page: page, pages: pages, url: '/main'});
            // res.render('my-messages', {title: 'Главная', adds: data1.slice(index_low, index_high), status: req.session.status, filter_data: data, page: page, pages: pages, url: '/main'});
        } catch (error) {
            console.error('An error has occurred:', error);
        } finally {
            await mongoClient.close();
        }
    }
    mainadminRender();
    // console.log(req.body);
//     res.send(`${req.body.login} - ${req.body.password}`);
})

router.post('/mainadmin', (req, res) => {
    // const MongoClient = require("mongodb").MongoClient;
//     const url = "mongodb://localhost:27017/";
    console.log("Main admin page post!")
    // const name_db = 'autotrade';
    // const name_collection = 'users';
    async function mainadminRender() {
        const mongoClient = new MongoClient(url);
        try {
            console.log("main admin page post");
            await mongoClient.connect();
            const db = mongoClient.db(name_db);
            const collection = db.collection(name_collection);

            let query = [];
            query.push({$eq: [ '$$ad.status', 'Проверка' ]})
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
                "Руль",
                "Цена"
            ]
            // console.log("1")
            // console.log(data)
            res.render('main-menu', {title: 'Главная', adds: data1.slice(index_low, index_high), status: req.session.status, filter_data: data, page: page, pages: pages, url: '/mainadmin'});
        } catch (error) {
            console.error('An error has occurred:', error);
        } finally {
            await mongoClient.close();
        }
    }
    mainadminRender();
    // console.log(req.body);
//     res.send(`${req.body.login} - ${req.body.password}`);
})

router.post('/maincreate', upload, (req, res) => {
    console.log("POST REQUEST")
    if(!req.body) return res.sendStatus(400);
    let photo;
    try {
        let tempPath = req.file.path
        let targetPath = `${dest}/${req.file.originalname}`
        fs.rename(tempPath, targetPath, (error)=> {console.log(error)})
        photo = req.file.originalname
    }
    catch (error) {
        console.log("Check photo!")
        photo = 'nophoto.jpg'
    }
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
               photo: `/cars_photos/${photo}`,
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

router.post('/edit_advert/:id', upload,(req, res) => {
    console.log(`Ad ${req.params.id} will be edited, ho-ho-ho e-he-he`)
    // Обработка фотографии
    console.log(`FILE ${req.file}`)
    if (req.file) { // Пользователь хочет обновить фотографию
        let tempPath = req.file.path
        let targetPath = `app/public/cars_photos/${req.file.originalname}`
        fs.rename(tempPath, targetPath, (error)=> {console.log(error)})
    }

    advert_id = req.params.id
    advert_id = new ObjectId(advert_id)
    console.log(advert_id)
    // const name_db = 'autotrade';
    // const name_collection = 'users';
    async function adEdit() {
        const mongoClient = new MongoClient(url);
        try {
            console.log("ad edit");
            await mongoClient.connect();
            const db = mongoClient.db(name_db);
            const collection = db.collection(name_collection);
            // console.log(data)
            // const { ObjectId } = require('mongodb');
            let today_date = new Date();
            let date = ("0" + today_date.getDate()).slice(-2);
            let month = ("0" + (today_date.getMonth() + 1)).slice(-2);
            let year = today_date.getFullYear();
            let edit_date = year + "-" + month + "-" + date;
            console.log(edit_date);
            let query = {}
            if (req.file) query["ads.$.photo"] = `/cars_photos/${req.file.originalname}`;
            query["ads.$.brand"] = req.body.brand;
            query["ads.$.model"] = req.body.model;
            query["ads.$.year"] = Number(req.body.year);
            query["ads.$.color"] = req.body.color;
            query["ads.$.body"] = req.body.body;
            query["ads.$.mileage"] = Number(req.body.mileage);
            query["ads.$.engine"] = req.body.engine;
            query["ads.$.transmission"] = req.body.transmission;
            query["ads.$.drive"] = req.body.drive;
            query["ads.$.price"] = Number(req.body.price);
            query["ads.$.helm"] = req.body.helm;
            query["ads.$.edit_date"] = edit_date;
            query["ads.$.status"] = "Проверка";
            console.log(query)
            // console.log(req.session._id)
            data2 = await collection.updateMany({"ads.ad_id": advert_id}, {"$set": query});
            // console.log(data1)
            // data2 = await collection.find({}).project({ _id : 0, ads : 1 }).toArray();
            res.redirect('/mainseller')
        } catch (error) {
            console.error('An error has occurred:', error);
        } finally {
            await mongoClient.close();
        }
    }
    adEdit();
    // console.log(req.body);
    // res.render('main-menu', {title: 'Главная', adds: data});
//     res.send(`${req.body.login} - ${req.body.password}`);
})

router.get("/edit_advert/:id", (req, res) => {
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
            data3 = await collection.updateMany({"ads.ad_id": data1[1].ad_id}, {"$set": {"ads.$.view": data1[1].view + 1}});
            res.render("edit_advert", {title: 'Редактирование объявления', data: data1[1], status: status, id: data1[0]})
        } catch (error) {
            console.error('An error has occurred:', error);
        } finally {
            await mongoClient.close();
        }
    }
    adData()
})
router.get('/mainfilter', (req, res) => {
    // const MongoClient = require("mongodb").MongoClient;
//     const url = "mongodb://localhost:27017/";
    console.log("Main filter page!")
    res.render('main-menu', {title: 'Главная', adds: data_ads.slice(index_low_filter, index_high_filter), status: req.session.status, filter_data: data_filters, page: page_filter, pages: pages_filter, url: '/mainfilter', id: req.session._id});
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

                const eqSet = (array1, array2) => array1.length === array2.length && array1.every(function(value, index) { return value === array2[index]})
                if (!eqSet(req.body.filter_brand, ["Марка"])) {
                    query.push({$in: ['$$ad.brand', req.body.filter_brand]})
                }
                console.log(req.body.filter_brand)
                if (!eqSet(req.body.filter_model, ["Модель"])) {
                    query.push({$in: ['$$ad.model', req.body.filter_model]})
                }
                if (req.body.filter_year1 != "") {
                    query.push({$gte: ['$$ad.year', Number(req.body.filter_year1)]})
                }
                if (req.body.filter_year2 != "") {
                    query.push({$lte: ['$$ad.year', Number(req.body.filter_year2)]})
                }
                if (!eqSet(req.body.filter_color, ["Цвет"])) {
                    query.push({$in: ['$$ad.color', req.body.filter_color.map(e => e.toLowerCase())]})
                }
                if (!eqSet(req.body.filter_body, ["Кузов"])) {
                    query.push({$in: ['$$ad.body', req.body.filter_body.map(e => e.toLowerCase())]})
                }
                if (req.body.filter_mileage1 != "") {
                    query.push({$gte: ['$$ad.mileage', Number(req.body.filter_mileage1)]})
                }
                if (req.body.filter_mileage2 != "") {
                    query.push({$lte: ['$$ad.mileage', Number(req.body.filter_mileage2)]})
                }
                if (!eqSet(req.body.filter_engine, ["Двигатель"])) {
                    query.push({$in: ['$$ad.engine', req.body.filter_engine.map(e => e.toLowerCase())]})
                }
                if (!eqSet(req.body.filter_transmission, ["Коробка"])) {
                    query.push({$in: ['$$ad.transmission', req.body.filter_transmission.map(e => e.toLowerCase())]})
                }
                if (!eqSet(req.body.filter_drive, ["Привод"])) {
                    query.push({$in: ['$$ad.drive', req.body.filter_drive.map(e => e.toLowerCase())]})
                }
                if (!eqSet(req.body.filter_helm, ["Руль"])) {
                    query.push({$in: ['$$ad.helm', req.body.filter_helm.map(e => e.toLowerCase())]})
                }
                if (req.body.filter_price1 != "") {
                    query.push({$gte: ['$$ad.price', Number(req.body.filter_price1)]})
                }
                if (req.body.filter_price2 != "") {
                    query.push({$lte: ['$$ad.price', Number(req.body.filter_price2)]})
                }
                query.push({$eq: ['$$ad.status', 'Опубликовано']})

                let filter_year_box;
                console.log(req.body.filter_year1)
                if (req.body.filter_year1 !== '' || req.body.filter_year2 !== '') filter_year_box = 'Год ' + 'от ' + req.body.filter_year1 + ' до ' + req.body.filter_year2;
                else filter_year_box = 'Год';
                let filter_mileage_box;
                if (req.body.filter_mileage1 !== '' || req.body.filter_mileage2 !== '') filter_mileage_box = 'Пробег ' + 'от ' + req.body.filter_mileage1 + ' до ' +  req.body.filter_mileage2;
                else filter_mileage_box = 'Пробег';
                let filter_price_box;
                if (req.body.filter_price1 !== '' || req.body.filter_price2 !== '') filter_price_box = 'Цена ' + 'от ' + req.body.filter_price1 + ' до ' +  req.body.filter_price2;
                else filter_price_box = 'Цена';

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
                    req.body.filter_helm,
                    filter_price_box
                ]
                // console.log("2")
                // console.log(data_filters)
                console.log(query)
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
            // console.log(req.body)
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

router.get("/admin", (req, res) => {
    console.log("Admin!")
    // const name_db = 'autotrade';
    // const name_collection = 'users';
    async function adminRender() {
        const mongoClient = new MongoClient(url);
        try {
            console.log("admin render");
            await mongoClient.connect();
            const db = mongoClient.db(name_db);
            const collection = db.collection(name_collection);

            let query = [];
            // data1 = await collection.find({ ads : { status: "Опубликовано" } }).project({ _id : 0, ads : 1 }).toArray();
            data_admin = await collection.aggregate([{
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
            data_admin = data_admin.reduce((temp, curr) => {
                if (curr.ads.length > 0) {
                    for (let i = 0; i < curr.ads.length; i++) {
                        temp = temp.concat(curr.ads[i].ad_id);
                    }
                }
                return temp;
            }, []);
            data_admin_filters = [
                "Дата объявления",
                "Цена",
                "Пробег",
                "Марка",
                "Год"
            ]
            count_admin = data_admin.length
            console.log(data_admin)
            console.log(count_admin)
            // console.log(data_admin_filters)
            res.render('admin', {title: 'Администратор', data: data_admin, count: count_admin, filter_data: data_admin_filters});
        } catch (error) {
            console.error('An error has occurred:', error);
        } finally {
            await mongoClient.close();
        }
    }
    adminRender()
})

router.get("/adminfilter", (req, res) => {
    console.log("Admin filter page!")
    res.render('admin', {title: 'Администратор', data: data_admin, count: count_admin, filter_data: data_admin_filters});
})

router.post('/adminfilter', (req, res) => {
    // if(!req.body) return res.sendStatus(400);
    // const MongoClient = require("mongodb").MongoClient;
//     const url = "mongodb://localhost:27017/";
    console.log("Admin filter!")
    // const name_db = 'autotrade';
    // const name_collection = 'users';
    async function adminFilter() {
        const mongoClient = new MongoClient(url);
        try {
            console.log("admin filter");
            await mongoClient.connect();
            const db = mongoClient.db(name_db);
            const collection = db.collection(name_collection);
            let query = [];
            const eqSet = (array1, array2) => array1.length === array2.length && array1.every(function(value, index) { return value === array2[index]})
            if (req.body.filter_date1 != "") {
                query.push({$gte: ['$$ad.create_date', req.body.filter_date1]})
            }
            if (req.body.filter_date2 != "") {
                query.push({$lte: ['$$ad.create_date', req.body.filter_date2]})
            }
            if (req.body.filter_price1 != "") {
                query.push({$gte: ['$$ad.price', Number(req.body.filter_price1)]})
            }
            if (req.body.filter_price2 != "") {
                query.push({$lte: ['$$ad.price', Number(req.body.filter_price2)]})
            }
            if (req.body.filter_mileage1 != "") {
                query.push({$gte: ['$$ad.mileage', Number(req.body.filter_mileage1)]})
            }
            if (req.body.filter_mileage2 != "") {
                query.push({$lte: ['$$ad.mileage', Number(req.body.filter_mileage2)]})
            }
            if (!eqSet(req.body.filter_brand, ["Марка"])) {
                query.push({$in: ['$$ad.brand', req.body.filter_brand]})
            }
            if (req.body.filter_year1 != "") {
                query.push({$gte: ['$$ad.year', Number(req.body.filter_year1)]})
            }
            if (req.body.filter_year2 != "") {
                query.push({$lte: ['$$ad.year', Number(req.body.filter_year2)]})
            }

            let filter_date_box;
            if (req.body.filter_date1 !== '' || req.body.filter_date2 !== '') filter_date_box = 'Дата объявления ' + 'от ' + req.body.filter_date1 + ' до ' + req.body.filter_date2;
            else filter_date_box = 'Дата объявления';
            let filter_year_box;
            if (req.body.filter_year1 !== '' || req.body.filter_year2 !== '') filter_year_box = 'Год ' + 'от ' + req.body.filter_year1 + ' до ' + req.body.filter_year2;
            else filter_year_box = 'Год';
            let filter_mileage_box;
            if (req.body.filter_mileage1 !== '' || req.body.filter_mileage2 !== '') filter_mileage_box = 'Пробег ' + 'от ' + req.body.filter_mileage1 + ' до ' +  req.body.filter_mileage2;
            else filter_mileage_box = 'Пробег';
            let filter_price_box;
            if (req.body.filter_price1 !== '' || req.body.filter_price2 !== '') filter_price_box = 'Цена ' + 'от ' + req.body.filter_price1 + ' до ' +  req.body.filter_price2;
            else filter_price_box = 'Цена';

            data_admin_filters = [
                filter_date_box,
                filter_price_box,
                filter_mileage_box,
                req.body.filter_brand,
                filter_year_box
            ]
            console.log(query)
            data_admin = await collection.aggregate([{
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
            data_admin = data_admin.reduce((temp, curr) => {
                if (curr.ads.length > 0) {
                    for (let i = 0; i < curr.ads.length; i++) {
                        temp = temp.concat(curr.ads[i].ad_id);
                    }
                }
                return temp;
            }, []);
            count_admin = data_admin.length
            // console.log(data_admin)
            // console.log(count_admin)
            // console.log(req.body)

            res.redirect('/adminfilter')
            // return res.send(data1)
        } catch (error) {
            console.error('An error has occurred:', error);
        } finally {
            await mongoClient.close();
        }
    }
    adminFilter();
//     res.send(`${req.body.login} - ${req.body.password}`);
})

router.get("/adminexport", (req, res) => {
    let msg;
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
            msg = "Данные успешно записаны в backup.bson";
            console.log(msg);

        } catch (error) {
            msg = "При экспорте данных произошла следующая ошибка: " + error;
            console.error(msg);
        } finally {
            await mongoClient.close();
            res.render('import-export-status-page', {imex_message: msg, url: "adminexport"});
        }
    }
    if (req.session.status == "Администратор") exportDatabase().then(r => {});
    else res.redirect('/main');
})

router.get("/adminimport", (req, res) => {
    let msg;
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
            msg = `Импорт прошел успешно. ${result.insertedCount} элементов было добавлено в коллекцию users.`;
            console.log(msg)
        } catch (error) {
            msg = "При импорте данных произошла ошибка: " + error;
            console.log(msg);
        } finally {
            await mongoClient.close();
            res.render("import-export-status-page", {imex_message: msg, url: "adminimport"})
        }
    }
    if (req.session.status == "Администратор") importDatabase().then(r => {});
    else res.redirect('/main');
})

router.get("/adminreset", (req, res) => {
    async function resetDatabase() {
        let msg = "Сброс прошел успешно!\n";
        const mongoClient = new MongoClient(url);
        try {
            await mongoClient.connect();
            const db = mongoClient.db('autotrade');
            const collection = db.collection('users');
    
            const { ObjectId } = require('mongodb');
            await collection.deleteMany({});
            const data1 = await collection.insertOne({ _id: new ObjectId('65638b2bcf00e81ecfa8d832'), login: 'masterpiece', password: 'nosqlisbetterthansql', user_status: 'Пользователь', name: 'Анастасия', rating: 5.0, create_date: '2022-03-29', reviews: [{name:'Рудольф', mark: 5, text: 'Машина супер. Спасибо большое!', date: '2022-03-29'}], dialogs: [{dialog_id: new ObjectId('6563956f2bf7f94d97aeddd4'), ad_id: new ObjectId('6563956f2bf7f94d97aeddd5'), messages: [{user_id: new ObjectId('65638b2bcf00e81ecfa8d832'), text: 'Обмен на Ладу Ларгус интересен?', timestamp: '2022-03-29 12:04:16Z'}]}], ads: [
                {ad_id: new ObjectId('6563956f2bf7f94d97aeddd5'), photo: '/cars_photos/amggt.jpg', brand: 'Mercedes', model: 'AMG-GT', year: 2018, color: 'черный', body: 'седан', mileage: 10000, engine: 'бензин', transmission: 'автомат', drive: 'задний', helm: 'левый', price: 10000000, create_date: '2022-03-29', edit_date: null, view: 808, status: 'Опубликовано'},
                    {ad_id: new ObjectId('6563956f2bf7f94d97aeddd6'), photo: '/cars_photos/sellBestCarEver.jpg', brand: 'Mercedes', model: 'AMG-GT R', year: 2018, color: 'черный', body: 'седан', mileage: 10000, engine: 'бензин', transmission: 'автомат', drive: 'задний', helm: 'левый', price: 14000000, create_date: '2022-03-29', edit_date: null, view: 808, status: 'Проверка'},
                    {ad_id: new ObjectId('657599f971dd4c9a9e467dff'), photo: '/cars_photos/landcruiser.png', brand: 'Toyota', model: 'Land Cruiser', year: 2023, color: 'красный', body: 'внедорожник', mileage: 0, engine: 'дизель', transmission: 'автомат', drive: 'полный', helm: 'левый', price: 13000000, create_date: '2023-12-10', edit_date: null, view: 0, status: 'Опубликовано'}]});
            console.log('Data was successfully written to the database:', data1.acknowledged, data1.insertedId);
            msg += `Data id ${data1.insertedId}\n`
    
            const data2 = await collection.insertOne({ _id: new ObjectId('65638f51a70b034fa69d9752'), login: 'buyer', password: 'nosql', user_status: 'Пользователь', name: 'Рудольф', rating: [], create_date: '2022-03-29', reviews: [], dialogs: [{dialog_id: new ObjectId('6563956f2bf7f94d97aeddd4'), ad_id: new ObjectId('6563956f2bf7f94d97aeddd5'), messages: [{user_id: new ObjectId('65638f51a70b034fa69d9752'), text: 'Да, интересен! Беру!', timestamp: '2022-03-29 12:04:17Z'}]}], ads: []});
            console.log('Data was successfully written to the database:', data2.acknowledged, data2.insertedId);
            msg += `Data id ${data2.insertedId}\n`
    
            const data3 = await collection.insertOne({ _id: new ObjectId('656393c68c47f9cf167bc8c6'), login: 'admin', password: 'admin', user_status: 'Администратор', name: 'Виктор', rating: [], create_date: '2022-03-29', reviews: [], dialogs: [], ads: []});
            console.log('Data was successfully written to the database:', data3.acknowledged, data3.insertedId);
            msg += `Data id ${data3.insertedId}`
    
            // Получение новых id
            // const id1 = new ObjectId();
            // const id2 = new ObjectId();
            // const id3 = new ObjectId();
            // console.log(id1.toString(), id2.toString(), id3.toString())
            // 6563956f2bf7f94d97aeddd4 6563956f2bf7f94d97aeddd5 6563956f2bf7f94d97aeddd6
        } catch (error) {
            msg = "При сбросе базы данных произошла ошибка: " + error;
            console.error('An error has occurred:', error);
        } finally {
            await mongoClient.close();
            // console.log(msg)
            res.render("import-export-status-page", {imex_message: msg, url: "adminreset"})
        }
    }
    if (req.session.status == "Администратор") resetDatabase().then(r => {});
    else res.redirect('/main');
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
                else if (req.session._id) {
                    status = 'Покупатель'
                }
                else status = 'Неавторизованный пользователь'
            }
            data3 = await collection.updateMany({"ads.ad_id": data1[1].ad_id}, {"$set": {"ads.$.view": data1[1].view + 1}});
            res.render("advertisment_page", {title: 'Страница объявления', name: data2[0].name, rating: data2[0].rating, data: data1[1], status: status, id: req.session._id, seller_id: data1[0]})
        } catch (error) {
            console.error('An error has occurred:', error);
        } finally {
            await mongoClient.close();
        }
    }
    adData()
})

router.get("/delete_advert/:id", (req, res) => {
    console.log(`Ad ${req.params.id} will be deleted, ho-ho-ho e-he-he`)
    advert_id = req.params.id
    advert_id = new ObjectId(advert_id)
    console.log(advert_id)
    async function adDelete() {
        const mongoClient = new MongoClient(url);
        try {
            console.log("ad delete");
            await mongoClient.connect();
            const db = mongoClient.db(name_db);
            const collection = db.collection(name_collection);

            data2 = await collection.updateMany({}, {"$pull": {"ads": {"ad_id": advert_id}}}, {multi: true});
            // console.log(data2)
            res.redirect('/main')
        } catch (error) {
            console.error('An error has occurred:', error);
        } finally {
            await mongoClient.close();
        }
    }
    adDelete()
    // res.status(200).send({msg: "Данные успешно удалены"});
})

router.get("/adminvalidation/:id", (req, res) => {
    console.log(`Ad ${req.params.id} will be validated, ho-ho-ho e-he-he`)
    advert_id = req.params.id
    if (advert_id !== "all"){
        advert_id = new ObjectId(advert_id)
    }
    console.log(advert_id)
    async function adValidate() {
        const mongoClient = new MongoClient(url);
        try {
            console.log("ad validate");
            await mongoClient.connect();
            const db = mongoClient.db(name_db);
            const collection = db.collection(name_collection);

            if (req.params.id != "all") data2 = await collection.updateMany({"ads.ad_id": advert_id}, {"$set": {"ads.$.status": "Опубликовано"}});
            else data2 = await collection.updateMany({"ads.status" : "Проверка"}, {"$set": {"ads.$[elem].status": "Опубликовано"}}, { "arrayFilters": [{ "elem.status": "Проверка" }], "multi": true });
            // console.log(data2)
            res.redirect('/mainadmin')
        } catch (error) {
            console.error('An error has occurred:', error);
        } finally {
            await mongoClient.close();
        }
    }
    adValidate()
    // res.status(200).send({msg: "Данные успешно удалены"});
})

router.get("/user/:id", (req, res) => {
    user_id = req.params.id
    user_id = new ObjectId(user_id)
    // console.log(user_id)
    async function userPage() {
        const mongoClient = new MongoClient(url);
        try {
            console.log("user page");
            await mongoClient.connect();
            const db = mongoClient.db(name_db);
            const collection = db.collection(name_collection);

            data2 = await collection.find({ _id : user_id }).project({ _id : 0, name : 1, rating : 1, create_date : 1, reviews: 1, dialogs: 1 }).toArray();
            // console.log(data2)
            if (req.session._id == user_id) {
                status_account = "Мой"
                title = "Мой аккаунт"
            } else {
                status_account = 'Чужой'
                title = "Страница пользователя"
            }
            for (let i = 0; i < data2[0].dialogs.length; i++) {
                data1 = await collection.find({ "dialogs.dialog_id" : data2[0].dialogs[i].dialog_id, "dialogs.ad_id": data2[0].dialogs[i].ad_id }).project({ _id : 1, name : 1}).toArray();
                for (j in data1) {
                    if (data1[j]._id != req.session._id) data2[0].dialogs[i].name = data1[j].name
                }
                let query = [];
                query.push({$eq: [ '$$ad.ad_id', data2[0].dialogs[i].ad_id ]})
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
                        for (let i = 0; i < curr.ads.length; i++) {
                            temp = temp.concat(curr.ads[i].brand, curr.ads[i].model, curr.ads[i].year);
                        }
                    }
                    return temp;
                }, []);
                data2[0].dialogs[i].ad = data1
            }
            // console.log(data2[0].dialogs)
            res.render("user-page", {title: title, name: data2[0].name, rating: data2[0].rating, create_date: data2[0].create_date, reviews: data2[0].reviews, dialogs: data2[0].dialogs, status: req.session.status, status_account: status_account, id: req.session._id, user_id: user_id})
        } catch (error) {
            console.error('An error has occurred:', error);
        } finally {
            await mongoClient.close();
        }
    }
    userPage()
})

router.get('/user/review/:id', (req, res) => {
    res.render("review", {title: "Отзыв", id: req.params.id})
})

router.post('/user/review/:id', (req, res) => {
    user_id = req.params.id
    user_id = new ObjectId(user_id)
    console.log(user_id)
    async function reviewCreate() {
        const mongoClient = new MongoClient(url);
        try {
            console.log("review create");
            await mongoClient.connect();
            const db = mongoClient.db(name_db);
            const collection = db.collection(name_collection);

            let today_date = new Date();
            let date = ("0" + today_date.getDate()).slice(-2);
            let month = ("0" + (today_date.getMonth() + 1)).slice(-2);
            let year = today_date.getFullYear();
            let create_date = year + "-" + month + "-" + date;
            console.log(create_date);
            const newData = {
                name: req.session.name,
                mark: Number(req.body.mark),
                text: req.body.review,
                date: create_date,
            };
            // console.log(newData)
            // console.log(req.session._id)
            data = await collection.find({ _id : user_id }).project({ _id : 0, reviews: 1}).toArray();
            let new_rating = 0;
            let count_reviews = data[0].reviews.length;
            for (let i = 0; i < count_reviews; i++) {
                new_rating += data[0].reviews[i].mark
            }
            const data1 = await collection.updateOne({ _id: user_id}, {$push: { reviews: newData },
                    $set: { rating: Math.round((new_rating + Number(req.body.mark)) / (count_reviews + 1) * 10) / 10}},
                (updateErr, result) => {
                    if (updateErr) throw updateErr;
                    console.log(`Отзыв добавлен пользователю с id ${user_id}`);
                });
            // console.log(data1)
            res.redirect(`/user/${user_id}`)
        } catch (error) {
            console.error('An error has occurred:', error);
        } finally {
            await mongoClient.close();
        }
    }
    reviewCreate()
})

let messages;
let other_id;
let ad_info;
let other_name;

router.get('/dialog/:id', (req, res) => {
    console.log("dialog render")
    messages.sort(function(a,b){
        // console.log(new Date(b.timestamp), b.timestamp)
        return new Date(a.timestamp) - new Date(b.timestamp);
    });
    // console.log("Отсортированный список ", messages)

    res.render("my-messages", {title: "Диалог", ad_info: ad_info, messages: messages, id: req.session._id, other_id: other_id, other_name: other_name, status: req.session.status, id_dialog: req.params.id})
})

router.post('/dialog/:id_advert/:id_other',(req, res) => {
    advert_id = req.params.id_advert
    advert_id = new ObjectId(advert_id)
    console.log(advert_id)
    other_id = req.params.id_other
    other_id = new ObjectId(other_id)
    console.log(other_id)
    async function dialogData() {
        const mongoClient = new MongoClient(url);
        try {
            console.log("dialog data");
            await mongoClient.connect();
            const db = mongoClient.db(name_db);
            const collection = db.collection(name_collection);
            // купить
            // узнаю, есть ли id диалога
            let query = [];
            query.push({$eq: [ '$$dialog.ad_id', advert_id ]})
            console.log(req.session._id, advert_id)
            data1 = await collection.aggregate([
                { "$match": { "_id": new ObjectId(req.session._id) }},{
                $project: {
                    "dialogs": {
                        $filter: {
                            input: "$dialogs",
                            as: "dialog",
                            cond: {
                                "$and" : query
                            }
                        }
                    }
                }
            }]).project({ _id : 0, dialogs : 1 }).toArray();
            // console.log(data1[0].dialogs[0])
            // если есть, то я получаю сообщения с двух пользователей, если нет, то массив пустой
            if (data1[0].dialogs[0]) {
                messages = data1[0].dialogs[0].messages;
                query = [];
                query.push({$eq: [ '$$dialog.dialog_id', data1[0].dialogs[0].dialog_id ]})
                // console.log(other_id, data1[0].dialogs[0].dialog_id)
                data1 = await collection.aggregate([
                    { "$match": { "_id": other_id }},{
                        $project: {
                            "dialogs": {
                                $filter: {
                                    input: "$dialogs",
                                    as: "dialog",
                                    cond: {
                                        "$and" : query
                                    }
                                }
                            }
                        }
                    }]).project({ _id : 0, dialogs : 1 }).toArray();
                // console.log(data1)
                messages = messages.concat(data1[0].dialogs[0].messages);
                // console.log(messages)
                dialog_id = data1[0].dialogs[0].dialog_id
            }
            else {
                messages = []
                dialog_id = 1
            }
            ad_info = {
                ad_id: advert_id,
                brand: req.body.brand,
                model: req.body.model,
                year: req.body.year
            }
            other_name = req.body.name
            // console.log(req.body)
            // console.log(req.body.brand)
            res.send(JSON.stringify({"dialog_id": dialog_id}))
        } catch (error) {
            console.error('An error has occurred:', error);
        } finally {
            await mongoClient.close();
        }
    }
    dialogData()
})

router.post('/dialog/:id', (req, res) => {
    dialog_id = req.params.id
    dialog_id = new ObjectId(dialog_id)
    // console.log(dialog_id)
    async function dialogData() {
        const mongoClient = new MongoClient(url);
        try {
            console.log("dialog data from user page");
            await mongoClient.connect();
            const db = mongoClient.db(name_db);
            const collection = db.collection(name_collection);
            // со страницы пользователя
            // получаю сообщения с двух пользователей
            let query = [];
            query.push({$eq: [ '$$dialog.dialog_id', dialog_id ]})
            data1 = await collection.aggregate([{
                    $project: {
                        "dialogs": {
                            $filter: {
                                input: "$dialogs",
                                as: "dialog",
                                cond: {
                                    "$and" : query
                                }
                            }
                        }
                    }
                }]).project({ _id : 1, dialogs : 1 }).toArray();
            // console.log(data1)
            messages = []
            for (let i in data1) {
                if (data1[i].dialogs.length > 0) {
                    // console.log(i)
                    // console.log(data1[i].dialogs)
                    if (data1[i]._id != req.session._id) {
                        other_id = data1[i]._id;
                        advert_id = data1[i].dialogs[0].ad_id;
                    }
                    messages = messages.concat(data1[i].dialogs[0].messages);
                }
            }
            // console.log(other_id)
            // console.log(messages)
            // console.log(advert_id)
            ad_info = {
                ad_id: advert_id,
                brand: req.body.brand,
                model: req.body.model,
                year: req.body.year
            }
            other_name = req.body.name
            //res.redirect(`/dialog/${dialog_id}`)
            res.send(JSON.stringify({dialog_id: dialog_id}))
        } catch (error) {
            console.error('An error has occurred:', error);
        } finally {
            await mongoClient.close();
        }
    }
    dialogData()
})

router.post('/dialog_message/:id_dialog/:id_advert/:id_other', (req, res) => {
    dialog_id = req.params.id_dialog
    console.log(dialog_id)
    if (dialog_id != 1) dialog_id = new ObjectId(dialog_id)
    console.log(dialog_id)
    advert_id = req.params.id_advert
    advert_id = new ObjectId(advert_id)
    console.log(advert_id)
    user_id = req.params.id_other
    user_id = new ObjectId(user_id)
    console.log(user_id)
    async function messageCreate() {
        const mongoClient = new MongoClient(url);
        try {
            console.log("message create");
            await mongoClient.connect();
            const db = mongoClient.db(name_db);
            const collection = db.collection(name_collection);

            let today_date = new Date();
            let date = ("0" + today_date.getDate()).slice(-2);
            let month = ("0" + (today_date.getMonth() + 1)).slice(-2);
            let year = today_date.getFullYear();
            let hours = today_date.getHours();
            let minutes = today_date.getMinutes();
            let seconds = today_date.getSeconds();
            let create_date_message = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds + "Z";
            console.log(create_date_message);
            // если диалога нет
            if (dialog_id == 1) {
                console.log("There is not dialog")
                dialog_id = new ObjectId()
                let newData = {
                    dialog_id: dialog_id,
                    ad_id: advert_id,
                    messages: []
                };
                // console.log(newData)
                let data1 = await collection.updateOne({ _id: user_id}, {$push: { dialogs: newData }});
                // console.log(data1)
                newData.messages = [
                    {
                        user_id: new ObjectId(req.session._id),
                        text: req.body.text,
                        timestamp: create_date_message
                    }
                ]
                // console.log(newData)
                data1 = await collection.updateOne({ _id: new ObjectId(req.session._id)}, {$push: { dialogs: newData }});
                // console.log(data1)
            }
            // если диалог есть
            else {
                console.log("There is dialog")
                let message = {
                    user_id: new ObjectId(req.session._id),
                    text: req.body.text,
                    timestamp: create_date_message
                }
                // console.log(message)
                data1 = await collection.updateOne({ _id: new ObjectId(req.session._id), "dialogs.dialog_id": dialog_id}, {$push: { "dialogs.$.messages": message }});
                // console.log(data1)
            }

            // получаю сообщения с двух пользователей
            let query = [];
            query.push({$eq: [ '$$dialog.dialog_id', dialog_id ]})
            data1 = await collection.aggregate([{
                $project: {
                    "dialogs": {
                        $filter: {
                            input: "$dialogs",
                            as: "dialog",
                            cond: {
                                "$and" : query
                            }
                        }
                    }
                }
            }]).project({ _id : 1, dialogs : 1 }).toArray();
            console.log(data1)
            messages = []
            for (let i in data1) {
                if (data1[i].dialogs.length > 0) {
                    // console.log(i)
                    // console.log(data1[i].dialogs)
                    if (data1[i]._id != req.session._id) {
                        other_id = data1[i]._id;
                        advert_id = data1[i].dialogs[0].ad_id;
                    }
                    messages = messages.concat(data1[i].dialogs[0].messages);
                }
            }
            // console.log(other_id)
            // console.log(messages)
            // console.log(advert_id)
            ad_info = {
                ad_id: advert_id,
                brand: req.body.brand,
                model: req.body.model,
                year: req.body.year
            }
            other_name = req.body.name
            // res.redirect(`/dialog/${dialog_id}`)
            res.send(JSON.stringify({dialog_id: `${dialog_id}`}))
        } catch (error) {
            console.error('An error has occurred:', error);
        } finally {
            await mongoClient.close();
        }
    }
    messageCreate()
})

router.get("*", (req, res) => {
    res.status(404)
    res.end("Page not found")
})


module.exports = router
