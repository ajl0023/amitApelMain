const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const dirToCompress = "";

const images = [
    'http://res.cloudinary.com/dt4xntymn/image/upload/v1635386170/mainSite/furniture/MAINTIMEGGTABLE4_tbojjn.webp',
    'http://res.cloudinary.com/dt4xntymn/image/upload/v1635386168/mainSite/furniture/MAINPUZZLETABLETHIRDGEN4_nzo1li.webp',
    'http://res.cloudinary.com/dt4xntymn/image/upload/v1635386169/mainSite/furniture/MAINPROMISETABLE50_x5x1fx.webp',
    'http://res.cloudinary.com/dt4xntymn/image/upload/v1635386170/mainSite/furniture/MAINPOOFCHAIR1_au9mqw.webp',
    'http://res.cloudinary.com/dt4xntymn/image/upload/v1635386169/mainSite/furniture/MAINMALIBUTABLE1_qd0npv.webp',
    'http://res.cloudinary.com/dt4xntymn/image/upload/v1635386169/mainSite/furniture/MAINJAZZTABLE1_z1lo83.webp',
    'http://res.cloudinary.com/dt4xntymn/image/upload/v1635386168/mainSite/furniture/MAINGRANDCANYON1_zobutb.webp',
    'http://res.cloudinary.com/dt4xntymn/image/upload/v1635386170/mainSite/furniture/MAINDEAUVILLE1_kkpke9.webp',
    'http://res.cloudinary.com/dt4xntymn/image/upload/v1635386168/mainSite/furniture/MAINCOCOSECONDGENERATION6_py6c5u.webp',
    'http://res.cloudinary.com/dt4xntymn/image/upload/v1635386169/mainSite/furniture/MAINBRIDGETABLE1_twhpj0.webp'
]

const imagesF = images.map((file) => {
    const split = file.split("/")[9].split("_")[0]
    console.log(split)

    const replaced = split.replace(/[0-9]/g, "")

    return {
        label: replaced,
        url: file
    }
})
console.log(imagesF)
let data = JSON.stringify(imagesF);
fs.writeFileSync('furniture.json', data);