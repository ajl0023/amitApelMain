import { writable } from "svelte/store";

const store = () => {
  const state = {
    selected: null,
    visible: false,
  };
  const { subscribe, set, update } = writable(state);
  const methods = {
    openModal(select) {
      update((s) => {
        s.selected = select;
        s.visible = true;
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
export const privateHomesModal = store();
