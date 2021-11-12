import { writable } from "svelte/store";

import gsap from "gsap";
const store = () => {
  const state = {
    exited: [],
    shouldReturn: false,
  };
  const { subscribe, set, update } = writable(state);
  const methods = {
    exit(i) {
      update((s) => {
        s.exited.push(i);
        if (s.exited.length === 6) {
          this.reset();
          setTimeout(() => {
            s.shouldReturn = false;
          });
        }

        return s;
      });
    },
    init() {
      update((s) => {
        s.exited = [];
        return s;
      });
    },
    returnCard(i) {
      update((s) => {
        s.exited = s.exited.filter((t) => {
          return t !== i;
        });
        return s;
      });
    },
    reset() {
      update((s) => {
        s.shouldReturn = true;
        s.exited = [];
        return s;
      });
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
      "https://res.cloudinary.com/dt4xntymn/image/upload/v1636680546/mainSite/meet%20the%20team/Cards/front/Joker_Card_rtojgt.webp",
    back:
      "https://res.cloudinary.com/dt4xntymn/image/upload/v1636680555/mainSite/meet%20the%20team/Cards/back/Joker_Card_Back_pzxtsy.webp",
  },
  {
    front:
      "https://res.cloudinary.com/dt4xntymn/image/upload/v1633335279/mainSite/meet%20the%20team/Cards/front/Luke_Card_dgfcrg.jpg",
    back:
      "https://res.cloudinary.com/dt4xntymn/image/upload/v1633335260/mainSite/meet%20the%20team/Cards/back/Luke_Card_Back_j5zphk.jpg",
  },
  {
    front:
      "https://res.cloudinary.com/dt4xntymn/image/upload/v1633335279/mainSite/meet%20the%20team/Cards/front/Mike_Card_yyevct.jpg",
    back:
      "https://res.cloudinary.com/dt4xntymn/image/upload/v1633335260/mainSite/meet%20the%20team/Cards/back/Mike_Card_Back_pwet2v.jpg",
  },
  {
    front:
      "https://res.cloudinary.com/dt4xntymn/image/upload/v1633335279/mainSite/meet%20the%20team/Cards/front/Yak_Card_c55nzc.jpg",
    back:
      "https://res.cloudinary.com/dt4xntymn/image/upload/v1633335260/mainSite/meet%20the%20team/Cards/back/Yak_Card_Back_bsvk7b.jpg",
  },
  {
    front:
      "https://res.cloudinary.com/dt4xntymn/image/upload/v1633335279/mainSite/meet%20the%20team/Cards/front/Elchin_Card_hhfjc2.jpg",
    back:
      "https://res.cloudinary.com/dt4xntymn/image/upload/v1633335260/mainSite/meet%20the%20team/Cards/back/Elchin_Card_Back_ii2vul.jpg",
  },
  {
    front:
      "https://res.cloudinary.com/dt4xntymn/image/upload/v1633335279/mainSite/meet%20the%20team/Cards/front/Omar_Card_frdbxy.jpg",
    back:
      "https://res.cloudinary.com/dt4xntymn/image/upload/v1633335260/mainSite/meet%20the%20team/Cards/back/Omar_Card_Back_weik5s.jpg",
  },
];
