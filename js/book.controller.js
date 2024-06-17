'use strict'

function onInit() {
    renderTable()
}

function renderTable() {
    var table = document.querySelector('.table')

    var bookHTML = getBooks().map((book, idx) =>
        `<div class="title title${idx + 1}">${book.title}</div>
         <div class="price price${idx + 1}">${book.price}</div>
         <div class="actions actions${idx + 1}">
                <div class="read read${idx + 1}">Read</div>
                <div class="update update${idx + 1}">Update</div>
                <div class="delete delete${idx + 1}">Delete</div>
         </div>`
    )
    table.insertAdjacentHTML('beforeend', bookHTML.join(''))


    var bookGridArea = getBooks().map((book, idx) =>
        `"title${idx + 1} price${idx + 1} actions${idx + 1}"`
    )
    var currentGridAreas = getComputedStyle(table).gridTemplateAreas
    var updatedGridAreas = currentGridAreas + bookGridArea.join('')

    table.style.gridTemplateAreas = updatedGridAreas


    var bookCSS = getBooks().map((book, idx) =>
        `.title${idx + 1} { grid-area: title${idx + 1}}
    .price${idx + 1} {grid-area: price${idx + 1}}
    .actions${idx + 1} {grid-area: actions${idx + 1}}`
    )

    var styleSheet = document.createElement("style")
    styleSheet.textContent = bookCSS.join('')
    document.head.appendChild(styleSheet)

}


