'use strict'


function loadDemoData() {

    const demoBooks = [
        {
            id: 1,
            title: 'Harry Potter',
            price: 120
        },
        {
            id: 2,
            title: 'Flowers for Algernon',
            price: 75
        },
        {
            id: 3,
            title: 'Persuasion',
            price: 90
        }
    ]
        saveToStorage('bookArray', demoBooks)
        bookBackup = getBooks()
        renderTable()
}

var bookBackup = getBooks()

function getBooks() {
    return loadFromStorage('bookArray')
}


function deleteBook(title, id) {

    var bookArray = getBooks()
    var bookIdToRemove = bookArray.findIndex(book => book.title === title)
    var backupIdToRemove = bookBackup.findIndex(book => book.id === id)

    console.log(bookBackup);

    if (bookIdToRemove > -1 && backupIdToRemove > -1) {
        bookArray.splice(bookIdToRemove, 1)
        bookBackup.splice(backupIdToRemove, 1)
    }

    saveToStorage('bookArray', bookArray)
    bookBackup = getBooks()
}


function filterBooks(title) {

    var filteredBooks = getBooks().filter(book => book.title.toLowerCase().includes(title))

    if (!title) filteredBooks = bookBackup

    saveToStorage('bookArray', filteredBooks)
}


function sortBooksByTitle(direction) {

    var booksSortedDown = getBooks().sort((a, b) => b.title.localeCompare(a.title))
    var booksSortedUp = getBooks().sort((a, b) => a.title.localeCompare(b.title))

    var sortedBooks = direction === 'down' ? booksSortedDown : booksSortedUp

    saveToStorage('bookArray', sortedBooks)
    bookBackup = getBooks()

    renderTable()
}

function sortBooksByPrice(direction) {

    var booksSortedDown = getBooks().sort((a, b) => b.price - a.price)
    var booksSortedUp = getBooks().sort((a, b) => a.price - b.price)

    var sortedBooks = direction === 'down' ? booksSortedDown : booksSortedUp

    saveToStorage('bookArray', sortedBooks)
    bookBackup = getBooks()

    renderTable()
}
