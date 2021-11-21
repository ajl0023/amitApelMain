import { writable } from "svelte/store";

import gsap from "gsap";
import { distance } from "../Marquee/utils";
const store = () => {
  const state = {
    exited: [],
    shouldReturn: false,
    zIndex: [],
    cardEles: [],
    zIndexNum: 1,
    cardToExit: null,
    cards: [0, 1, 2, 3, 4, 5],
  };
  const { subscribe, set, update } = writable(state);
  const methods = {
    exit(i) {
      update((s) => {
        s.zIndex.push(i);
        s.exited.push(i);
        s.cards = s.cards.filter((f) => {
          return f !== i;
        });
        if (s.exited.length === 6) {
          this.reset();
          setTimeout(() => {
            s.shouldReturn = false;
          });
        }

        return s;
      });
    },
    init(outline) {
      update((s) => {
        s.exited = [];
        s.zIndex = [];
        s.outline = outline;
        s.shouldReturn = false;
        return s;
      });
    },
    initEles(ele) {
      update((s) => {
        s.cardEles = [...s.cardEles, ele];
        return s;
      });
    },
    returnCard(i) {
      update((s) => {
        s.exited = s.exited.filter((t) => {
          return t !== i;
        });
        s.zIndex = s.zIndex.filter((t) => {
          return t !== i;
        });
        s.cards = [i, ...s.cards];
        return s;
      });
    },
    clearZindex() {
      setTimeout(() => {
        update((s) => {
          s.zIndex = [];
          s.cards = [0, 1, 2, 3, 4, 5];
          return s;
        });
      }, 1000 + 5 * 100);
    },
    reset() {
      this.clearZindex();
      update((s) => {
        s.shouldReturn = true;
        s.exited = [];
        s.cards = [0, 1, 2, 3, 4, 5];

        return s;
      });
    },
    manualExit() {
      const indexToExit = state.cards[0];

      update((s) => {
        s.cardToExit = indexToExit;
        return s;
      });
      const eleToExit = state.cardEles.find((v) => {
        return v.index === indexToExit;
      }).ele;
      const outLinePosition = state.outline.getBoundingClientRect();
      const stackPosition = eleToExit.getBoundingClientRect();
      const distanceRes = distance(
        outLinePosition.x,
        stackPosition.x,
        outLinePosition.y,
        stackPosition.y
      );

      return distanceRes;
    },
  };
  return {
    subscribe,
    set,
    update,
    ...methods,
  };
};
export const cardStore = store();
export const cardImages = [
  {
    front:
      "https://res.cloudinary.com/dt4xntymn/image/upload/v1633335279/mainSite/meet%20the%20team/Cards/front/Omar_Card_frdbxy.jpg",
    back:
      "https://res.cloudinary.com/dt4xntymn/image/upload/v1633335260/mainSite/meet%20the%20team/Cards/back/Omar_Card_Back_weik5s.jpg",
    description: "Omar",
  },

  {
    front:
      "https://res.cloudinary.com/dt4xntymn/image/upload/v1633335279/mainSite/meet%20the%20team/Cards/front/Luke_Card_dgfcrg.jpg",
    back:
      "https://res.cloudinary.com/dt4xntymn/image/upload/v1633335260/mainSite/meet%20the%20team/Cards/back/Luke_Card_Back_j5zphk.jpg",
    description: "LUKE",
  },
  {
    front:
      "https://res.cloudinary.com/dt4xntymn/image/upload/v1633335279/mainSite/meet%20the%20team/Cards/front/Mike_Card_yyevct.jpg",
    back:
      "https://res.cloudinary.com/dt4xntymn/image/upload/v1633335260/mainSite/meet%20the%20team/Cards/back/Mike_Card_Back_pwet2v.jpg",
    description: "MIKE",
  },
  {
    front:
      "https://res.cloudinary.com/dt4xntymn/image/upload/v1633335279/mainSite/meet%20the%20team/Cards/front/Yak_Card_c55nzc.jpg",
    back:
      "https://res.cloudinary.com/dt4xntymn/image/upload/v1633335260/mainSite/meet%20the%20team/Cards/back/Yak_Card_Back_bsvk7b.jpg",
    description: "YAK",
  },
  {
    front:
      "https://res.cloudinary.com/dt4xntymn/image/upload/v1633335279/mainSite/meet%20the%20team/Cards/front/Elchin_Card_hhfjc2.jpg",
    back:
      "https://res.cloudinary.com/dt4xntymn/image/upload/v1633335260/mainSite/meet%20the%20team/Cards/back/Elchin_Card_Back_ii2vul.jpg",
    description: "Elchin",
  },
  {
    front:
      "https://res.cloudinary.com/dt4xntymn/image/upload/v1636680546/mainSite/meet%20the%20team/Cards/front/Joker_Card_rtojgt.webp",
    back:
      "https://res.cloudinary.com/dt4xntymn/image/upload/v1636680555/mainSite/meet%20the%20team/Cards/back/Joker_Card_Back_pzxtsy.webp",
    description: "JOKER",
  },
];
