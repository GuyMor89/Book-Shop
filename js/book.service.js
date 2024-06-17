'use strict'

const gBooks = [
    {
        title: 'Harry Potter',
        price: 120
    },
    {
        title: 'Flowers for Algernon',
        price: 75
    },
    {
        title: 'Persuasion',
        price: 90
    },
    {
        title: 'A Song of Ice and Fire',
        price: 200
    },
    {
        title: 'Sherlock Holmes',
        price: 50
    }
]

function getBooks() {
    return gBooks
}


function removeBook(title) {
    var bookIdToRemove = getBooks().findIndex((book, idx) => book.title === title)
    if (bookIdToRemove > -1) gBooks.splice(bookIdToRemove, 1)
}

