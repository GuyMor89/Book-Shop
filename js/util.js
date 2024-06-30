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
    if (typeof text !== 'string') return ''
    const capitalizedText = text.replace(/\b\w/g, function (char, index) {
        if (index === 0 || text[index - 1] === ' ' || text[index - 1] === '\t' || text[index - 1] === '\n') {
            return char.toUpperCase()
        }
        return char
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

function colorBookLinesInCSS() {

    const classPrefixes = ['book']

    classPrefixes.forEach(prefix => {
        document.querySelectorAll(`[class^="${prefix}"]`).forEach((element, index) => {
            if (index % 2 !== 0) {
                element.style.backgroundColor = '#e0e0e0'
            }
        })
    })
    classPrefixes.forEach(prefix => {
        document.querySelectorAll(`[class^="${prefix}"]`).forEach((element, index) => {
            if (index % 2 === 0) {
                element.style.backgroundColor = 'white'
            }
        })
    })
}



function getRatingImage(amount) {
    var starImgSrc = `<img src="img/star.png">`
    var starImgHTML = starImgSrc.repeat(amount)
    
    return starImgHTML
}

document.addEventListener('DOMContentLoaded', function() {
    const rangeInputs = document.querySelectorAll('.input-price, .input-rating') // Select all range inputs
    const rangeValues = document.querySelectorAll('.range-value') // Select all range value displays

    rangeInputs.forEach((rangeInput, index) => {
        const rangeValue = rangeValues[index]

        function updateRangeValue() {
            const value = rangeInput.value
            rangeValue.textContent = value

            const rangeWidth = rangeInput.offsetWidth
            const thumbWidth = 20 // Approximate width of the range input thumb
            const max = rangeInput.max
            const min = rangeInput.min

            const left = ((value - min) / (max - min)) * (rangeWidth - thumbWidth) + thumbWidth / 2
            rangeValue.style.left = `${left}px`
        }

        rangeInput.addEventListener('input', function() {
            rangeValue.style.visibility = 'visible'
            updateRangeValue()
        })

        rangeInput.addEventListener('blur', function() {
            rangeValue.style.visibility = 'hidden'
        })

        rangeInput.addEventListener('focus', function() {
            rangeValue.style.visibility = 'visible'
            updateRangeValue()
        })

        // Initialize the visibility state
        rangeValue.style.visibility = 'hidden'
    })
})