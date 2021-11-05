const { createFile } = require("../../../cloudinary/utils.cjs");
const imagesAll = require("./privateHomeFinal.json");

const images = [];

for (let img in imagesAll) {
  images.push({
    thumb: imagesAll[img].thumb,
    label: imagesAll[img].label,
    key: img,
  });
}
createFile("./thumbs.json", images);
