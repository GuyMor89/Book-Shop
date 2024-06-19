'use strict'

function onInit() {
    renderTable()
}

function renderTable() {
    var table = document.querySelector('.table')

    injectedHTML(table)
    injectCSS(table)
}

function injectedHTML(table) {
    var injectedHTML = document.querySelectorAll('[data-idx]')
    injectedHTML.forEach(element => element.remove())

    var bookHTML = getBooks().map((book, idx) =>
        `<div class="title title${idx + 1}" data-idx>${book.title}</div>
         <div class="price price${idx + 1}" data-idx>${book.price}</div>
         <div class="actions actions${idx + 1}" data-idx>
            <div class="read read${idx + 1}" data-idx onclick="onDisplayBook(${book.id})">Read</div>
            <div class="update update${idx + 1}" data-idx onclick="onUpdateBookTitle(${idx + 1}), onUpdateBookPrice(${idx + 1})">Update</div>
            <div class="delete delete${idx + 1}" data-idx onclick="onDeleteBook('${book.title}')">Delete</div>
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


function onAddBook(event) {
    event.preventDefault()

    var id = gBooks.length + 1

    var input = document.querySelector('[placeholder="Add a book"]').value

    if (input === '') return displayMessage('Can\'t add blank title')

    gBooks.push({ id, title: input, price: getRandomInt(1, 20) * 10 })

    saveToStorage('bookArray', gBooks)
    displayMessage('Book added!')

    renderTable()
}

function onDeleteBook(title) {
    removeBook(title)
    displayMessage('Book deleted!')

    renderTable()
}


function onUpdateBookTitle(idx) {

    const id = idx - 1
    const elTitle = document.querySelector(`.title${idx}`)

    function switchToInput(elTitle, id) {

        if (elTitle.tagName.toLowerCase() === 'input') {
            return
        }

        var input = document.createElement('input')
        input.classList.add('title', `title${idx}`)
        input.value = elTitle.innerText
        input.onkeydown = (enter) => { if (enter.key === 'Enter') switchToDiv(elTitle, input, id) }

        elTitle.replaceWith(input)
        input.focus()
    }
    function switchToDiv(elTitle, input, id) {
        elTitle.innerText = input.value
        gBooks[id].title = input.value
        saveToStorage('bookArray', gBooks)
        displayMessage('Title updated!')

        input.replaceWith(elTitle)
    }

    switchToInput(elTitle, id)

    saveToStorage('bookArray', gBooks)
}

function onUpdateBookPrice(idx) {

    const id = idx - 1
    const elPrice = document.querySelector(`.price${idx}`)

    function switchToInput(elPrice, id) {

        if (elPrice.tagName.toLowerCase() === 'input') {
            return
        }

        var input = document.createElement('input')
        input.classList.add('price', `price${idx}`)
        input.value = elPrice.innerText
        input.onkeydown = (enter) => { if (enter.key === 'Enter') switchToDiv(elPrice, input, id) }

        elPrice.replaceWith(input)
        input.focus()
    }
    function switchToDiv(elPrice, input, id) {
        elPrice.innerText = input.value
        gBooks[id].price = input.value
        saveToStorage('bookArray', gBooks)
        displayMessage('Price updated!')

        input.replaceWith(elPrice)
    }

    switchToInput(elPrice, id)
}

function onDisplayBook(elBtn) {
    var modalOverlay = document.querySelector('.modal-overlay')
    modalOverlay.style.display = 'block'

    var bookToDisplay = getBooks().find(book => book.id === elBtn)

    var modal = document.querySelector('.modal')
    modal.innerHTML = `<span>Book Title:</span> ${bookToDisplay.title}<br>
                       <span>Book Price:</span> ${bookToDisplay.price}<br>
                       <span>Book ID:</span> ${bookToDisplay.id}`
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