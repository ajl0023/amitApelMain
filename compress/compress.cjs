const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const dirToCompress = "";
const currDir = `./compressed`;
const imagesDir = fs.readdirSync(currDir);
const arr = [];
imagesDir.forEach((item) => {
  const image = fs.readFileSync(`${currDir}/${item}`);
  const size = fs.statSync(`${currDir}/${item}`).size;

  const origName = path.parse(item).name;

  sharp(image)
    .resize(400)
    .toFile(`./compressed/${origName}.webp`, (err, info) => {
      console.log(info);
    });
});
//600000
// setTimeout(() => {
//   const sorted = arr.sort((a, b) => {
//     return b - a
//   })
//   console.log(sorted)
// })
