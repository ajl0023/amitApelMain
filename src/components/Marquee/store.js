import { writable } from "svelte/store";
import gsap from "gsap";
const marqueeContent = () => {
  const state = {
    content: null,
    active: false,
    container: null,
    animation: null,
    shouldLoadImages: false,
  };
  const { subscribe, set, update } = writable(state);
  const methods = {
    reset() {
      update((s) => {
        s.content = null;
        s.shouldLoadImages = false;

        return s;
      });
    },
    setPageAnimation(page) {
      update((s) => {
        s.active = true;
        s.content = page;
        gsap.to(".menu-wrap", {
          y: window.innerHeight,
        });

        s.animation.play();

        return s;
      });
    },
    close(tl) {
      update((s) => {
        s.active = false;
        s.animation.reverse();
        s.shouldLoadImages = false;
        gsap.to(".menu-wrap", {
          y: 0,
        });

        return s;
      });

      // .then(() => {});
    },
    init(ele) {
      update((s) => {
        s.container = ele;
        s.animation = gsap.timeline();
        s.animation
          .to(".page-transition-black", {
            height: "100vh",
            ease: "power3.in",

            duration: "1",
          })
          .to(s.container, {
            top: 0,
          })
          .to(
            ".page-transition-black",
            {
              height: "0vh",
              ease: "power3.in",

              duration: "0.8",
            },
            "<"
          )
          .pause();
        s.animation.eventCallback("onReverseComplete", () => {
          update((s) => {
            s.content = null;
            return s;
          });
        });
        s.animation.eventCallback("onComplete", () => {
          update((s) => {
            s.shouldLoadImages = true;
            return s;
          });
        });
        return s;
      });
    },
    open() {},
  };
  return {
    subscribe,
    set,
    update,
    ...methods,
  };
};
export const marqueeContentStore = marqueeContent();
