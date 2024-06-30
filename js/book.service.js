'use strict'


function loadBooks() {
    const demoBooks = [
        {
            id: 1,
            title: 'Harry Potter',
            price: 120,
            rating: 4,
            image: 'https://play-lh.googleusercontent.com/xo2HfLoAszntYndTjrUhZXqa7xCmeSkSXxcsPPeQx3-cRrzYSGmbjSwKO2F7o-RWuJhy=w240-h480-rw'
        },
        {
            id: 2,
            title: 'Flowers for Algernon',
            price: 75,
            rating: 5,
            image: 'https://m.media-amazon.com/images/I/81HntONlwgL._AC_UF1000,1000_QL80_.jpg'
        },
        {
            id: 3,
            title: 'Persuasion',
            price: 90,
            rating: 5,
            image: 'https://m.media-amazon.com/images/M/MV5BZDg3MzdiYjAtZWQ0MC00MDY4LWE5ZWEtNjliNTE3ZDZjNTU3XkEyXkFqcGdeQXVyMTAyMjQ3NzQ1._V1_.jpg'
        }
    ]

    if (loadFromStorage('bookArray') === undefined ||
        loadFromStorage('bookArray').length === 0)
        saveToStorage('bookArray', demoBooks)

    var bookArray = loadFromStorage('bookArray')
    return bookArray
}

var gBooks = loadBooks()


function getBooks() {
    var bookArray = gBooks

    bookArray = bookArray.filter(book => book.title.toLowerCase().includes(filterBy.title))
    bookArray = bookArray.filter(book => book.price >= +filterBy.price)
    bookArray = bookArray.filter(book => book.rating >= +filterBy.rating)

    bookArray = bookArray.sort((a, b) => (b.price - a.price) * sortBy.price)
    bookArray = bookArray.sort((a, b) => (b.title.localeCompare(a.title)) * sortBy.title)
    bookArray = bookArray.sort((a, b) => (b.rating - a.rating) * sortBy.rating)

    pageBy.total = bookArray.length

    var pageStart = (pageBy.page * pageBy.amount)
    var pageEnd = ((pageBy.page * pageBy.amount) + pageBy.amount - 1)

    bookArray = bookArray.filter((book, idx) => idx >= pageStart && idx <= pageEnd)

    return bookArray
}

function deleteBook(id) {
    var bookArray = gBooks
    var bookIdToRemove = bookArray.findIndex(book => book.id === +id)

    if (bookIdToRemove > -1) bookArray.splice(bookIdToRemove, 1)

    saveToStorage('bookArray', bookArray)
}

function addBook(inputTitle, inputPrice, inputRating) {
    var bookArray = gBooks
    var id = bookArray[bookArray.length - 1].id + 1

    bookArray.push({
        id, title: capitalizeInput(inputTitle),
        price: +inputPrice,
        rating: +inputRating,
        image: image.src
    })

    saveToStorage('bookArray', bookArray)
}

function updateBook(id, inputTitle, inputPrice, inputRating) {
    var bookArray = gBooks
    var bookIdToUpdate = bookArray.findIndex(book => book.id === +id)

    bookArray[bookIdToUpdate].title = capitalizeInput(inputTitle)
    bookArray[bookIdToUpdate].price = +inputPrice
    bookArray[bookIdToUpdate].rating = +inputRating
    bookArray[bookIdToUpdate].image = image.src

    saveToStorage('bookArray', bookArray)
}