'use strict'


var filterBy = { title: '', price: 0, rating: 0 }
var sortBy = { title: 0, price: 0, rating: 0 }
var pageBy = { page: 0, amount: 5, total: 0 }
var layoutBy = 'rows'


function onInit() {
    readQueryParams()

    renderTable()

    // displayStats()
}


function renderTable() {
    var table = document.querySelector('.table')
    var tableGrid = document.querySelector('.table-grid-container')

    if (getBooks().length === 0) return emptyTable()

    if (layoutBy === 'grid') {
        injectHTMLGrid(tableGrid)
        injectCSSGrid(tableGrid)
    } else {
        injectHTMLTable(table)
        injectCSSTable(table)
    }

    function injectHTMLTable(table) {
        var injectedHTML = document.querySelectorAll('[data-idx]')
        injectedHTML.forEach(element => element.remove())

        var bookHTML = getBooks().map((book) =>
            `<div class="title title${book.id}" data-idx>${book.title}</div>
             <div class="price price${book.id}" data-idx>${book.price}</div>
             <div class="rating rating${book.id}" data-idx>${getRatingImage(book.rating)}</div>
             <div class="actions actions${book.id}" data-idx>
                <div class="read read${book.id}" data-idx onclick="onDisplayBook(${book.id})">Read</div>
                <div class="update update${book.id}" data-idx onclick="onOpenModal('${book.id}')">Update</div>
                <div class="delete delete${book.id}" data-idx onclick="onDeleteBook('${book.id}')">Delete</div>
         </div>`
        )
        table.insertAdjacentHTML('beforeend', bookHTML.join(''))
    }


    function injectCSSTable(table) {
        var bookGridArea = getBooks().map((book) =>
            `"title${book.id} price${book.id} rating${book.id} actions${book.id}"`
        )

        tableGrid.style.display = 'none'
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

    function injectHTMLGrid(tableGrid) {
        var injectedHTML = document.querySelectorAll('[data-idx]')
        injectedHTML.forEach(element => element.remove())

        var bookHTML = getBooks().map((book) =>
            `<div class="book book${book.id}-container" data-idx>
                 <div class="title-grid title${book.id}-grid" data-idx>${book.title}</div>
                 <div class="image-grid image${book.id}-grid" data-idx><img src="${book.image}"></div>
                 <div class="rating-grid rating${book.id}-grid" data-idx>${getRatingImage(book.rating)}</div>
                 <div class="actions-grid actions${book.id}-grid" data-idx>
                   <div class="read-grid read${book.id}-grid" data-idx onclick="onDisplayBook(${book.id})">Read</div>
                   <div class="update-grid update${book.id}-grid" data-idx onclick="onOpenModal('${book.id}')">Update</div>
                   <div class="delete-grid delete${book.id}-grid" data-idx onclick="onDeleteBook('${book.id}')">Delete</div>
                </div>
             </div>`
        )
        tableGrid.insertAdjacentHTML('beforeend', bookHTML.join(''))
    }

    function injectCSSGrid(tableGrid) {
        var bookContainerArea = getBooks().map((book, idx) => {
            if (idx === 0) return `"book${book.id} book${book.id} `
            if (getBooks().length === (pageBy.amount - 1) && idx === getBooks().length - 1) return `". . book${book.id} book${book.id} . ."`
            if (idx === getBooks().length - 1) return `book${book.id} book${book.id} ."`
            if ((idx % pageBy.amount) - 1 === 0) return `book${book.id} book${book.id} `
            if ((idx % pageBy.amount) - 2 === 0) return `book${book.id} book${book.id}" `
            if ((idx % pageBy.amount) - 3 === 0) return `". book${book.id} book${book.id} `
            if ((idx % pageBy.amount) - 4 === 0) return `book${book.id} book${book.id}"`
        })

        tableGrid.style.display = 'grid'
        tableGrid.style.gridTemplateAreas = bookContainerArea.join('')

        var bookContainerCSS = getBooks().map((book) =>
            `.book${book.id}-container { grid-area: book${book.id} }`
        ).join('')

        colorLinesInCSS()
        // colorBookLinesInCSS()

        var styleSheet = document.createElement('style')
        styleSheet.textContent = bookContainerCSS

        document.head.appendChild(styleSheet)
    }
    // displayStats()
    renderPageNumbers()
}


function onAddBook() {
    var bookModal = document.querySelector('.add-book-modal')

    var inputTitle = document.querySelector('.add-book-title-input')
    var inputPrice = document.querySelector('.add-book-price-input')
    var inputRating = document.querySelector('.add-book-rating-input')

    if (inputTitle.value === null || inputTitle.value === '' || inputTitle.value === 0) {
        return displayMessage('Can\'t add blank title')
    } else if (+inputPrice.value === null || inputPrice.value === '' || +inputPrice.value === 0) {
        return displayMessage('Can\'t add blank price')
    } else if (+inputRating.value === null || inputRating.value === '' || +inputRating.value === 0) {
        return displayMessage('Can\'t add blank rating')
    }

    getImageSrc(inputTitle.value)

    setTimeout(() => {
        addBook(inputTitle.value, inputPrice.value, inputRating.value)

        inputTitle.value = inputPrice.value = inputRating.value = ''

        displayMessage('Book added!')

        renderTable()
    }, 1000)

    bookModal.close()
}


function onDeleteBook(id) {
    deleteBook(id)
    displayMessage('Book deleted!')

    getBooks()

    pageBy.page = Math.ceil(pageBy.total / pageBy.amount) - 1

    renderTable()

    if (getBooks().length === 0) return emptyTable()
}


function onUpdateBook(id) {

    var bookModal = document.querySelector('.add-book-modal')

    var inputTitle = document.querySelector('.add-book-title-input')
    var inputPrice = document.querySelector('.add-book-price-input')
    var inputRating = document.querySelector('.add-book-rating-input')

    if (inputTitle.value === null || inputTitle.value === '' || inputTitle.value === 0) {
        return displayMessage('Can\'t add blank title')
    } else if (+inputPrice.value === null || inputPrice.value === '' || +inputPrice.value === 0) {
        return displayMessage('Can\'t add blank price')
    } else if (+inputRating.value === null || inputRating.value === '' || +inputRating.value === 0) {
        return displayMessage('Can\'t add blank rating')
    }

    getImageSrc(inputTitle.value)

    setTimeout(() => {
        updateBook(id, inputTitle.value, inputPrice.value, inputRating.value)

        inputTitle.value = inputPrice.value = inputRating.value = ''

        displayMessage('Book updated!')

        getBooks()

        pageBy.page = Math.ceil(pageBy.total / pageBy.amount) - 1

        renderTable()
    }, 1000);

    bookModal.close()
}

// Display the book reading modal

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
                           <div class="rating-content content">${getRatingImage(bookToDisplay.rating)}</div>`
}

window.onclick = function (event) {
    var modal = document.querySelector('.modal-overlay')
    if (event.target === modal && modal.style.display === 'block') {
        modal.style.display = 'none'
    }
}


// Display the book add or update modal

function onOpenModal(id) {
    var bookModal = document.querySelector('.add-book-modal')
    var modalFieldset = document.querySelector('.add-book-modal fieldset')
    var modalFieldsetContainer = document.querySelector('.fieldset-modal-container')

    var inputTitle = document.querySelector('.add-book-title-input')
    var inputPrice = document.querySelector('.add-book-price-input')
    var inputRating = document.querySelector('.add-book-rating-input')

    if (!id) {
        modalFieldsetContainer.insertAdjacentHTML('beforeend', `<button class="submit" onclick="onAddBook()" data-idx>Add</button>`)
        modalFieldset.insertAdjacentHTML('afterbegin', `<legend data-idx>Add Book</legend>`)
    } else if (id) {
        var bookArray = gBooks
        var bookIdToUpdate = bookArray.findIndex(book => book.id === +id)

        inputTitle.value = bookArray[bookIdToUpdate].title
        inputPrice.value = bookArray[bookIdToUpdate].price
        inputRating.value = bookArray[bookIdToUpdate].rating

        modalFieldsetContainer.insertAdjacentHTML('beforeend', `<button class="submit" onclick="onUpdateBook('${id}')" data-idx>Update</button>`)
        modalFieldset.insertAdjacentHTML('afterbegin', `<legend data-idx>Update Book</legend>`)
    }
    bookModal.showModal()
    inputTitle.focus()
}

function onCloseModal() {
    var bookModal = document.querySelector('.add-book-modal')
    var injectedHTML = document.querySelectorAll('.add-book-modal [data-idx]')
    injectedHTML.forEach(element => element.remove())

    var inputTitle = document.querySelector('.add-book-title-input')
    var inputPrice = document.querySelector('.add-book-price-input')
    var inputRating = document.querySelector('.add-book-rating-input')

    inputTitle.value = inputPrice.value = inputRating.value = ''

    bookModal.close()
}

function onSortBooks(type, direction) {
    sortBy[type] = direction

    getBooks()

    pageBy.page = Math.ceil(pageBy.total / pageBy.amount) - 1

    setQueryParams()
    renderTable()
}

function onFilterBooks(type, inputVal) {
    filterBy[type] = inputVal.toLowerCase()

    getBooks()

    if (getBooks().length === 0) pageBy.page = Math.ceil(pageBy.total / pageBy.amount) - 1

    setQueryParams()
    renderTable()
}

function onChangePage(direction, value) {
    var pageAmount = Math.ceil(pageBy.total / pageBy.amount) - 1

    if (direction === 'up') {
        if (pageBy.page === pageAmount) {
            pageBy.page = 0
        } else {
            pageBy.page += +value
        }
    }
    if (direction === 'down') {
        if (pageBy.page === 0) {
            pageBy.page = pageAmount
        } else {
            pageBy.page += +value
        }
    }
    renderTable()
}

function renderPageNumbers() {
    var previousPage = document.querySelector('.pagePrev')
    var currentPage = document.querySelector('.pageCurr')
    var nextPage = document.querySelector('.pageNext')

    var pageAmount = Math.ceil(pageBy.total / pageBy.amount) - 1

    currentPage.innerText = pageBy.page

    if (+currentPage.innerText === 0) {
        previousPage.innerText = pageAmount
    } else {
        previousPage.innerText = currentPage.innerText - 1
    }
    if (+currentPage.innerText === pageAmount) {
        nextPage.innerText = 0
    } else {
        nextPage.innerText = +currentPage.innerText + 1
    }

    setQueryParams()
    // changeTableHeight()
}

function onChangePageNums(elBtn) {
    pageBy.page = +elBtn.innerText

    renderTable()
}

function changeTableHeight() {
    var tableContainer = document.querySelector('.table-container')

    tableContainer.style.height = `${(pageBy.amount * 36) + 34}px`
}

