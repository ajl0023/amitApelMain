window.addEventListener("keydown", (e) => {
  if (e.key === "z") {
    marqueeContentStore.update((v) => {
      v.content = "private homes";
      return v;
    });
  }
  if (e.key === "x") {
    marqueeContentStore.update((v) => {
      v.content = "concept";
      return v;
    });
  }
  if (e.key === "c") {
    marqueeContentStore.update((v) => {
      v.content = "multi units";
      return v;
    });
  }
});
