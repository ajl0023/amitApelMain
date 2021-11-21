import { readable, writable } from "svelte/store";
import { getRandomNumber, lerp, map } from "../../animationUtils";
export const mousePos = readable(
  {
    x: 0,
    y: 0,
  },
  (set) => {
    function mouseCoords(e) {
      set({
        x: e.clientX,
        y: e.clientY,
      });
    }
    window.addEventListener("mousemove", mouseCoords);
    return () => {
      window.removeEventListener("mousemove", mouseCoords);
    };
  }
);

export const pressCard = () => {
  const state = {
    xStart: 0,
    yStart: 0,
    mouseX: 0,
    mouseY: 0,
    tx: 0,
    ty: 0,
  };
  const { subscribe, set, update } = writable(state);

  const methods = {
    init() {
      update((s) => {
        s.xStart = getRandomNumber(10, 30);
        s.yStart = getRandomNumber(10, 25);
        return s;
      });
    },
    getMousePos(x, y) {
      update((s) => {
        s.mouseX = x;
        s.mouseY = y;
        return s;
      });
      this.calcMap();
    },
    calcMap() {
      update((s) => {
        s.tx = lerp(
          s.tx,
          map(s.mouseX, 0, window.innerWidth, s.xStart, -s.xStart),
          0.07
        );
        s.ty = lerp(
          s.ty,
          map(s.mouseY, 0, window.innerWidth, s.yStart, -s.yStart),
          0.07
        );
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
