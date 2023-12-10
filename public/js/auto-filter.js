// let db_dataset = {
//     'Марка': [],
//     'Модель': [],
//     'Год': [],
//     'Цвет': [],
//     'Кузов': [],
//     'Пробег': [],
//     'Двигатель': [],
//     'Коробка': [],
//     'Привод': [],
//     'Руль': []
// }

function filter(input) {
    let par = input.closest(".dropdown-el").getElementsByTagName('span')[0]
    console.log(input)
    if (input.innerHTML === "Очистить"){
        par.innerHTML = par.title
        // db_dataset[par.title] = []
    }
    else{
        // db_dataset[par.title].push(input.innerHTML)
        if (par.innerHTML === par.title)
            par.innerHTML = input.innerHTML
        else {
            par.innerHTML = input.innerHTML
            // par.innerHTML += ' ' + input.innerHTML
        }

    }
}

// function sendForm(input){
//     let filter = input.closest(".menus-filter")
//     let data = filter.getElementsByClassName('name-filter')
//     let year = document.getElementById('year')
//     let mileage = document.getElementById('mileage')
//     console.log(data)
//     // db_dataset['Год'] = year.value
//     // db_dataset['Пробег'] = mileage.value
//
//     data = {
//         filter_brand: data[0].innerHTML,
//         filter_model: data[1].innerHTML,
//         filter_year: year.value,
//         filter_color: data[2].innerHTML,
//         filter_body: data[3].innerHTML,
//         filter_mileage: mileage.value,
//         filter_engine: data[4].innerHTML,
//         filter_transmission: data[5].innerHTML,
//         filter_drive: data[6].innerHTML,
//         filter_helm: data[7].innerHTML
//     }
//     // console.log(data)
//
//     var xhr = new XMLHttpRequest();
//
//     xhr.open("POST", "/mainfilter", true);
//     xhr.setRequestHeader("Content-Type", "application/json");
//
//     data = JSON.stringify(data);
//     console.log("Send")
//     console.log(data)
//     xhr.send(data);
// }