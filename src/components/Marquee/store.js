import { writable } from "svelte/store";
import gsap from "gsap";
const marqueeContent = () => {
  const state = {
    content: null,
  };
  const { subscribe, set, update } = writable(state);
  const methods = {
    reset() {
      update((s) => {
        s.content = null;
        return s;
      });
    },
    setPage(page) {
      update((s) => {
        s.content = page;

        return s;
      });
    },
    close(tl) {
      tl.reverse().then(() => {
        update((s) => {
          s.content = null;

          return s;
        });
      });
      gsap.to(".menu-wrap", {
        y: 0,
      });
    },
    open() {
      gsap.to(".menu-wrap", {
        y: window.innerHeight,
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
export const marqueeContentStore = marqueeContent();
