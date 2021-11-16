export const shouldAnimate = true;
import { writable } from "svelte/store";
import gsap from "gsap";
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
        s.timeline = gsap.timeline({ paused: true });
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
                onComplete: () => {
                  gsap.set(ele.ele, { display: "none" });
                  gsap.set(".target-sm", { pointerEvents: "auto" });
                },
              },
              "lgBarAnim"
            ),
            "initialFade+=3"
          );
        }

        s.timeline.add(
          gsap.to(".target-sm", {
            opacity: 1,
          }),
          "lgBarAnim-=1"
        );

        s.timeline.add(
          gsap.to([".bar-sm", ".main-text"], {
            opacity: 1,
            duration: 2,
          }),
          "lgBarAnim-=2"
        );
        s.timeline.add(
          gsap.to(
            ".target-sm",
            {
              opacity: 0,
              repeat: "-1",
              duration: 1,
              yoyo: true,
            },
            "pulseAnimation"
          )
        );
        if (!mobile) {
          s.timeline.play();
          window.addEventListener("resize", () => {
            s.timeline.invalidate();
            if (s.timeline.isActive()) {
              console.log("test");
            }

            for (let i = 0; i < s.bars.length; i++) {
              const ele = s.bars[i];
              positionObj[ele.index] = ele.parentEle.getBoundingClientRect();
            }
          });
        } else {
          s.timeline.progress(1);
        }

        return s;
      });
    },
    stopPulse: () => {
      update((s) => {
        s.timeline.addPause("pulseAnimation");
        console.log(s.timeline);
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
