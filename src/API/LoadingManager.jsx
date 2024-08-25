let loading = false;
const listeners = [];

const setLoading = (newLoading) => {
  loading = newLoading;
  listeners.forEach((listener) => listener(loading));
};

const subscribeToLoading = (listener) => {
  listeners.push(listener);
  // Provide the initial loading state to the listener
  listener(loading);
};

const unsubscribeFromLoading = (listener) => {
  const index = listeners.indexOf(listener);
  if (index !== -1) {
    listeners.splice(index, 1);
  }
};

export { unsubscribeFromLoading, setLoading, subscribeToLoading };
