export const wait = (func, delay = 0) => {
  setTimeout(() => {
    func();
  }, delay * 1000);
};

//just to follow structure
