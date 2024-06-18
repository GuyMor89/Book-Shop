'use strict'

function onInit() {
    renderTable()
}

function renderTable() {
    var table = document.querySelector('.table')

    var injectedHTML = document.querySelectorAll('[data-idx]')
    injectedHTML.forEach(element => element.remove())

    var bookHTML = getBooks().map((book) =>
        `<div class="title title${book.id}" data-idx>${book.title}</div>
         <div class="price price${book.id}" data-idx>${book.price}</div>
         <div class="actions actions${book.id}" data-idx>
                <div class="read read${book.id}" data-idx>Read</div>
                <div class="update update${book.id}" data-idx onclick="onUpdateBookTitle(${book.id})">Update</div>
                <div class="delete delete${book.id}" data-idx onclick="onRemoveBook('${book.title}')">Delete</div>
         </div>`
    )
    table.insertAdjacentHTML('beforeend', bookHTML.join(''))


    var bookGridArea = getBooks().map((book, idx) =>
        `"title${book.id} price${book.id} actions${book.id}"`
    )

    var currentGridAreas = `"title0 price0 actions0"`
    var updatedGridAreas = currentGridAreas + bookGridArea.join('')

    table.style.gridTemplateAreas = updatedGridAreas


    var bookCSS = getBooks().map((book, idx) =>
        `.title${book.id} { grid-area: title${book.id} }
         .price${book.id} { grid-area: price${book.id} }
         .actions${book.id} { grid-area: actions${book.id} }`
    ).join('')


    var styleSheet = document.createElement('style')
    styleSheet.textContent = bookCSS

    document.head.appendChild(styleSheet)
}


function onAddBook(event) {
    event.preventDefault()

    var input = document.querySelector('[placeholder="Add a book"]').value
    gBooks.push({ title: input, price: getRandomInt(1, 20) * 10 })

    renderTable()
}

function onRemoveBook(title) {
    removeBook(title)

    renderTable()
}


function onUpdateBookTitle(idx) {

    const id = idx - 1
    const elTitle = document.querySelector(`.title${idx}`)

    function switchToInput(elTitle, id) {
        var input = document.createElement('input')
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