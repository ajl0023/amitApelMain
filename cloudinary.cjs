var cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: "dt4xntymn", // add your cloud_name
  api_key: "879229719542176", // add your api_key
  api_secret: "6KNCQb_nzfWSp_1jzcrVHNNpMHM", // add your api_secret
  secure: true,
});

cloudinary.v2.search
  .expression(
    "folder:mainSite/furniture*" // add your folder
  )
  .sort_by("public_id", "desc")
  .max_results(80)
  .execute()
  .then((result) => {

    const urls = result.resources.map((item) => {
      return {
        url: item.url,
        width: item.width,
        height: item.height
      }
    });

    console.log(urls)

  });