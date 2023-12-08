function filter(input) {
    console.log(input.innerHTML)

    let par = input.closest(".dropdown-el").getElementsByTagName('span')[0]
    let name = par.innerHTML

    console.log(input)
    console.log(input.innerHTML)

    if (input.innerHTML === "Очистить"){
        par.innerHTML = par.title
    }
    else{
        par.innerHTML = input.innerHTML
    }
}

function sendForm(input){
    let par = input.closest(".menus-filter").getElementsByClassName('name-filter')
    for (let i = 0; i < par.length; i++)
        console.log(par[i].innerHTML)
    console.log(par)
}