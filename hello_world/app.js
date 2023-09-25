const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://127.0.0.1:27017/";

const name_db = 'hellodatabase';
const name_collection = 'hellocollection';



writeToDatabase().then(() => {
    readFromDatabase().then(() => {
        process.exit(0);
    });
});
