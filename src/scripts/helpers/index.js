export function getPromiseDataFromArray(promises) {
  return new Promise((resolve, reject) => {
    Promise.all(promises)
    .then(res => {
      return res.map(type => {
         return type.status === 200 ? type.json() : reject(type.statusText);
        }); 
        })
        .catch(reason => console.log(reason)) 
        .then(res => {
          Promise.all(res).then(resolve);
        })
        .catch(reject);
    });
}

export function flatten(array) {
  const flat = [].concat(array);

  return flat.some(Array.isArray) ? flatten(flat) : flat;
}
