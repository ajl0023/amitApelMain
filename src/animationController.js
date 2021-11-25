import { writable } from "svelte/store";
import gsap from "gsap";
import { shouldAnimate, testing } from "./storeController";
const introAnimation = () => {
  const state = {
    timeline: null,
    bars: [],
  };
  const { subscribe, set, update } = writable(state);
  const methods = {
    init(mobile) {
      const positionObj = {};
      update((s) => {
        s.timeline = gsap.timeline({
          paused: true,
        });
        s.timeline
          .to(".video-brush", {
            opacity: 0,
            delay: 3,
          })
          .to(".video-render", {
            opacity: 1,
            duration: 1,
          })
          .to(
            ".target-bar",
            {
              opacity: 1,
              stagger: 0.1,
              duration: 5,
              onStart: () => {
                for (let i = 0; i < s.bars.length; i++) {
                  const video = s.bars[i].video;
                  video.play();
                }
              },
            },
            "initialFade"
          );

        for (let i = 0; i < s.bars.length; i++) {
          const ele = s.bars[i];

          positionObj[ele.index] = s.bars[i].parentEle.getBoundingClientRect();
          s.timeline.add(
            gsap.to(
              ele.ele,
              {
                left: () => {
                  return positionObj[ele.index].left;
                },
                right: () => {
                  return positionObj[ele.index].right;
                },

                duration: 5,
                ease: "sine.out",
                y: 0,
                background: "white",

                height: () => {
                  return positionObj[ele.index].height;
                },
                top: () => {
                  return positionObj[ele.index].top;
                },
                width: () => {
                  return positionObj[ele.index].width;
                },
                paddingTop: () => {
                  return "0%";
                },
                onComplete: () => {
                  gsap.set(ele.ele, {
                    display: "none",
                  });
                  gsap.set(".bar-wrapper", {
                    pointerEvents: "auto",
                  });
                },
              },
              "lgBarAnim"
            ),
            "initialFade+=3"
          );
        }

        s.timeline.add(
          gsap.to(".target-cover", {
            opacity: 1,
          }),
          "lgBarAnim-=1"
        );

        s.timeline.add(
          gsap.to([".bar-inactive", ".main-text", ".fade", ".bar-wrapper"], {
            opacity: 1,
            duration: 2,
          }),
          "lgBarAnim-=2"
        );
        s.timeline.add(
          gsap.to(
            ".target-cover",
            {
              opacity: 0,
              repeat: "-1",
              duration: 1,
              yoyo: true,
            },
            "pulseAnimation"
          )
        );
        if (shouldAnimate === false) {
          s.timeline.seek("pulseAnimation+=10");
          gsap.set(".bar-wrapper", {
            pointerEvents: "auto",
          });
        } else if (!mobile) {
          s.timeline.play();
          window.addEventListener("resize", () => {
            s.timeline.invalidate();

            for (let i = 0; i < s.bars.length; i++) {
              const ele = s.bars[i];
              positionObj[ele.index] = ele.parentEle.getBoundingClientRect();
            }
          });
        } else {
          s.timeline.play();
          s.timeline.seek("pulseAnimation-=2");
        }

        return s;
      });
    },
    stopPulse: () => {
      update((s) => {
        s.timeline.addPause("pulseAnimation");

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
export const introAnimationStore = introAnimation();
