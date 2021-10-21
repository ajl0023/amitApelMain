const imagesAll = require('./privateHomeFinal.json')

const images = []



for (let img in imagesAll) {
    images.push({
        img: imagesAll[img].img,
        label: imagesAll[img].label,
        address: img
    })
}
console.log(images)