'use strict'

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled)
}

function saveToStorage(key, value) {
    var valueString = JSON.stringify(value)
    localStorage.setItem(key, valueString)
}

function loadFromStorage(key) {
    var valueString = localStorage.getItem(key)
    if (valueString === 'undefined' || valueString === null) return undefined
    return JSON.parse(valueString)
}

function capitalizeInput(text) {
    const capitalizedText = text.replace(/\b\w/g, function (char) {
        return char.toUpperCase()
    })
    return capitalizedText
}

function colorLinesInCSS() {


    const classPrefixes = ['title', 'price', 'rating', 'actions']

    classPrefixes.forEach(prefix => {
        document.querySelectorAll(`[class^="${prefix}"]`).forEach((element, index) => {
            if (index % 2 !== 0) {
                element.style.backgroundColor = 'white'
            }
        })
    })
    classPrefixes.forEach(prefix => {
        document.querySelectorAll(`[class^="${prefix}"]`).forEach((element, index) => {
            if (index % 2 === 0) {
                element.style.backgroundColor = '#e0e0e0'
            }
        })
    })
}

function getStarsImg(amount) {
    var starImgSrc = `<img src="img/star.png">`
    var starImgHTML = ''

    for (let i = 0; i < amount; i++) {
        starImgHTML += starImgSrc
    }
    return starImgHTML
}

