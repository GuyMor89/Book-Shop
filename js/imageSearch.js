'use strict'

const apiKey = 'AIzaSyCR33oSRloIdaX2tMBYdvsYipO8gNBiWdY' // Replace with your actual API key
const cseId = '55db37c42e2a44265' // Replace with your actual CSE ID

async function searchImage(query) {
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cseId}&searchType=image&q=${query}`

    try {
        const response = await axios.get(url)
        if (response.data && response.data.items && response.data.items.length > 0) {
            const firstImageUrl = response.data.items[0].link
            return firstImageUrl
        } else {
            console.log('No image items found in the response')
            return null
        }
    } catch (error) {
        console.error('Error fetching image:', error)
        return null
    }
}

var imageArray = []

async function fetchImage(searchTerm) {
    const imageUrl = await searchImage(searchTerm)
    if (imageUrl) {
        return imageUrl
    } else {
        console.log('No image found.')
        return null
    }
}


// A function that calls fetchImage and logs the result
async function logImageUrl(searchTerm) {
    const url = await fetchImage(searchTerm)
    imageArray.push(url)
    console.log(url)
}

// Attach the function to the window object to make it globally accessible
window.logImageUrl = logImageUrl
