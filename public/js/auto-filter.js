let db_dataset = {
    'Марка': [],
    'Модель': [],
    'Год': [],
    'Цвет': [],
    'Кузов': [],
    'Пробег': [],
    'Двигатель': [],
    'Коробка': [],
    'Привод': [],
    'Руль': []
}

function filter(input) {
    let par = input.closest(".dropdown-el").getElementsByTagName('span')[0]

    if (input.innerHTML === "Очистить"){
        par.innerHTML = par.title
        db_dataset[par.title] = []
    }
    else{
        db_dataset[par.title].push(input.innerHTML)
        if (par.innerHTML === par.title)
            par.innerHTML = input.innerHTML
        else {
            par.innerHTML += ' ' + input.innerHTML
        }

    }
}

function sendForm(input){
    let filter = input.closest(".menus-filter")
    let data = filter.getElementsByClassName('name-filter')
    let year = document.getElementById('year')
    let mileage = document.getElementById('mileage')

    db_dataset['Год'] = year.value
    db_dataset['Пробег'] = mileage.value

    console.log(db_dataset)
}