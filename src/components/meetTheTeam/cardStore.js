import { writable } from "svelte/store";

import gsap from "gsap";
import { distance } from "../Marquee/utils";
const store = () => {
  const state = {
    exited: [],
    exiting: false,
    shouldReturn: false,
    zIndex: [],

    zIndexNum: 1,
    returnedCards: [],
    cardToExit: null,
    currentStack: [5, 4, 3, 2, 1, 0],
  };
  const { subscribe, set, update } = writable(state);
  const methods = {
    init(outline) {
      set({
        outline,
        exited: [],
        shouldReturn: false,
        zIndex: [],

        zIndexNum: 1,
        cardToExit: null,
        returnedCards: [],

        currentStack: [5, 4, 3, 2, 1, 0],
      });
    },
    exit(i) {
      update((s) => {
        s.exited.push(i);
        s.currentStack = s.currentStack.filter((f) => {
          return f !== i;
        });

        return s;
      });
    },

    reset() {
      update((s) => {
        s.shouldReturn = true;

        s.exited = [];
        s.currentStack = [5, 4, 3, 2, 1, 0];
        s.cardToExit = null;

        return s;
      });
    },
    introAnim() {
      gsap.to(".meet-the-team-card", {
        y: 0,
        delay: 1.2,
        stagger: -0.2,
        duration: 0.5,
      });
    },
    reenable(i) {
      update((s) => {
        const copy = {
          ...s,
        };
        copy.returnedCards.push(i);

        if (copy.returnedCards.length === 6) {
          copy.shouldReturn = false;
          copy.returnedCards = [];
        }

        return copy;
      });
    },

    returnCard(i) {
      update((s) => {
        s.exited = s.exited.filter((f) => {
          return f !== i;
        });

        s.currentStack = [...s.currentStack, i];
        s.cardToExit = null;

        return s;
      });
    },

    resetStore() {},

    manualExit() {
      update((s) => {
        if (!s.shouldReturn) {
          const indexToExit = s.currentStack[s.currentStack.length - 1];
          s.cardToExit = indexToExit;
        }
        return s;
      });
    },
    getExitLocation(ele, index) {
      const outLinePosition = state.outline.getBoundingClientRect();
      const stackPosition = ele.getBoundingClientRect();
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
      "https://res.cloudinary.com/dt4xntymn/image/upload/v1637899753/mainSite/meet%20the%20team/Cards/back/Omar_Card_Back_2_og3bqg.jpg",
    description: "Omar",
  },

  {
    front:
      "https://res.cloudinary.com/dt4xntymn/image/upload/v1633335279/mainSite/meet%20the%20team/Cards/front/Luke_Card_dgfcrg.jpg",
    back:
      "https://res.cloudinary.com/dt4xntymn/image/upload/v1637899753/mainSite/meet%20the%20team/Cards/back/Luke_Card_Back_2_rlyn6z.jpg",
    description: "LUKE",
  },
  {
    front:
      "https://res.cloudinary.com/dt4xntymn/image/upload/v1633335279/mainSite/meet%20the%20team/Cards/front/Mike_Card_yyevct.jpg",
    back:
      "https://res.cloudinary.com/dt4xntymn/image/upload/v1637899753/mainSite/meet%20the%20team/Cards/back/Mike_Card_Back_2_namikx.jpg",
    description: "MIKE",
  },
  {
    front:
      "https://res.cloudinary.com/dt4xntymn/image/upload/v1633335279/mainSite/meet%20the%20team/Cards/front/Yak_Card_c55nzc.jpg",
    back:
      "https://res.cloudinary.com/dt4xntymn/image/upload/v1637899753/mainSite/meet%20the%20team/Cards/back/Yak_Card_Back_2_ro0mxu.jpg",
    description: "YAK",
  },
  {
    front:
      "https://res.cloudinary.com/dt4xntymn/image/upload/v1633335279/mainSite/meet%20the%20team/Cards/front/Elchin_Card_hhfjc2.jpg",
    back:
      "https://res.cloudinary.com/dt4xntymn/image/upload/v1637899753/mainSite/meet%20the%20team/Cards/back/Elchin_Card_Back_2_sukoq9.jpg",
    description: "Elchin",
  },
  {
    front:
      "https://res.cloudinary.com/dt4xntymn/image/upload/v1637784455/mainSite/meet%20the%20team/Cards/front/Joker_Card_pwqclu.jpg",
    back:
      "https://res.cloudinary.com/dt4xntymn/image/upload/v1637784449/mainSite/meet%20the%20team/Cards/back/Joker_Card_Back_x8eonc.jpg",
    description: "JOKER",
  },
];
