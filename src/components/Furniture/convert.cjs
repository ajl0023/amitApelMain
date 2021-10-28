const images = [
  {
    label: "",
    url:
      "http://res.cloudinary.com/dt4xntymn/image/upload/v1635386170/mainSite/furniture/MAINTIMEGGTABLE4_tbojjn.webp",
    width: 2816,
    height: 1880,
  },
  {
    url:
      "http://res.cloudinary.com/dt4xntymn/image/upload/v1635386168/mainSite/furniture/MAINPUZZLETABLETHIRDGEN4_nzo1li.webp",
    width: 3296,
    height: 2360,
  },
  {
    url:
      "http://res.cloudinary.com/dt4xntymn/image/upload/v1635386169/mainSite/furniture/MAINPROMISETABLE50_x5x1fx.webp",
    width: 3999,
    height: 2656,
  },
  {
    url:
      "http://res.cloudinary.com/dt4xntymn/image/upload/v1635386170/mainSite/furniture/MAINPOOFCHAIR1_au9mqw.webp",
    width: 1880,
    height: 1931,
  },
  {
    url:
      "http://res.cloudinary.com/dt4xntymn/image/upload/v1635386169/mainSite/furniture/MAINMALIBUTABLE1_qd0npv.webp",
    width: 2592,
    height: 3888,
  },
  {
    url:
      "http://res.cloudinary.com/dt4xntymn/image/upload/v1635386169/mainSite/furniture/MAINJAZZTABLE1_z1lo83.webp",
    width: 2592,
    height: 3888,
  },
  {
    url:
      "http://res.cloudinary.com/dt4xntymn/image/upload/v1635386168/mainSite/furniture/MAINGRANDCANYON1_zobutb.webp",
    width: 2816,
    height: 1880,
  },
  {
    url:
      "http://res.cloudinary.com/dt4xntymn/image/upload/v1635386170/mainSite/furniture/MAINDEAUVILLE1_kkpke9.webp",
    width: 1880,
    height: 2816,
  },
  {
    url:
      "http://res.cloudinary.com/dt4xntymn/image/upload/v1635386168/mainSite/furniture/MAINCOCOSECONDGENERATION6_py6c5u.webp",
    width: 1880,
    height: 2816,
  },
  {
    url:
      "http://res.cloudinary.com/dt4xntymn/image/upload/v1635386169/mainSite/furniture/MAINBRIDGETABLE1_twhpj0.webp",
    width: 413,
    height: 500,
  },
];
const fs = require("fs");
const seperated = [];
for (let i = 0; i < images.length; i += 3) {
  const arr = [];
  for (let j = i; j < i + 3; j++) {
    if (images[j]) {
      arr.push(images[j]);
    }
  }
  seperated.push(arr);
}

let data = JSON.stringify(seperated);
fs.writeFileSync("./furniture.json", data);
