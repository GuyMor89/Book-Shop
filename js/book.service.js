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

    if (!loadFromStorage('bookArray').length > 0) saveToStorage('bookArray', demoBooks)
    return loadFromStorage('bookArray')
}


var gBooks = loadDemoData()

function getBooks() {
    return gBooks
}


function removeBook(title) {
    var bookIdToRemove = getBooks().findIndex((book) => book.title === title)
    if (bookIdToRemove > -1) getBooks().splice(bookIdToRemove, 1)

    saveToStorage('bookArray', gBooks)
}


function saveToStorage(key, value) {
    var valueString = JSON.stringify(value)
    localStorage.setItem(key, valueString)
}

function loadFromStorage(key) {
    var valueString = localStorage.getItem(key)
    return JSON.parse(valueString)
}

