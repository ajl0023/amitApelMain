import { writable } from "svelte/store";
import { layout } from "./layout";
const store = () => {
  const state = {
    selected: null,
    visible: false,
    images: null,
  };
  const { subscribe, set, update } = writable(state);
  const methods = {
    openModal(content, category) {
      update((s) => {
        s.selected = content;
        s.visible = true;
        s.images = layout[category]
          ? layout[category]["images"][content.key].images
          : null;
        return s;
      });
    },
    closeModal() {
      update((s) => {
        s.selected = null;
        s.visible = false;
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
export const galleryModal = store();
