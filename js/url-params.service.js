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

    // if (queryParams.get('pageIdx')) {
    //     gQueryOptions.page.idx = +queryParams.get('pageIdx')
    //     gQueryOptions.page.size = +queryParams.get('pageSize')
    // }
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

    // if (gQueryOptions.page) {
    //     queryParams.set('pageIdx', gQueryOptions.page.idx)
    //     queryParams.set('pageSize', gQueryOptions.page.size)
    // }

    const newUrl =
        window.location.protocol + "//" +
        window.location.host +
        window.location.pathname + '?' + queryParams.toString()

    window.history.pushState({ path: newUrl }, '', newUrl)
}
