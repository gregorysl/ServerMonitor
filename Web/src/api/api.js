const userSessions = [
  { User: 'Domain\\f-greg', LoginDate: '09/02/2018 22:03', State: 'Disconnected' },
  { User: 'Domain\\f-asd', LoginDate: '09/02/2018 22:03', State: 'Disconnected' }
];

const oracle = [
  {
    Id: 10,
    CurrentBuildName: 'QA.174',
    CurrentBuildDate:
      '06/02/2018 09:49',
    DisplayName: 'f-ora1',
    IsReserved: false,
    IsDeploying: false
  }, {
    Id: 20,
    CurrentBuildName: 'QA.175',
    CurrentBuildDate:
      '08/02/2018 18:46',
    DisplayName: 'f-ora2',
    IsReserved: false,
    IsDeploying: true
  }, {
    Id: 30,
    CurrentBuildName: 'QA.176',
    CurrentBuildDate:
      '09/02/2018 00:50',
    DisplayName: 'f-ora3',
    IsReserved: true,
    IsDeploying: false
  }, {
    Id: 40,
    CurrentBuildName: 'QA.501',
    CurrentBuildDate:
      '09/02/2018 09:46',
    DisplayName: 'f-ora4',
    IsReserved: false,
    IsDeploying: false
  }];

const scheduledTasks = [{
  Name: 'CleanBuilds', State: 'Ready', Path: '\\CleanBuilds', LastRunTime: '09/02/2018 19:06', LastTaskResult: 0
}];

const disk = [
  {
    key: 'C:\\Logs', Path: 'C:\\Logs', Size: 12180661, Usage: 0.01
  },
  {
    key: 'C:\\inetpub\\wwwroot', Path: 'C:\\inetpub\\wwwroot', Size: 1861605907, Usage: 1.74
  }
];

let iisData =
  '{"columns":[{"title":"Application","dataIndex":"key","key":"key"},{"title":"Stat'
  + 'e","dataIndex":"state","key":"state"}],"data":[{"key":"Application 0","state":"S'
  + 'topped","note":"","apps":[{"key":"chilren app 0 0","state":"Started"},{"key":"ch'
  + 'ilren app 0 1","state":"Started"},{"key":"chilren app 0 2","state":"Stopped"}]},'
  + '{"key":"Application 1","state":"Stopped","note":"","apps":[{"key":"chilren app 1'
  + ' 0","state":"Started"},{"key":"chilren app 1 1","state":"Started"},{"key":"chilr'
  + 'en app 1 2","state":"Stopped"}]},{"key":"Application 2","state":"Started","note"'
  + ':"","apps":[{"key":"chilren app 2 0","state":"Started"},{"key":"chilren app 2 1"'
  + ',"state":"Stopped"},{"key":"chilren app 2 2","state":"Stopped"}]},{"key":"Applic'
  + 'ation 3","state":"Stopped","note":"","apps":[{"key":"chilren app 3 0","state":"S'
  + 'topped"},{"key":"chilren app 3 1","state":"Started"},{"key":"chilren app 3 2","s'
  + 'tate":"Started"}]},{"key":"Application 4","state":"Started","note":"","apps":[{"'
  + 'key":"chilren app 4 0","state":"Stopped"},{"key":"chilren app 4 1","state":"Stop'
  + 'ped"},{"key":"chilren app 4 2","state":"Stopped"}]}]}';

function getIissDatas() {
  return JSON.parse(iisData);
}
export function setIisApp(appName) {
  const data = getIissDatas();
  Object.keys(data.data).forEach((key) => {
    Object.keys(data.data[key]).forEach((subkey) => {
      if (subkey === 'key' && data.data[key][subkey] === appName) {
        const state = data.data[key].state === 'Started' ? 'Stopped' : 'Started';
        data.data[key].state = state;
        Object.keys(data.data[key].apps).forEach((app) => {
          data.data[key].apps[app].state = state;
        });
      }
    });
  });
  iisData = JSON.stringify(data);
}
const range = (len) => {
  const arr = [];
  for (let i = 0; i < len; i += 1) {
    arr.push(i);
  }
  return arr;
};

export function getServices() {
  return [{
    key: 'Fdim', working: false, message: "An error occurred while sending the request.\\r\\nThe remote name could not be resolved: 'propp-jav.com'\\r\\n", url: 'https://propp-jav.com:8083/MessageBroker/ping'
  }, {
    key: 'ElasticSearch', working: false, message: 'Unauthorized', url: 'https://localhost:9200/'
  }, {
    key: 'Google', working: true, message: 'OK', url: 'https://www.google.com/'
  }];
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


export function getIisApps() {
  return getIissDatas();
}

export function getDisk() {
  return {
    data: disk
  };
}

export function getTasks() {
  return {
    data: scheduledTasks
  };
}

export function getUserSessions() {
  return {
    data: userSessions
  };
}

export function getOracleInstancies() {
  return {
    data: oracle
  };
}
