var express = require('express');
const path = require("path");
const {ObjectId} = require("mongodb");
var router = express.Router();

router.use("/public", express.static(path.join(__dirname + '/public')));

router.get('/', (req, res, next) => {
    res.render('authorization', {title: 'Библиотека'});
});

router.get("/create_advertisment", (req, res) => {
    res.render("create_advt")
})

router.post('/mainauth', (req, res) => {
    if(!req.body) return res.sendStatus(400);
    const MongoClient = require("mongodb").MongoClient;
    const url = "mongodb://localhost:27017/";
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
                   // res.redirect('/main');
                   console.log('-------------------------------------------');
                   console.log(data[0].name);
                   console.log('-------------------------------------------');

                   data1 = await collection.find({}).project({ _id : 0, ads : 1 }).toArray();
                   console.log("Data1");
                   console.log(data1[0].ads.length);
                   res.redirect('/create_advertisment')
                   // res.render('main-menu', {title: 'Главная', adds: data1});
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
    const url = "mongodb://localhost:27017/";
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
           console.log(data)
           const { ObjectId } = require('mongodb');
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
               create_date: '08-08-2019',
               edit_date: null,
               view: 0,
               status: 'Проверка'
           };

           const data1 = await collection.updateOne({ _id: new ObjectId('65638b2bcf00e81ecfa8d832')}, {$push: { ads: newData }},
            (updateErr, result) => {
            if (updateErr) throw updateErr;
            console.log(`Документ с id ${newData.ad_id} обновлен`);
            client.close();
           });
       } catch (error) {
           console.error('An error has occurred:', error);
       } finally {
           await mongoClient.close();
       }
    }
    writeUserToDatabase();
    console.log(req.body);
    res.render('main-menu', {title: 'Главная', adds: data});
//     res.send(`${req.body.login} - ${req.body.password}`);
})

router.get("*", (req, res) => {
    res.status(404)
    res.end("Page not found")
})


module.exports = router
