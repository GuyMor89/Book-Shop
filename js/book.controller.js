'use strict'


var filterBy = { title: '', price: 0, rating: 0 }
var sortBy = { title: 0, price: 0, rating: 0 }

function onInit() {
    renderTable()

    displayStats()
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
             <div class="rating rating${book.id}" data-idx>${getratingImg(book.rating)}</div>
             <div class="actions actions${book.id}" data-idx>
                <div class="read read${book.id}" data-idx onclick="onDisplayBook(${book.id})">Read</div>
                <div class="update update${book.id}" data-idx onclick="onOpenModal('${book.id}')">Update</div>
                <div class="delete delete${book.id}" data-idx onclick="onDeleteBook('${book.id}')">Delete</div>
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

function onOpenModal(id) {
    var bookModal = document.querySelector('.add-book-modal')
    var modalFieldset = document.querySelector('.add-book-modal fieldset')
    var modalFieldsetContainer = document.querySelector('.fieldset-modal-container')

    if (!id) {
        modalFieldsetContainer.insertAdjacentHTML('beforeend', `<button class="submit" onclick="onAddBook()" data-idx>Add</button>`)
        modalFieldset.insertAdjacentHTML('afterbegin', `<legend data-idx>Add Book</legend>`)
    } else if (id) {
        var inputTitle = document.querySelector('.add-book-title-input')
        var inputPrice = document.querySelector('.add-book-price-input')
        var inputRating = document.querySelector('.add-book-rating-input')

        var bookArray = gBooks
        var bookIdToUpdate = bookArray.findIndex(book => book.id === +id)

        inputTitle.value = bookArray[bookIdToUpdate].title
        inputPrice.value = bookArray[bookIdToUpdate].price
        inputRating.value = bookArray[bookIdToUpdate].rating

        modalFieldsetContainer.insertAdjacentHTML('beforeend', `<button class="submit" onclick="onUpdateBook('${id}')" data-idx>Update</button>`)
        modalFieldset.insertAdjacentHTML('afterbegin', `<legend data-idx>Update Book</legend>`)
    }

    bookModal.showModal()
}

function onCloseModal() {
    var bookModal = document.querySelector('.add-book-modal')

    bookModal.close()
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

        renderTable()
    }, 1000);

    bookModal.close()
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
                           <div class="rating-content content">${getratingImg(bookToDisplay.rating)}</div>`
}

window.onclick = function (event) {
    var modal = document.querySelector('.modal-overlay')
    if (event.target === modal && modal.style.display === 'block') {
        modal.style.display = 'none'
    }
}


function onFilterBooks(type, inputVal) {
    filterBy[type] = inputVal.toLowerCase()

    if (getBooks().length === 0) return emptyTable()

    renderTable()
}

