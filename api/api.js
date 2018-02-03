const range = (len) => {
  const arr = [];
  for (let i = 0; i < len; i += 1) {
    arr.push(i);
  }
  return arr;
};

export function getServices() {
  return range(5).map(d => ({
    key: d,
    url: 'test',
    name: `test ${d}`,
    message: 'working'
  }));
}

export function getHardware() {
  return range(2).map(d => ({
    key: `Server ${d}`,
    data: range(3).map(x => ({
      key: `Hardware ${x}`,
      value: Math.floor(Math.random() * 100)
    }))
  }));
}

const IisColumns = [
  { title: 'Application', dataIndex: 'key', key: 'key' },
  { title: 'State', dataIndex: 'state', key: 'state' }
];

export function getIisApps() {
  return {
    columns: IisColumns,
    data: range(5).map(d => ({
      key: `Application ${d}`,
      state: Math.random() < 0.5 ? 'Stopped' : 'Started',
      apps: range(3).map(x => ({
        key: `chilren app ${d} ${x}`,
        state: Math.random() < 0.5 ? 'Stopped' : 'Started'
      }))
    }))
  };
}
