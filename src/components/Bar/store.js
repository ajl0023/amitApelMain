import { writable } from "svelte/store";
import gsap from "gsap";
import { dev } from "$app/env";
import { testing } from "../../storeController";

export const loadedVideos = writable([]);

const store = () => {
  let state = {
    exited: [],
    currentIndex: null,
    mobileAnimationSet: {},
    desktopAnimationSet: {},
    hide: false,
    marqueeEle: null,
    pageContent: false,
    centerPosition: {
      x: 0,
      y: 0,
    },
  };
  if (dev && testing) {
    state = {
      exited: [],
      currentIndex: 3,
      mobileAnimationSet: {},
      desktopAnimationSet: {},
      hide: false,
      marqueeEle: null,
      testing: true,
      pageContent: true,
      centerPosition: {
        x: 0,
        y: 0,
      },
    };
  }
  const { subscribe, set, update } = writable(state);
  const methods = {
    attachReverseListener(anim) {},
    initMarquee(anim) {
      update((s) => {
        s.marqueeEle = document.querySelector(".marquee-container-main");
        return s;
      });
    },
    init(index, animMobile, animDesktop) {
      update((s) => {
        this.attachReverseListener(animMobile);
        this.attachReverseListener(animDesktop);

        return s;
      });
    },

    showMarquee(i, size, centerPosition) {
      update((s) => {
        s.centerPosition = {
          x: 0,
          y: 0,
        };
        s.desktopAnimationSet[i] = gsap.timeline();
        s.desktopAnimationSet[i].eventCallback("onReverseComplete", () => {
          update((s) => {
            s.hide = false;
            s.currentIndex = false;
            s.centerPosition = false;
            this.pageContentToggle(false);
            return s;
          });
        });
        gsap.set(s.marqueeEle, {
          left: centerPosition.x,
          top: centerPosition.y,
        });
        s.desktopAnimationSet[i].to(s.marqueeEle, {
          width: "100vw",
          top: 0,
          duration: 0.4,
          height: "100vh",
          left: 0,
        });

        this.setPageContent(i);

        this.pageContentToggle(true);

        return s;
      });
    },
    setPageContent(i) {
      update((s) => {
        s.currentIndex = i;

        return s;
      });
    },
    pageContentToggle(bool) {
      update((s) => {
        s.pageContent = bool;
        return s;
      });
    },
    showMarqueeDesktop(i) {
      update((s) => {
        s.desktopAnimationSet[i].play();
        return s;
      });
    },
    closeMarquee(size) {
      update((s) => {
        s.desktopAnimationSet[s.currentIndex].reverse();

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
export const lgBarStore = store();
