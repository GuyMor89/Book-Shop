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

function addBook() {
    var input = document.querySelector('[placeholder="Add a book"]').value
    gBooks.push({ title: input, price: getRandomInt(1, 20) * 10 })
}