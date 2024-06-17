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
                <div class="read read${idx + 1}" data-idx>Read</div>
                <div class="update update${idx + 1}" data-idx>Update</div>
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