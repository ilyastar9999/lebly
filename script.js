let db;
init()
async function init() {
    db = await idb.openDb('booksDb',1, db => {
        db.createObjectStore('books', {keyPath : 'name'})
    })
    list()
}

async function list() {
    listBook = document.getElementById("Library")
    let tx = db.transaction('books');
    let bookStore = tx.objectStore('books')

    let books = await bookStore.getAll()
    if (books.length) {
        listBook.innerHTML = books.map(book => `<li>
        название: ${book.name}, цена: ${book.price} </li>`)
    }
    else {
        listBook.innerHTML = '<p> Список книг пуст. Пожалуйста, добавьте книги по кнопке сверху.'
    }
}

async function clearBooks(){
    let tx = db.transaction('books', 'readwrite')
    await tx.objectStore('books').clear()
    await list()
}

async function addBook() {
    let name = prompt("Введите название книги")
    let price = +prompt("Введите цену книги")
    
    let tx = db.transaction('books', 'readwrite')
    try {
        await tx.objectStore('books').add({name, price});
        await list();
    } catch(err) {
        if (err.naame == 'ConstraintError') {
            alert("Книга с таким именем уже существует")
            await(addBook)
        } else {
            throw err;
        }

    }
}

window.addEventListener('unhandledrejection', event => {
    alert("Ошибка " + event.reason.message)
})