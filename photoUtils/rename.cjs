var fs = require('fs');
const path = require('path')
const rootDir = "16366 W. Sloan Dr"
const dirs = fs.readdirSync(`./../../../Pictures/mainsite/propertyImages/raw/${rootDir}`, {
    withFileTypes: true
})
dirs.forEach((v, i) => {
    fs.renameSync(`./../../../Pictures/mainsite/propertyImages/raw/${rootDir}/${v.name}`, `./../../../Pictures/mainsite/propertyImages/raw/${rootDir}/${rootDir}-${i+path.extname(v.name)}`)
})