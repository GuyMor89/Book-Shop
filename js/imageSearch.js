'use strict'

async function searchImage(query) {
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cseId}&searchType=image&q=${query}`

    try {
        const response = await axios.get(url)
        if (response.data && response.data.items && response.data.items.length > 0) {
            const firstImageUrl = response.data.items[0].link
            return image.src = firstImageUrl
        } else {
            console.log('No image items found in the response')
            return null
        }
    } catch (error) {
        console.error('Error fetching image:', error)
        return null
    }
}

var image = {
    src: null
}


function getImageSrc(input) {
    searchImage(`${input} book cover`)
}