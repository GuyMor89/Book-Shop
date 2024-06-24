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