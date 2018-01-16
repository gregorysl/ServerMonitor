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

export default function (len = 10) {
  return range(len).map(d => ({
    key: d,
    ...newPerson(),
  }));
}
