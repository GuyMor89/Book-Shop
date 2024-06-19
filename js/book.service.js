'use strict'


var gBooks = loadFromStorage('bookArray')

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

