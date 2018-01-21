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

const columns = [
  { title: 'First Name', dataIndex: 'firstName', key: 'firstName' },
  { title: 'Last Name', dataIndex: 'lastName', key: 'lastName' },
  { title: 'Visits', dataIndex: 'visits', key: 'visits' },
  { title: 'Age', dataIndex: 'age', key: 'age' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
];

export function getPeople(len = 10) {
  return {
    columns,
    data: range(len).map(d => ({ key: d, ...newPerson() })),
  };
}

export function getServices() {
  return range(5).map(d => ({
    key: d,
    url: 'test',
    name: `test ${d}`,
    message: 'working',
  }));
}

export function getHardware() {
  return range(2).map(d => ({
    key: `Server ${d}`,
    data: range(3).map(x => ({
      key: `Hardware ${x}`,
      value: Math.floor(Math.random() * 100),
    })),
  }));
}
