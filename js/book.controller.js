'use strict'


var filterBy = []
var sortBy = { title: 0, price: 0 }


function onInit() {
    renderTable()

    displayStats()
}


function emptyTable() {
    var table = document.querySelector('.table')

    var injectedHTML = document.querySelectorAll('[data-idx]')
    injectedHTML.forEach(element => element.remove())

    var emptyHTML =
        `<div class="empty" data-idx>No matching books were found..</div>`

    table.insertAdjacentHTML('beforeend', emptyHTML)

    var emptyGridArea = `"empty empty empty"`

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

        var bookHTML = getBooks().map((book) =>
            `<div class="title title${book.id}" data-idx>${book.title}</div>
             <div class="price price${book.id}" data-idx>${book.price}</div>
             <div class="rating rating${book.id}" data-idx>${getStarsImg(book.rating)}</div>
             <div class="actions actions${book.id}" data-idx>
                <div class="read read${book.id}" data-idx onclick="onDisplayBook(${book.id})">Read</div>
                <div class="update update${book.id}" data-idx onclick="onUpdateBook('${book.title}')">Update</div>
                <div class="delete delete${book.id}" data-idx onclick="onDeleteBook('${book.title}')">Delete</div>
         </div>`
        )
        table.insertAdjacentHTML('beforeend', bookHTML.join(''))
    }


    function injectCSS(table) {
        var bookGridArea = getBooks().map((book) =>
            `"title${book.id} price${book.id} rating${book.id} actions${book.id}"`
        )

        var currentGridAreas = `"title0 price0 rating0 actions0"`
        var updatedGridAreas = currentGridAreas + bookGridArea.join('')

        table.style.gridTemplateAreas = updatedGridAreas


        var bookCSS = getBooks().map((book) =>
            `.title${book.id} { grid-area: title${book.id} }
             .price${book.id} { grid-area: price${book.id} }
             .rating${book.id} { grid-area: rating${book.id}}
             .actions${book.id} { grid-area: actions${book.id} }`
        ).join('')

        colorLinesInCSS()

        var styleSheet = document.createElement('style')
        styleSheet.textContent = bookCSS

        document.head.appendChild(styleSheet)
    }
}


function onSortBooks(type, direction) {
    sortBy[type] = direction
    console.log(sortBy);

    renderTable()
}


function onAddBook(event) {
    event.preventDefault()

    var input = document.querySelector('[placeholder="Type a title.."]')
    if (input.value === '') return displayMessage('Can\'t add blank title')

    getImageSrc(input.value)

    setTimeout(() => {
        addBook(input)

        input.value = ''

        displayMessage('Book added!')

        renderTable()
    }, 1000)
}

function onDeleteBook(title) {
    deleteBook(title)
    displayMessage('Book deleted!')

    renderTable()

    if (getBooks().length === 0) return emptyTable()
}


function onUpdateBook(title) {
    var bookArray = gBooks
    var bookIdToUpdate = bookArray.findIndex(book => book.title === title)

    UpdateBookTitle()
    UpdateBookPrice()

    function UpdateBookTitle() {

        const elTitle = document.querySelector(`.title${bookArray[bookIdToUpdate].id}`)

        switchToInput(elTitle, bookIdToUpdate)

        function switchToInput(elTitle, bookIdToUpdate) {

            if (elTitle.tagName.toLowerCase() === 'input') {
                return
            }

            var input = document.createElement('input')
            input.classList.add('title', `title${bookArray[bookIdToUpdate].id}`)
            input.value = elTitle.innerText

            elTitle.replaceWith(input)
            input.focus()

            input.onkeydown = (enter) => { if (enter.key === 'Enter') switchToDiv(elTitle, input, bookIdToUpdate) }
        }
        function switchToDiv(elTitle, input, bookIdToUpdate) {

            elTitle.innerText = capitalizeInput(input.value)
            bookArray[bookIdToUpdate].title = capitalizeInput(input.value)
            getImageSrc(input.value)

            setTimeout(() => {
                bookArray[bookIdToUpdate].image = image.src
                saveToStorage('bookArray', bookArray)
                displayMessage('Title updated!')

                input.replaceWith(elTitle)
                renderTable()
                if (getBooks().length === 0) return emptyTable()
            }, 1000);
        }
    }

    function UpdateBookPrice() {

        const elPrice = document.querySelector(`.price${bookArray[bookIdToUpdate].id}`)

        switchToInput(elPrice, bookIdToUpdate)

        function switchToInput(elPrice, bookIdToUpdate) {

            if (elPrice.tagName.toLowerCase() === 'input') {
                return
            }

            var input = document.createElement('input')
            input.classList.add('price', `price${bookArray[bookIdToUpdate].id}`)
            input.value = elPrice.innerText

            elPrice.replaceWith(input)
            input.focus()

            input.onkeydown = (enter) => { if (enter.key === 'Enter') switchToDiv(elPrice, input, bookIdToUpdate) }
        }
        function switchToDiv(elPrice, input, bookIdToUpdate) {

            elPrice.innerText = +input.value
            bookArray[bookIdToUpdate].price = +input.value

            saveToStorage('bookArray', bookArray)
            displayMessage('Price updated!')

            input.replaceWith(elPrice)
        }
    }
}



function onDisplayBook(idx) {
    var modalOverlay = document.querySelector('.modal-overlay')
    modalOverlay.style.display = 'block'

    var bookToDisplay = gBooks.find(book => book.id === idx)

    var bookImageSrc = bookToDisplay.image

    var modal = document.querySelector('.modal')
    modal.innerHTML = `<div class="modal-img"><img src=${bookImageSrc}></div>
                           <div class="title-header header">Book Title</div>
                           <div class="title-content content">${bookToDisplay.title}</div>
                           <div class="price-header header">Book Price</div>
                           <div class="price-content content">${bookToDisplay.price}</div>
                           <div class="rating-header header"> Rating</div>
                           <div class="rating-content content">${getStarsImg(bookToDisplay.rating)}</div>`
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


function onFilterBooks(inputVal, event) {
    event.preventDefault()

    filterBy = inputVal.toLowerCase()

    if (getBooks().length === 0) return emptyTable()

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

