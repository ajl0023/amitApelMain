import { writable } from "svelte/store";

export const loadedVideos = writable([]);

const store = () => {
  const state = {
    exited: [],
    currentIndex: null,
    mobileAnimationSet: {},
    desktopAnimationSet: {},
    hide: false,
    pageContent: false,
    centerPosition: {
      x: 0,
      y: 0,
    },
  };
  const { subscribe, set, update } = writable(state);
  const methods = {
    attachReverseListener(anim) {
      anim.eventCallback("onReverseComplete", () => {
        update((s) => {
          s.hide = false;
          this.pageContentToggle(false);
          return s;
        });
      });
    },
    init(index, animMobile, animDesktop) {
      update((s) => {
        this.attachReverseListener(animMobile);
        this.attachReverseListener(animDesktop);
        s.mobileAnimationSet[index] = animMobile;
        s.desktopAnimationSet[index] = animDesktop;
        return s;
      });
    },

    showMarquee(i, size, centerPosition) {
      update((s) => {
        s.centerPosition = centerPosition;
        this.setPageContent(i);
        if (size === "mobile") {
          s.mobileAnimationSet[i].play();
        } else {
          s.desktopAnimationSet[i].play();
        }
        this.pageContentToggle(true);
        s.hide = true;
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
        if (size === "mobile") {
          s.mobileAnimationSet[s.currentIndex].reverse();
        } else {
          s.desktopAnimationSet[s.currentIndex].reverse();
        }

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
