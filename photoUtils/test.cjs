var fs = require('fs');
const path = require('path')
let i = 0
const obj = {

}
const dirs = fs.readdirSync('./../../../Pictures/mainsite/propertyImages/raw', {
    withFileTypes: true
})
const root = "./../../../Pictures/mainsite/propertyImages/raw"
dirs.forEach((dir) => {

    const name = dir.name.replace(/\w+\.\s|\w+\.\s/ig, "")
    const subD = fs.readdirSync(`${root}/${dir.name}/`, {
        withFileTypes: true
    })
    subD.forEach((file) => {
        if (file.name === 'WIX') {
            const wixFolder = fs.readdirSync(`${root}/${dir.name}/WIX`, {
                withFileTypes: true
            })
            wixFolder.forEach((v, i) => {
                fs.renameSync(`${root}/824 n la jolla/WIX/${v.name}`, `${root}/${dir.name}/${dir.name}-${i}${path.extname(v.name)}`, () => {
                    
                })
            })
        }
        if (!file.isDirectory()) {
            fs.rmSync(`${root}/${dir.name}/${file.name}`)
        }

    })
    fs.renameSync(`${root}/${dir.name}`, `${root}/${name}`, (err, succ) => {

    })











})

setTimeout(() => {

}, 1000)