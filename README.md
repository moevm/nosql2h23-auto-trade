# nosql_template

## Установка
```
chmod +x install.sh && ./install.sh
```
## Запуск
```
chmod +x start.sh && ./start.sh
```

Начальное наполнение базы данных содержит три отладочных пользователя. В системе представлены две роли: пользователь и администратор. В сценариях пользования пользователь может выступать как продавцом, так и покупателем, поэтому созданы два отладочных пользователя для продавца и покупателя.

Данные продавца:

Логин: masterpiece

Пароль: nosqlisbetterthansql

Данные покупателя:

Логин: buyer

Пароль: nosql

Данные администратора:

Логин: admin

Пароль: admin

## Данные продавца:
```shell
{
    _id: ObjectId('65638b2bcf00e81ecfa8d832'),
    login: 'masterpiece',
    password: 'nosqlisbetterthansql',
    user_status: 'Пользователь',
    name: 'Анастасия',
    rating: 5.0,
    create_date: '2022-03-29',
    reviews: [
        {
            name: 'Рудольф',
            mark: 5,
            text: 'Машина супер. Спасибо большое!',
            date: '2022-03-29'
        }
    ],
    dialogs: [
        {
            dialog_id: ObjectId('6563956f2bf7f94d97aeddd4'),
            ad_id: ObjectId('6563956f2bf7f94d97aeddd5'),
            messages: [
                {
                    user_id: ObjectId('65638b2bcf00e81ecfa8d832'),
                    text: 'Обмен на Ладу Ларгус интересен?',
                    timestamp: '2022-03-29 12:04:16Z'
                }
            ]
        }
    ],
    ads: [
        {
            ad_id: ObjectId('6563956f2bf7f94d97aeddd5'),
            photo: './cars_photos/amggt.jpg',
            brand: 'Mercedes',
            model: 'AMG-GT',
            year: 2018,
            color: 'черный',
            body: 'седан',
            mileage: 10000,
            engine: 'бензин',
            transmission: 'автомат',
            drive: 'задний',
            helm: 'левый',
            price: 10000000,
            create_date: '2022-03-29',
            edit_date: null,
            view: 808,
            status: 'Опубликовано'
        },
        {
            ad_id: ObjectId('6563956f2bf7f94d97aeddd6'),
            photo: './cars_photos/sellBestCarEver.jpg',
            brand: 'Mercedes',
            model: 'AMG-GT R',
            year: 2018,
            color: 'черный',
            body: 'седан',
            mileage: 10000,
            engine: 'бензин',
            transmission: 'автомат',
            drive: 'задний',
            helm: 'левый',
            price: 14000000,
            create_date: '2022-03-29',
            edit_date: null,
            view: 808,
            status: 'Проверка'
        },
        {
            ad_id: ObjectId('657599f971dd4c9a9e467dff'),
            photo: './cars_photos/landcruiser.png',
            brand: 'Toyota',
            model: 'Land Cruiser',
            year: 2023,
            color: 'красный',
            body: 'внедорожник',
            mileage: 0,
            engine: 'дизель',
            transmission: 'автомат',
            drive: 'полный',
            helm: 'левый',
            price: 13000000,
            create_date: '2023-12-10',
            edit_date: null,
            view: 0,
            status: 'Опубликовано'
        }
    ]
}
```
## Данные покупателя:
```shell
{
    _id: ObjectId('65638f51a70b034fa69d9752'),
    login: 'buyer',
    password: 'nosql',
    user_status: 'Пользователь',
    name: 'Рудольф',
    rating: [],
    create_date: '2022-03-29',
    reviews: [],
    dialogs: [
        {
            dialog_id: ObjectId('6563956f2bf7f94d97aeddd4'),
            ad_id: ObjectId('6563956f2bf7f94d97aeddd5'),
            messages: [
                {
                    user_id: ObjectId('65638f51a70b034fa69d9752'),
                    text: 'Да, интересен! Беру!',
                    timestamp: '2022-03-29 12:04:17Z'
                }
            ]
        }
    ],
    ads: []
}
```
## Данные администратора:
```shell
{
    _id: ObjectId('656393c68c47f9cf167bc8c6'),
    login: 'admin',
    password: 'admin',
    user_status: 'Администратор',
    name: 'Виктор',
    rating: [],
    create_date: '2022-03-29',
    reviews: [],
    dialogs: [],
    ads: []
}
```

## Предварительная проверка заданий

<a href=" ./../../../actions/workflows/1_helloworld.yml" >![1. Установка и настройка выбранной БД + ЯП]( ./../../actions/workflows/1_helloworld.yml/badge.svg)</a>

<a href=" ./../../../actions/workflows/2_usecase.yml" >![2. Usecase]( ./../../actions/workflows/2_usecase.yml/badge.svg)</a>

<a href=" ./../../../actions/workflows/3_data_model.yml" >![3. Модель данных]( ./../../actions/workflows/3_data_model.yml/badge.svg)</a>

<a href=" ./../../../actions/workflows/4_prototype_store_and_view.yml" >![4. Прототип хранение и представление]( ./../../actions/workflows/4_prototype_store_and_view.yml/badge.svg)</a>

<a href=" ./../../../actions/workflows/5_prototype_analysis.yml" >![5. Прототип анализ]( ./../../actions/workflows/5_prototype_analysis.yml/badge.svg)</a> 

<a href=" ./../../../actions/workflows/6_report.yml" >![6. Пояснительная записка]( ./../../actions/workflows/6_report.yml/badge.svg)</a>

<a href=" ./../../../actions/workflows/7_app_is_ready.yml" >![7. App is ready]( ./../../actions/workflows/7_app_is_ready.yml/badge.svg)</a>
