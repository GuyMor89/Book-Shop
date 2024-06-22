'use strict'

function onInit() {
    if (getBooks().length === 0) return emptyTable()

    renderTable()

    onDisplayStats()
}


function emptyTable() {
    var table = document.querySelector('.table')

    var injectedHTML = document.querySelectorAll('[data-idx]')
    injectedHTML.forEach(element => element.remove())

    var emptyHTML =
        `<div class="empty" data-idx>No matching books were found..</div>
    <div class="demo" onclick="loadDemoData()" data-idx>Return Demo Books</div>`

    table.insertAdjacentHTML('beforeend', emptyHTML)

    var emptyGridArea = `"empty empty empty" "demo demo demo"`

    var currentGridAreas = `"title0 price0 actions0"`
    var updatedGridAreas = currentGridAreas + emptyGridArea

    table.style.gridTemplateAreas = updatedGridAreas
}


function renderTable() {
    var table = document.querySelector('.table')

    injectHTML(table)
    injectCSS(table)

    function injectHTML(table) {
        var injectedHTML = document.querySelectorAll('[data-idx]')
        injectedHTML.forEach(element => element.remove())

        var bookHTML = getBooks().map((book, idx) =>
            `<div class="title title${idx + 1}" data-idx>${book.title}</div>
             <div class="price price${idx + 1}" data-idx>${book.price}</div>
             <div class="actions actions${idx + 1}" data-idx>
                <div class="read read${idx + 1}" data-idx onclick="onDisplayBook(${book.id})">Read</div>
                <div class="update update${idx + 1}" data-idx onclick="onUpdateBook('${book.title}', ${book.id})">Update</div>
                <div class="delete delete${idx + 1}" data-idx onclick="onDeleteBook('${book.title}', ${book.id})">Delete</div>
         </div>`
        )
        table.insertAdjacentHTML('beforeend', bookHTML.join(''))
    }


    function injectCSS(table) {
        var bookGridArea = getBooks().map((book, idx) =>
            `"title${idx + 1} price${idx + 1} actions${idx + 1}"`
        )

        var currentGridAreas = `"title0 price0 actions0"`
        var updatedGridAreas = currentGridAreas + bookGridArea.join('')

        table.style.gridTemplateAreas = updatedGridAreas


        var bookCSS = getBooks().map((book, idx) =>
            `.title${idx + 1} { grid-area: title${idx + 1} }
             .price${idx + 1} { grid-area: price${idx + 1} }
             .actions${idx + 1} { grid-area: actions${idx + 1} }`
        ).join('')


        var styleSheet = document.createElement('style')
        styleSheet.textContent = bookCSS

        document.head.appendChild(styleSheet)
    }
}




function onAddBook(event) {
    event.preventDefault()

    var bookArray = getBooks()
    var id = bookArray.length + 1

    var input = document.querySelector('[placeholder="Type a title.."]').value
    if (input === '') return displayMessage('Can\'t add blank title')

    bookArray.push({ id, title: input, price: getRandomInt(1, 20) * 10 })
    bookBackup.push({ id, title: input, price: getRandomInt(1, 20) * 10 })

    var input = document.querySelector('[placeholder="Type a title.."]').value = ''

    saveToStorage('bookArray', bookArray)
    displayMessage('Book added!')

    renderTable()
}

function onDeleteBook(title, id) {
    deleteBook(title, id)
    displayMessage('Book deleted!')

    renderTable()

    if (getBooks().length === 0) return emptyTable()
}


function onUpdateBook(title, idx) {

    var bookArray = getBooks()
    var bookIdToUpdate = bookArray.findIndex(book => book.title === title)
    var backupIdToUpdate = bookBackup.findIndex(book => book.id === idx)

    onUpdateBookTitle(title, idx)
    onUpdateBookPrice(title, bookIdToUpdate)

    function onUpdateBookTitle() {

        const elTitle = document.querySelector(`.title${bookIdToUpdate + 1}`)

        function switchToInput(elTitle, bookIdToUpdate) {

            if (elTitle.tagName.toLowerCase() === 'input') {
                return
            }

            var input = document.createElement('input')
            input.classList.add('title', `title${bookIdToUpdate + 1}`)
            input.value = elTitle.innerText

            elTitle.replaceWith(input)
            input.focus()

            input.onkeydown = (enter) => { if (enter.key === 'Enter') switchToDiv(elTitle, input, bookIdToUpdate) }
        }
        function switchToDiv(elTitle, input, bookIdToUpdate) {

            elTitle.innerText = input.value
            bookArray[bookIdToUpdate].title = input.value
            bookBackup[backupIdToUpdate].title = input.value

            saveToStorage('bookArray', bookArray)
            displayMessage('Title updated!')

            input.replaceWith(elTitle)
        }

        switchToInput(elTitle, bookIdToUpdate)
    }

    function onUpdateBookPrice() {

        const elPrice = document.querySelector(`.price${bookIdToUpdate + 1}`)

        function switchToInput(elPrice, bookIdToUpdate) {

            if (elPrice.tagName.toLowerCase() === 'input') {
                return
            }

            var input = document.createElement('input')
            input.classList.add('price', `price${bookIdToUpdate + 1}`)
            input.value = elPrice.innerText

            elPrice.replaceWith(input)
            input.focus()

            input.onkeydown = (enter) => { if (enter.key === 'Enter') switchToDiv(elPrice, input, bookIdToUpdate) }
        }
        function switchToDiv(elPrice, input, bookIdToUpdate) {

            elPrice.innerText = +input.value
            bookArray[bookIdToUpdate].price = +input.value
            bookBackup[backupIdToUpdate].price = +input.value

            saveToStorage('bookArray', bookArray)
            displayMessage('Price updated!')

            input.replaceWith(elPrice)
        }

        switchToInput(elPrice, bookIdToUpdate)
    }
}



function onDisplayBook(idx) {
    imageArray.length = 0

    var modalOverlay = document.querySelector('.modal-overlay')
    modalOverlay.style.display = 'block'

    var bookToDisplay = getBooks().find(book => book.id === idx)
    logImageUrl(bookToDisplay.title)

    setTimeout(() => {
        var bookImageSrc = imageArray[0]

        var modal = document.querySelector('.modal')
        modal.innerHTML = `<div class="modal-img"><img src=${bookImageSrc}></div>
                           <div class="modal-title">Book Title: ${bookToDisplay.title}</div> 
                           <div class="modal-price">Book Price: ${bookToDisplay.price}</div>`
    }, 500);

}

window.onclick = function (event) {
    var modal = document.querySelector('.modal-overlay')
    if (event.target === modal && modal.style.display === 'block') {
        modal.style.display = 'none'
    }
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


function onFilterBooks(event) {
    event.preventDefault()

    var input = document.querySelector('[placeholder="Type to search.."]').value.toLowerCase()

    filterBooks(input)

    if (getBooks().length === 0) return emptyTable()

    renderTable()
}

function onDisplayStats() {
    var statsFooter = document.querySelector('.stats-footer')

    var bookPrices = getBooks().reduce((accu, book) => {
        if (!accu['cheap']) accu['cheap'] = []
        if (book.price < 80) {
            accu['cheap'].push(book.price)
        }
        if (!accu['midrange']) accu['midrange'] = []
        if (book.price > 80 && book.price < 200) {
            accu['midrange'].push(book.price)
        }
        if (!accu['expensive']) accu['expensive'] = []
        if (book.price > 200) {
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

