function ajax_get_data(type_filter_id, callback) {
    let xhrequest = new XMLHttpRequest();
    let xhrequest_url = `/book/${type_filter_id}`;
    xhrequest.onreadystatechange = function () {
        if(this.readyState === 4 && this.status === 200) callback(this.responseText);
    };
    xhrequest.open("GET", xhrequest_url,true);
    xhrequest.send();
}

function filter_all(btn) {
    ajax_get_data(btn.id, (response) => {
        let books_filter = JSON.parse(response);
        for (let book_id_filter of books_filter) document.getElementById(book_id_filter).style.visibility = "visible";
    });
}

function filter_in(btn) {
    ajax_get_data("filter_all", (response) => {
        let books_filter = JSON.parse(response);
        for (let book_id_filter of books_filter) document.getElementById(book_id_filter).style.visibility = "visible";
    });
    ajax_get_data(btn.id, (response) => {
        let books_filter = JSON.parse(response);
        for(let book_id_filter of books_filter) document.getElementById(book_id_filter).style.visibility = "hidden";
    });

}
function filter_taken(btn) {
    ajax_get_data("filter_all", (response) => {
        let books_filter = JSON.parse(response);
        for (let book_id_filter of books_filter) document.getElementById(book_id_filter).style.visibility = "visible";
    });
    ajax_get_data(btn.id, (response) => {
        let books_filter = JSON.parse(response);
        for(let book_id_filter of books_filter) document.getElementById(book_id_filter).style.visibility = "hidden";
    });
}