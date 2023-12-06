var express = require('express');
const path = require("path");
const {ObjectId, BSON} = require("mongodb");
const fs = require("fs");
var router = express.Router();
var url = "mongodb://localhost:27017/";
const docker_status = false;
if (docker_status) url = "mongodb://mongo:27017/";

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
    const MongoClient = require("mongodb").MongoClient;
//     const url = "mongodb://localhost:27017/";
    console.log("Im here!")
    const name_db = 'autotrade';
    const name_collection = 'users';
    async function writeUserToDatabase() {
       const mongoClient = new MongoClient(url);
       try {
           console.log("Imhere");
           await mongoClient.connect();
           const db = mongoClient.db(name_db);
           const collection = db.collection(name_collection);

           data = await collection.find({}).toArray();
           console.log(data)
           count = 0;
           for (let i=0; i<data.length;i++){
               if (req.body.login == data[i].login && req.body.password == data[i].password){
                   console.log(data[i].login, data[i].password);
                   console.log('login and password ok')
                   req.session._id = data[i]._id
                   req.session.status = data[i].status
                   // res.redirect('/main');
                   console.log('-------------------------------------------');
                   console.log(data[0].name);
                   console.log('-------------------------------------------');

                   data1 = await collection.find({}).project({ _id : 0, ads : 1 }).toArray();
                   console.log("Data1");
                   console.log(data1[0].ads[0].brand);
                   // res.redirect('/create_advertisment')
                   res.render('main-menu', {title: 'Главная', adds: data1});
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
   writeUserToDatabase();
    console.log(req.body);
//     res.send(`${req.body.login} - ${req.body.password}`);
})

router.post('/main', (req, res) => {
    if(!req.body) return res.sendStatus(400);
    const MongoClient = require("mongodb").MongoClient;
//     const url = "mongodb://localhost:27017/";
    console.log("Im here1!")
    const name_db = 'autotrade';
    const name_collection = 'users';
    async function writeUserToDatabase() {
       const mongoClient = new MongoClient(url);
       try {
           console.log("Imhere1");
           await mongoClient.connect();
           const db = mongoClient.db(name_db);
           const collection = db.collection(name_collection);
           data = await collection.find({}).toArray();
           // console.log(data)
           const { ObjectId } = require('mongodb');
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
               photo: './cars_photos/sellBestCarEver',
               brand: req.body.brand,
               model: req.body.model,
               year: req.body.year,
               color: req.body.color,
               body: req.body.body,
               mileage: req.body.mileage,
               engine: req.body.engine,
               transmission: req.body.transmission,
               drive: req.body.drive,
               helm: req.body.helm,
               price: req.body.price,
               create_date: create_date,
               edit_date: null,
               view: 0,
               status: 'Проверка'
           };
           console.log(newData)
           console.log(req.session._id)
           const data1 = await collection.updateOne({ _id: new ObjectId(req.session._id)}, {$push: { ads: newData }},
            (updateErr, result) => {
            if (updateErr) throw updateErr;
            console.log(`Документ с id ${newData.ad_id} обновлен`);
            client.close();
           });
           console.log(data1)
           data2 = await collection.find({}).project({ _id : 0, ads : 1 }).toArray();
           res.render('main-menu', {title: 'Главная', adds: data2});
       } catch (error) {
           console.error('An error has occurred:', error);
       } finally {
           await mongoClient.close();
       }
    }
    writeUserToDatabase();
    console.log(req.body);
    // res.render('main-menu', {title: 'Главная', adds: data});
//     res.send(`${req.body.login} - ${req.body.password}`);
})

router.post('/mainfilter', (req, res) => {
    if(!req.body) return res.sendStatus(400);
    const MongoClient = require("mongodb").MongoClient;
//     const url = "mongodb://localhost:27017/";
    console.log("Im here2!")
    const name_db = 'autotrade';
    const name_collection = 'users';
    async function writeUserToDatabase() {
        const mongoClient = new MongoClient(url);
        try {
            console.log("Imhere2");
            await mongoClient.connect();
            const db = mongoClient.db(name_db);
            const collection = db.collection(name_collection);

            const query = {};
            if (req.body.filter_brand !== "Не выбрано") {
                query['ads.brand'] = req.body.filter_brand;
            }
            if (req.body.filter_model !== "Не выбрано") {
                query['ads.model'] = req.body.filter_model;
            }
            if (req.body.filter_year !== "Не выбрано") {
                query['ads.year'] = req.body.filter_year;
            }
            if (req.body.filter_color !== "Не выбрано") {
                query['ads.color'] = req.body.filter_color;
            }
            if (req.body.filter_body !== "Не выбрано") {
                query['ads.body'] = req.body.filter_body;
            }
            if (req.body.filter_mileage !== "Не выбрано") {
                query['ads.mileage'] = req.body.filter_mileage;
            }
            if (req.body.filter_engine !== "Не выбрано") {
                query['ads.engine'] = req.body.filter_engine;
            }
            if (req.body.filter_transmission !== "Не выбрано") {
                query['ads.transmission'] = req.body.filter_transmission;
            }
            if (req.body.filter_drive !== "Не выбрано") {
                query['ads.drive'] = req.body.filter_drive;
            }
            if (req.body.filter_helm !== "Не выбрано") {
                query['ads.helm'] = req.body.filter_helm;
            }

            data = await collection.find(query).project({ _id : 0, ads : 1 }).toArray();
            // console.log(data)

            res.render('main-menu', {title: 'Главная', adds: data});
        } catch (error) {
            console.error('An error has occurred:', error);
        } finally {
            await mongoClient.close();
        }
    }
    writeUserToDatabase();
    console.log(req.body);
    // res.render('main-menu', {title: 'Главная', adds: data});
//     res.send(`${req.body.login} - ${req.body.password}`);
})

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

            fs.writeFileSync('backup.bson', BSONData);
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

            const fileData = fs.readFileSync('backup.bson');
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

router.get("*", (req, res) => {
    res.status(404)
    res.end("Page not found")
})


module.exports = router
