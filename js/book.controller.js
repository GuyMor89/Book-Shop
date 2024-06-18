'use strict'

function onInit() {
    renderTable()
}

function renderTable() {
    var table = document.querySelector('.table')

    var injectedHTML = document.querySelectorAll('[data-idx]')
    injectedHTML.forEach(element => element.remove())

    var bookHTML = getBooks().map((book, idx) =>
        `<div class="title title${idx + 1}" data-idx>${book.title}</div>
         <div class="price price${idx + 1}" data-idx>${book.price}</div>
         <div class="actions actions${idx + 1}" data-idx>
                <div class="read read${idx + 1}" data-idx onclick="onDisplayBook(${book.id})">Read</div>
                <div class="update update${idx + 1}" data-idx onclick="onUpdateBookTitle(${idx + 1}), onUpdateBookPrice(${idx + 1})">Update</div>
                <div class="delete delete${idx + 1}" data-idx onclick="onRemoveBook('${book.title}')">Delete</div>
         </div>`
    )
    table.insertAdjacentHTML('beforeend', bookHTML.join(''))


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

var id = 6

function onAddBook(event) {
    event.preventDefault()

    var input = document.querySelector('[placeholder="Add a book"]').value
    gBooks.push({ id: id++, title: input, price: getRandomInt(1, 20) * 10 })

    renderTable()
}

function onRemoveBook(title) {
    removeBook(title)

    renderTable()
}


function onUpdateBookTitle(idx) {
    const id = idx - 1
    const elTitle = document.querySelector(`.title${idx}`)
    console.log(elTitle);

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

        input.replaceWith(elTitle)
    }

    switchToInput(elTitle, id)
}

function onUpdateBookPrice(idx) {
    console.log(idx);

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