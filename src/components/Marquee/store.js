import { writable } from "svelte/store";
import gsap from "gsap";
const marqueeContent = () => {
  const state = {
    content: null,
    active: false,
    container: null,
    animation: null,
    reversedAnimation: null,
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
          y: "100vh",
        });
        s.animation.play();
        return s;
      });
    },
    close(tl) {
      update((s) => {
        s.active = false;
        s.animation.reverse();
        gsap.to(".menu-wrap", {
          y: 0,
        });

        s.shouldLoadImages = false;

        return s;
      });

      // .then(() => {});
    },
    initAnim() {
      update((s) => {
        s.animation = gsap.timeline({
          paused: true,
        });
        s.reversedAnimation = gsap.timeline({
          paused: true,
        });
        s.reversedAnimation
          .to(".page-transition-black", {
            height: "100vh",
            ease: "power3.out",

            duration: "0.8",
          })
          .to(s.container, {
            top: "100vh",
          })
          .to(
            ".page-transition-black",
            {
              height: "0vh",
              ease: "power3.in",

              duration: "0.8",
            },
            "<"
          );

        s.animation
          .to(".page-transition-black", {
            height: "100vh",
            ease: "power3.in",

            duration: "1",
          })
          .to(s.container, {
            y: "0%",
          })

          .to(
            ".page-transition-black",
            {
              height: "0vh",
              ease: "power3.in",

              duration: "0.8",
            },
            "<"
          );

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
    init(ele) {
      update((s) => {
        s.container = ele;
        return s;
      });
      this.initAnim(ele);
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
