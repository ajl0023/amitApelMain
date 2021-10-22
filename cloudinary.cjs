var cloudinary = require("cloudinary");
const fs = require('fs');
const arr = []
cloudinary.config({
  cloud_name: "dt4xntymn", // add your cloud_name
  api_key: "879229719542176", // add your api_key
  api_secret: "6KNCQb_nzfWSp_1jzcrVHNNpMHM", // add your api_secret
  secure: true,
});
const folders = {
  '10801 Ashby': [],
  '1088 N Hillcrest Rd': [],
  '1111 Sierra Alta Way': [],
  '12018 Coyne St': [],
  '12117 Greenock Ave': [],
  '130 N Stanley Dr': [],
  '13020 Greenleaf': [],
  '1349 N Gardner': [],
  '147 N Hamel Dr': [],
  '147 N Stanley Dr': [],
  '1484 Edris Dr': [],
  '152 S Laurel Ave': [],
  '16037 Junaluska Way': [],
  '16366 W. Sloan Dr': [],
  '164 N Hamel Dr': [],
  '164 N Stanley Dr': [],
  '165 S Hudson': [],
  '18296 Karen Dr': [],
  '1845 Coldwater': [],
  '1847 Coldwater Cyn': [],
  '1918 West Holme Ave': [],
  '205 S La Peer Dr': [],
  '2240 Stanley Hills Dr': [],
  '2244 Stanley Ave': [],
  '2260 Hercules Dr': [],
  '2351 MT Olympus': [],
  '23590 Park South St': [],
  '2463 Achilles Dr': [],
  '255 Bernard Ave': [],
  '3114 Elvido Dr': [],
  '312 S La Peer': [],
  '3140 Club Dr': [],
  '3142 Dannyhill Dr': [],
  '320 N La Jolla Ave': [],
  '346 North Laurel Ave': [],
  '349 S Mansfield Ave': [],
  '350 S Mc Carty Dr': [],
  '351 N Laurel Ave': [],
  '354 N San Vicente Blvd': [],
  '355 S Mansfield': [],
  '370 N June St': [],
  '405 N Kilkea': [],
  '417 N Orlando Ave': [],
  '423 South Mansfield Ave': [],
  '424 La Jolla Ave': [],
  '428 N La Jolla': [],
  '4439 Stansbury': [],
  '5087 Marmol Dr': [],
  '524 Ocampo': [],
  '527 Harper': [],
  '531 Curson Ave': [],
  '535 West Knoll Dr': [],
  '543 N Kilkea Dr': [],
  '5652 Calvin Ave': [],
  '6230 Fifth St': [],
  '6242 Drexel Ave': [],
  '631 S Mansfield Ave': [],
  '6352 Colgate Ave': [],
  '6357 Fifth St': [],
  '639 Mildred Ave': [],
  '641 Mildred Ave': [],
  '6414 Colgate Ave': [],
  '6430 Colgate Ave': [],
  '6516 Maryland Dr': [],
  '6610 Maryland Dr': [],
  '6914 Lennox Ave': [],
  '727 N Las Palmas Ave': [],
  '732 N McCadden Pl': [],
  '733 N Las Palmas Ave': [],
  '735 N Las Palmas Ave': [],
  '800 N Harper': [],
  '813 N Laurel Ave': [],
  '815 Tigertail': [],
  '824 N la jolla': [],
  '836 S Manning Ave': [],
  '8381 Hollywood Blvd': [],
  '846 Huntley Dr': [],
  '8720 Rosewood': [],
  '8971 W. Shoreham': [],
  '9401 Sawyer St': [],
  '9814 Hythe Ct': [],
  'Cheviot Dr': []
}
const newObj = {}
for (let i in folders) {
  newObj[i.replace(/\s/ig, "_")] = []
}
const promises = []


for (let folder in folders) {
  const search = cloudinary.v2.api.resources({
      type: 'upload',
      prefix: `mainSite/privateHomes/raw/${folder}` // add your folder
    },
    function (error, result) {
      const urls = result.resources.map((item) => {
        return item.url
      });
      folders[folder] = urls
    })
  promises.push(search)






}

Promise.all(promises).then(() => {
  let data = JSON.stringify(folders);
  fs.writeFileSync('privateHomeFinal2.json', data);
})