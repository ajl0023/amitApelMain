import main1 from "./slideshows/SD Bar 1.mp4";
import main2 from "./slideshows/SD Bar 2.mp4";
import main3 from "./slideshows/SD Bar 3.mp4";
import main4 from "./slideshows/SD Bar 4.mp4";

export const largeBarObj = {
  3: {
    delay: 0.1,
    defaultPos: {
      left: "0px",
    },
    imagePos: {
      0: "0%",
      1: "0%",
    },
    img: main1,
    position: {
      left: "10.9%",

      top: "0%",

      width: "2.7%",
    },
  },
  17: {
    delay: 0.2,
    img: main2,
    imagePos: {
      0: "44%",
      1: "20%",
    },
    defaultPos: {
      left: "22.5%",
    },
    position: {
      left: "59.5%",

      top: "0%",

      width: "1.1%",
    },
  },
  23: {
    delay: 0.3,
    img: main3,
    imagePos: {
      0: "44%",
      1: "20%",
    },
    defaultPos: {
      left: "67.5%",
    },
    position: {
      left: "75.1%",
      top: "0%",

      width: "2.7%",
    },
  },
  28: {
    delay: 0.4,
    img: main4,
    imagePos: {
      0: "44%",
      1: "20%",
    },
    defaultPos: {
      left: "90%",
      right: "0",
    },
    position: {
      left: "94.4%",
      top: "0%",

      width: "2.9%",
    },
  },
};
export const largeBarsArr = [{
    delay: 0.1,
    defaultPos: {
      left: "0px",
    },
    imagePos: {
      0: "0%",
      1: "0%",
    },
    index: 3,
    img: main1,
    position: {
      left: "10.9%",

      top: "0%",

      width: "2.7%",
    },
    categories: ['meet amit apel', "meet the team", "what we do", "malibu rebuild", "press"]
  },

  {
    index: 17,
    delay: 0.2,
    img: main2,
    imagePos: {
      0: "44%",
      1: "20%",
    },
    defaultPos: {
      left: "20vw"
    },
    position: {
      left: "34.6%",
      top: "0%",

      width: "2.5%",
    },
    categories: ['private homes', "multi units", "concept", "render videos"]
  },

  {
    index: 23,
    delay: 0.3,
    img: main3,
    imagePos: {
      0: "44%",
      1: "20%",
    },
    defaultPos: {
      left: "67.5%",
      right: "20vw",
    },
    position: {
      left: "75.1%",
      top: "0%",

      width: "2.7%",
    },
    categories: ['sculpture', "furniture", "art", "concept"]
  },

  {
    index: 28,
    delay: 0.4,
    img: main4,
    imagePos: {
      0: "44%",
      1: "20%",
    },
    defaultPos: {
      left: "90%",
      right: "0",
    },
    position: {
      left: "94.4%",
      top: "0%",

      width: "2.9%",
    },
    categories: ['private homes', "multi units", "concept", "render videos"]
  },
];