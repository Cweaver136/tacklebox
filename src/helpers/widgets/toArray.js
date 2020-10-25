/* global self */
self.k = self.k || {};
self.k.toArray = function (x, $key) {
  let temp = [];
  if (Array.isArray(x)) {
    temp = x;
  } else if (Object(x) === x) {
    temp = Object.keys(x).map(key => {
      let val = x[key];
      let item = {};
      if (Object(val) === val) item = val;
      else item.$val = val;
      if (item.$key == null) item.$key = key;
      return item;
    });
  } else if (x != null) {
    if ($key) temp = [{$key: '$val', $val: x}];
    else temp = [x];
  }
  if ($key === undefined) {

  } else if ($key) {
    temp = temp.map((item, i) => {
      if (!Object(item) === item) {
        item = {$key: i, $val: item};
      } else if (item.$key == null) {
        item.$key = i;
      }
      return item;
    });
  } else {
    temp = temp.map((item, i) => {
      if (Object(item) === item) {
        if (item.$val !== undefined) item = item.$val;
        else for (let prop in item) if (prop[0] === '$') delete item[prop];
      }
      return item;
    });
  }
  return temp;
};