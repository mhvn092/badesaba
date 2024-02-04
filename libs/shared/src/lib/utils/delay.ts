export function delay(ms: number, description = '') {
  console.log('sleep for ' + ms + ' ms ' + description);
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('release after ' + ms + ' ms sleep ' + description);
      resolve(true);
    }, ms);
  });
}
