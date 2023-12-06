var express = require('express');
var server = express();
var routes = require('./routes');
var cookieParser = require('cookie-parser');
var session = require('express-session')
var path = require('path');

server.use(cookieParser());
server.use(express.json());
server.use(express.static(path.join(__dirname + '/public')));
server.use(express.urlencoded({extended: true}));
server.set('view engine', 'pug');
server.set('views', path.join(__dirname + '/views'));
server.use(session({secret: 'ses', resave: false, saveUninitialized: false,}))

server.use('/',routes);
server.listen(3000);
module.exports = server;

const MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";
const docker_status = false;
if (docker_status) url = "mongodb://mongo:27017/";
console.log("Im here!")
const name_db = 'hellodatabase';
const name_collection = 'hellocollection';

async function writeUserToDatabase() {
    const mongoClient = new MongoClient(url);
    try {
        await mongoClient.connect();
        const db = mongoClient.db('autotrade');
        const collection = db.collection('users');

        const { ObjectId } = require('mongodb');
        const data1 = await collection.insertOne({ _id: new ObjectId('65638b2bcf00e81ecfa8d832'), login: 'masterpiece', password: 'nosqlisbetterthansql', user_status: 'Пользователь', name: 'Анастасия', rating: 4.5, create_date: '2022-03-29', reviews: [{name:'Рудольф', mark: 5, text: 'Девушка супер. Машина тоже ничего!', date: '2022-03-29'}], dialogs: [{dialog_id: new ObjectId('6563956f2bf7f94d97aeddd4'), ad_id: new ObjectId('6563956f2bf7f94d97aeddd5'), messages: [{user_id: new ObjectId('65638b2bcf00e81ecfa8d832'), text: 'Обмен на стаю собак интересен?', timestamp: '2022-03-29Т12:04:16Z'}]}], ads: [{ad_id: new ObjectId('6563956f2bf7f94d97aeddd5'), photo: './cars_photos/sellBestCarEver', brand: 'Mercedes', model: 'AMG-GT', year: 2018, color: 'черный', body: 'седан', mileage: '10000', engine: '462', transmission: 'автомат', drive: 'задний', helm: 'левый', price: 10000000, create_date: '2022-03-29', edit_date: null, view: 808, status: 'Проверка'}]});
        console.log('Data was successfully written to the database:', data1.acknowledged, data1.insertedId);

        const data2 = await collection.insertOne({ _id: new ObjectId('65638f51a70b034fa69d9752'), login: 'buyer', password: 'nosql', user_status: 'Пользователь', name: 'Рудольф', rating: 4.5, create_date: '2022-03-29', reviews: [], dialogs: [{dialog_id: new ObjectId('6563956f2bf7f94d97aeddd4'), ad_id: new ObjectId('6563956f2bf7f94d97aeddd5'), messages: [{user_id: new ObjectId('65638f51a70b034fa69d9752'), text: 'Да, интересен! Беру!', timestamp: '2022-03-29Т12:04:17Z'}]}], ads: []});
        console.log('Data was successfully written to the database:', data2.acknowledged, data2.insertedId);

        const data3 = await collection.insertOne({ login: 'admin', password: 'admin', user_status: 'Администратор', name: 'Виктор', rating: [], create_date: '2022-03-29', reviews: [], dialogs: [], ads: []});
        console.log('Data was successfully written to the database:', data3.acknowledged, data3.insertedId);

        const id1 = new ObjectId();
        const id2 = new ObjectId();
        const id3 = new ObjectId();
        console.log(id1.toString(), id2.toString(), id3.toString())
        // 6563956f2bf7f94d97aeddd4 6563956f2bf7f94d97aeddd5 6563956f2bf7f94d97aeddd6
    } catch (error) {
        console.error('An error has occurred:', error);
    } finally {
        await mongoClient.close();
    }
}


writeUserToDatabase().then(() => {
    console.log("Yes!")
});
