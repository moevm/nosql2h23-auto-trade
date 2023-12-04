var express = require('express');
var server = express();
var routes = require('./routes');
var cookieParser = require('cookie-parser');
var session = require('express-session')
var path = require('path');
const fs = require('fs');

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

var url = "mongodb://localhost:27017/";
const docker_status = false;
if (docker_status) url = "mongodb://mongo:27017/";
const MongoClient = require("mongodb").MongoClient;
const name_db = 'autotrade';
const name_collection = 'users';
async function exportDatabase() {
    const mongoClient = new MongoClient(url);
    try {
        console.log("Imhereexport");
        await mongoClient.connect();
        const db = mongoClient.db(name_db);
        const collection = db.collection(name_collection);

        data = await collection.find({}).toArray();
        const jsonData = JSON.stringify(data);
        // console.log(jsonData);
        fs.writeFileSync('backup.json', jsonData);
        console.log('Данные успешно записаны в backup.json');
        // fs.writeFile('backup.json', jsonData, (err) => {
        //     if (err) {
        //         console.error('Ошибка записи в файл:', err);
        //         return;
        //     }
        //
        //     console.log('Данные успешно записаны в backup.json');
        // });
    } catch (error) {
        console.error('An error has occurred:', error);
    } finally {
        await mongoClient.close();
    }
}
// exportDatabase().then(r => {});

async function importDatabase() {
    const mongoClient = new MongoClient(url);
    try {
        console.log("Imhereimport");
        await mongoClient.connect();
        const db = mongoClient.db(name_db);
        const collection = db.collection(name_collection);

        await collection.deleteMany({});

        const fileData = fs.readFileSync('backup.json');
        console.log('Данные успешно прочитаны из backup.json');
        const jsonData = JSON.parse(fileData);
        const result = await collection.insertMany(jsonData);
        console.log(`Импорт прошел успешно. ${result.insertedCount} элементов было добавлено в коллекцию users.`);
    } catch (error) {
        console.error('An error has occurred:', error);
    } finally {
        await mongoClient.close();
    }
}
// importDatabase().then(r => {});
