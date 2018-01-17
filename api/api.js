const range = (len) => {
  const arr = [];
  for (let i = 0; i < len; i += 1) {
    arr.push(i);
  }
  return arr;
};
const newPerson = () => ({
  firstName: 'asd',
  lastName: 'zxcasf',
  age: Math.floor(Math.random() * 30),
  visits: Math.floor(Math.random() * 100),
});

export function getPeople(len = 10) {
  return range(len).map(d => ({
    key: d,
    ...newPerson(),
  }));
}

export function getServices() {
  return range(5).map(d => ({
    key: d,
    url: 'test',
    name: `test ${d}`,
    message: 'working',
  }));
}
