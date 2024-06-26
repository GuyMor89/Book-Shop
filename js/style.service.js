'use strict'

function emptyTable() {
    var table = document.querySelector('.table')

    var injectedHTML = document.querySelectorAll('[data-idx]')
    injectedHTML.forEach(element => element.remove())

    var emptyHTML =
        `<div class="empty" data-idx>No matching books were found..</div>`

    table.insertAdjacentHTML('beforeend', emptyHTML)

    var emptyGridArea = `"empty empty empty empty"`

    var currentGridAreas = `"title0 price0 rating0 actions0"`
    var updatedGridAreas = currentGridAreas + emptyGridArea

    table.style.gridTemplateAreas = updatedGridAreas
}


var messageInterval

function displayMessage(message) {
    var messageModal = document.querySelector('.message')
    clearTimeout(messageInterval)

    messageModal.style.visibility = 'visible'
    messageModal.innerText = `${message}`

    messageInterval = setTimeout(() => {
        messageModal.style.visibility = 'hidden'
    }, 1000);
}



function onClearFilter() {
    filterBy = { title: '', price: 0, rating: 0 }
    var titleInput = document.querySelector('.input-title')
    titleInput.value = ''
    var priceInput = document.querySelector('.input-price')
    priceInput.value = 0
    var ratingInput = document.querySelector('.input-rating')
    ratingInput.value = 0

    renderTable()
}


function displayStats() {
    var statsFooter = document.querySelector('.stats-footer')

    var bookPrices = getBooks().reduce((accu, book) => {
        if (!accu['cheap']) accu['cheap'] = []
        if (book.price <= 80) {
            accu['cheap'].push(book.price)
        }
        if (!accu['midrange']) accu['midrange'] = []
        if (book.price > 80 && book.price < 200) {
            accu['midrange'].push(book.price)
        }
        if (!accu['expensive']) accu['expensive'] = []
        if (book.price >= 200) {
            accu['expensive'].push(book.price)
        }
        return accu
    }, {})

    statsFooter.innerHTML =
        `<div class="stats-container">
     <div class="expensive">Expensive Books: ${bookPrices.expensive.length}</div> 
     <div class="midrange">Midrange Books: ${bookPrices.midrange.length}</div>
     <div class="cheap">Cheap Books: ${bookPrices.cheap.length}</div>
     </div>`
}

