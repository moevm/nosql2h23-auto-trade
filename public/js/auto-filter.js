function filter(input) {
    console.log(input.innerHTML)

    let par = input.closest(".dropdown-el").getElementsByTagName('span')[0]
    let name = par.innerHTML

    if (input.innerHTML === "Очистить"){
        par.innerHTML = par.title
    }
    else{
        par.innerHTML = input.innerHTML
    }


    // callAjaxGet(elem, (response) => {
    //     let array_id = JSON.parse(response);
    //     console.log('----------')
    //     console.log(array_id)
    //     console.log('----------')
    //     let bookBox = document.getElementById("bookBox");
    //     let html = ``
    //     for(item of array_id) {
    //         html += "\n" +
    //             "<div class=\"infoBook briefly w3-border-red\">\n" +
    //             "  <button class=\"w3-button w3-red fa fa-trash-o\" aria-hidden=\"true\" onclick=\"document.getElementById('id02').style.display='block'\" style=\"margin: 10px; float: right\"></button>\n" +
    //             "  <div class=\"w3-modal w3-animate-opacity\" id=\"id02\" style=\"text-align: center\">\n" +
    //             "    <div class=\"w3-modal-content w3-card-4\">\n" +
    //             "      <header class=\"w3-container w3-teal\"><span class=\"w3-button w3-large w3-display-topright fa fa-times-circle\" onclick=\"document.getElementById('id02').style.display='none'\" aria-hidden=\"true\"></span>\n" +
    //             "        <h2>Delete book</h2>\n" +
    //             "      </header>\n" +
    //             "      <div class=\"w3-container\">\n" +
    //             "        <p>Are you sure that you want delete this book?</p>\n" +
    //             "        <form action=\"book/0\" method=\"POST\" style=\"margin: 10px; display: inline-block;\">\n" +
    //             "          <button class=\"w3-button w3-white w3-border w3-border-purple w3-hover-purple\" type=\"submit\">Yes</button>\n" +
    //             "        </form>\n" +
    //             "        <button class=\"w3-button w3-white w3-border w3-border-purple w3-hover-purple\" onclick=\"document.getElementById('id02').style.display='none'\" type=\"submit\" style=\"display: inline-block\">No</button>\n" +
    //             "      </div>\n" +
    //             "    </div>\n" +
    //             `  </div><a href=\"book/${item.id}\" id=\"${item.id}\"><img class=\"book\" src=\"/public/img/bookdefault.jpg\"/>\n` +
    //             `    <h4>Book name: ${item.name}</h4>\n` +
    //             `    <h5>Author: ${item.author}</h5>\n` +
    //             `    <h5>Year: ${item.year}</h5></a>\n` +
    //             "</div>"
    //     }
    //     bookBox.innerHTML = html;
    // });
}

// function  callAjaxGet(elem, callback) {
//     let xhttp = new XMLHttpRequest();
//     xhttp.onreadystatechange = function () {
//         if(this.readyState == 4 && this.status == 200)
//             callback(this.responseText);
//     };
//     xhttp.open("GET",`/?id=${elem.id}&state=${elem.state}`,true);
//     xhttp.send();
// }