const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://127.0.0.1:27017/";

const name_db = 'hellodatabase';
const name_collection = 'hellocollection';

async function writeToDatabase() {
    const mongoClient = new MongoClient(url);
    try {
        await mongoClient.connect();
        const db = mongoClient.db(name_db);
        const collection = db.collection(name_collection);

        const data = await collection.insertOne({ message: 'HelloWorld' });
        console.log('Data was successfully written to the database:', data.acknowledged, data.insertedId);
    } catch (error) {
        console.error('An error has occurred:', error);
    } finally {
        await mongoClient.close();
    }
}

async function readFromDatabase() {
    const mongoClient = new MongoClient(url);
    try {
        await mongoClient.connect();
        const db = mongoClient.db(name_db);
        const collection = db.collection(name_collection);

        const data = await collection.findOne();
        console.log('Data from the database:', data.message);
    } catch (error) {
        console.error('An error has occurred:', error);
    } finally {
        await mongoClient.close();
    }
}


writeToDatabase().then(() => {
    readFromDatabase().then(() => {
        process.exit(0);
    });
});
