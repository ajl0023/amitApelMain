import gsap from "gsap";
import { writable } from "svelte/store";
import { closestEdge } from "./utils";

//from https://github.com/codrops/MarqueeMenu/blob/main/src/js/menuItem.js#L29
export const marqueeStore = () => {
  const state = {
    ele: null,
    eleA: null,
    marquee: null,
    animationDefaults: {
      duration: 0.6,
      ease: "expo",
    },
  };
  const { subscribe, set, update } = writable(state);

  const methods = {
    init(ele, eleA, marquee, marqueeInner) {
      update((s) => {
        s.ele = ele;
        s.eleA = eleA;
        s.marquee = marquee;
        s.marqueeInner = marqueeInner;
        return s;
      });
    },
    mouseEnter(ev) {
      update((s) => {
        // find closest side to the mouse

        const edge = this.findClosestEdge(ev, s.ele);
 
        gsap
          .timeline({ defaults: s.animationDefaults })
          .set(s.marquee, { y: edge === "top" ? "-101%" : "101%" }, 0)
          //   .set(s.marqueeInner, { y: edge === "top" ? "101%" : "-101%" }, 0)
          .to([s.marquee, s.marqueeInner], { y: "0%" }, 0);
        return s;
      });
    },
    mouseLeave(ev) {
      update((s) => {
        // find closest side to the mouse

        const edge = this.findClosestEdge(ev, s.ele);

        gsap
          .timeline({ defaults: s.animationDefaults })
          .to(s.marquee, { y: edge === "top" ? "-101%" : "101%" }, 0)
          .to(s.marqueeInner, { y: edge === "top" ? "101%" : "-101%" }, 0);
        return s;
      });
    },
    findClosestEdge(ele, test) {
      const x = ele.pageX - test.offsetLeft;
      const y = ele.pageY - test.offsetTop;

      return closestEdge(x, y, test.clientWidth, test.clientHeight);
    },
  };
  return {
    subscribe,
    set,
    update,
    ...methods,
  };
};

export const store = marqueeStore();
