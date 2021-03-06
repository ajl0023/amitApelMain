import { writable } from "svelte/store";
import gsap from "gsap";
import { dev } from "$app/env";
import { testing } from "../../storeController";
import { createEventDispatcher, tick } from "svelte";
const marqueeContent = () => {
  let state;
  if (!testing || !dev) {
    state = {
      content: null,
      active: false,
      container: null,
      animation: null,
      reversedAnimation: null,
      shouldLoadImages: false,
      activeCheckImmediate: false,
    };
  } else
    state = {
      content: null,
      testing: true,
      active: false,
      container: null,
      animation: null,
      reversedAnimation: null,
      shouldLoadImages: false,
    };

  const { subscribe, set, update } = writable(state);
  const methods = {
    reset() {
      set({
        content: null,
        active: false,
        container: null,
        animation: null,
        reversedAnimation: null,
        shouldLoadImages: false,
        activeCheckImmediate: false,
      });
    },
    setPageAnimation(page) {
      update((s) => {
        s.active = true;
        s.activeCheckImmediate = true;
        s.content = page;

        if (!dev || !testing) {
          gsap.to(".menu-wrap", {
            y: "100vh",
          });
          s.animation.play();
        } else {
          gsap.set(".menu-wrap", {
            y: "100vh",
          });
          s.animation.seek(10000);
        }
        return s;
      });
    },
    close(tl) {
      update((s) => {
        s.activeCheckImmediate = false;
        s.shouldLoadImages = false;

        s.animation.reverse();
        gsap.to(".menu-wrap", {
          y: 0,
        });

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
        s.animation.eventCallback("onReverseStart", () => {
          update((s) => {
            s.shouldLoadImages = false;

            return s;
          });
        });
        s.animation.eventCallback("onReverseComplete", () => {
          update((s) => {
            s.active = false;
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
  };
  return {
    subscribe,
    set,
    update,
    ...methods,
  };
};
export const marqueeContentStore = marqueeContent();
