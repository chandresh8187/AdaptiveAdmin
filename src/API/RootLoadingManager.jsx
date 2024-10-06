let RootLoading = false;
const listeners = [];

const setRootLoading = (newLoading) => {
  RootLoading = newLoading;
  listeners.forEach((listener) => listener(RootLoading));
};

const subscribeRootToLoading = (listener) => {
  listeners.push(listener);
  // Provide the initial loading state to the listener
  listener(RootLoading);
};

const unsubscribeRootFromLoading = (listener) => {
  const index = listeners.indexOf(listener);
  if (index !== -1) {
    listeners.splice(index, 1);
  }
};

export { unsubscribeRootFromLoading, setRootLoading, subscribeRootToLoading };
