export function getPromiseDataFromArray(promises) {
  return new Promise((resolve, reject) => {
    Promise.all(promises)
      .then(res => {
        return res.map(type => type.json());
      })
      .then(res => {
        Promise.all(res).then(resolve);
      })
      .catch(reject);
  });
}
