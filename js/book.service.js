'use strict'

const gBooks = [
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
    },
    {
        id: 4,
        title: 'A Song of Ice and Fire',
        price: 200
    },
    {   id: 5,
        title: 'Sherlock Holmes',
        price: 50
    }
]

function getBooks() {
    return gBooks
}


function removeBook(title) {
    var bookIdToRemove = getBooks().findIndex((book) => book.title === title)
    if (bookIdToRemove > -1) getBooks().splice(bookIdToRemove, 1)
}

