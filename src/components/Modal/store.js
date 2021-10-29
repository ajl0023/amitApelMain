import { writable } from "svelte/store";

const store = () => {
  const state = {
    content: null,
    visible: false,
  };
  const { subscribe, set, update } = writable(state);
  const methods = {
    closeModal() {
      update((s) => {
        s.content = null;
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
export const modalStore = store();
