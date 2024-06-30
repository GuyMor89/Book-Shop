'use strict'


function readQueryParams() {
    const queryParams = new URLSearchParams(window.location.search)

    filterBy = {
        title: queryParams.get('filter-title') || '',
        price: +queryParams.get('filter-price') || 0,
        rating: +queryParams.get('filter-rating') || 0
    }
    sortBy = {
        title: queryParams.get('sort-title') || '',
        price: +queryParams.get('sort-price') || 0,
        rating: +queryParams.get('sort-rating') || 0
    }
    pageBy = {
        page: +queryParams.get('page-current') || 0,
        amount: +queryParams.get('page-amount') || 5,
    }

    renderQueryParams()
}

function renderQueryParams() {
    document.querySelector('.filter-title').value = filterBy.title
    document.querySelector('.filter-price').value = filterBy.price
    document.querySelector('.filter-rating').value = filterBy.price
}

function setQueryParams() {
    const queryParams = new URLSearchParams()

    queryParams.set('filter-title', filterBy.title)
    queryParams.set('filter-price', filterBy.price)
    queryParams.set('filter-rating', filterBy.rating)

    queryParams.set('sort-title', sortBy.title)
    queryParams.set('sort-price', sortBy.price)
    queryParams.set('sort-rating', sortBy.rating)

    queryParams.set('page-current', pageBy.page)
    queryParams.set('page-amount', pageBy.amount)

    const newUrl =
        window.location.protocol + "//" +
        window.location.host +
        window.location.pathname + '?' + queryParams.toString()

    window.history.pushState({ path: newUrl }, '', newUrl)
}
