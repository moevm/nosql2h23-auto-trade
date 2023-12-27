conn = new Mongo();
db = conn.getDB("autotrade");


db.users.insertOne({ _id: new ObjectId('65638b2bcf00e81ecfa8d832'), login: 'masterpiece', password: 'nosqlisbetterthansql', user_status: 'Пользователь', name: 'Анастасия', rating: 5.0, create_date: '2022-03-29', reviews: [{name:'Рудольф', mark: 5, text: 'Девушка супер. Машина тоже ничего!', date: '2022-03-29'}], dialogs: [{dialog_id: new ObjectId('6563956f2bf7f94d97aeddd4'), ad_id: new ObjectId('6563956f2bf7f94d97aeddd5'), messages: [{user_id: new ObjectId('65638b2bcf00e81ecfa8d832'), text: 'Обмен на стаю собак интересен?', timestamp: '2022-03-29 12:04:16Z'}]}], ads: [
            {ad_id: new ObjectId('6563956f2bf7f94d97aeddd5'), photo: '/cars_photos/amggt.jpg', brand: 'Mercedes', model: 'AMG-GT', year: 2018, color: 'черный', body: 'седан', mileage: 10000, engine: 'бензин', transmission: 'автомат', drive: 'задний', helm: 'левый', price: 10000000, create_date: '2022-03-29', edit_date: null, view: 808, status: 'Опубликовано'},
                {ad_id: new ObjectId('6563956f2bf7f94d97aeddd6'), photo: '/cars_photos/sellBestCarEver.jpg', brand: 'Mercedes', model: 'AMG-GT R', year: 2018, color: 'черный', body: 'седан', mileage: 10000, engine: 'бензин', transmission: 'автомат', drive: 'задний', helm: 'левый', price: 14000000, create_date: '2022-03-29', edit_date: null, view: 808, status: 'Проверка'},
                {ad_id: new ObjectId('657599f971dd4c9a9e467dff'), photo: '/cars_photos/landcruiser.png', brand: 'Toyota', model: 'Land Cruiser', year: 2023, color: 'красный', body: 'внедорожник', mileage: 0, engine: 'дизель', transmission: 'автомат', drive: 'полный', helm: 'левый', price: 13000000, create_date: '2023-12-10', edit_date: null, view: 0, status: 'Опубликовано'}]});
console.log('Data was successfully written to the database');

db.users.insertOne({ _id: new ObjectId('65638f51a70b034fa69d9752'), login: 'buyer', password: 'nosql', user_status: 'Пользователь', name: 'Рудольф', rating: [], create_date: '2022-03-29', reviews: [], dialogs: [{dialog_id: new ObjectId('6563956f2bf7f94d97aeddd4'), ad_id: new ObjectId('6563956f2bf7f94d97aeddd5'), messages: [{user_id: new ObjectId('65638f51a70b034fa69d9752'), text: 'Да, интересен! Беру!', timestamp: '2022-03-29 12:04:17Z'}]}], ads: []});
console.log('Data was successfully written to the database');

db.users.insertOne({ _id: new ObjectId('656393c68c47f9cf167bc8c6'), login: 'admin', password: 'admin', user_status: 'Администратор', name: 'Виктор', rating: [], create_date: '2022-03-29', reviews: [], dialogs: [], ads: []});
console.log('Data was successfully written to the database');
