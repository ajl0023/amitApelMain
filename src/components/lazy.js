export function lazy(node) {
  const lazyLoadInstance = document.lazyLoadInstance;
  lazyLoadInstance.update();
  return {
    update(url) {
      LazyLoad.resetStatus(node);
      lazyLoadInstance.update();
    },
  };
}
