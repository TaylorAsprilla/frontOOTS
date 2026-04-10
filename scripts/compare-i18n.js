const fs = require('fs');
const path = require('path');

function walkPaths(obj, prefix) {
  prefix = prefix || '';
  var out = {};
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    var k = keys[i];
    var full = prefix ? prefix + '.' + k : k;
    var val = obj[k];
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      var nested = walkPaths(val, full);
      var nk = Object.keys(nested);
      for (var j = 0; j < nk.length; j++) out[nk[j]] = nested[nk[j]];
    } else {
      out[full] = val;
    }
  }
  return out;
}

var base = 'src/assets/i18n/';
var co = walkPaths(JSON.parse(fs.readFileSync(base + 'es-CO.json', 'utf8')));
var pr = walkPaths(JSON.parse(fs.readFileSync(base + 'es-PR.json', 'utf8')));
var en = walkPaths(JSON.parse(fs.readFileSync(base + 'en.json', 'utf8')));

var coKeys = Object.keys(co).sort();
var prSet = new Set(Object.keys(pr));
var enSet = new Set(Object.keys(en));
var prKeys = Object.keys(pr).sort();
var enKeys = Object.keys(en).sort();

console.log(
  '\n=== En CO pero NO en PR (' +
    coKeys.filter(function (k) {
      return !prSet.has(k);
    }).length +
    ') ===',
);
coKeys
  .filter(function (k) {
    return !prSet.has(k);
  })
  .forEach(function (k) {
    console.log('  ' + k + ' = ' + co[k]);
  });

console.log(
  '\n=== En CO pero NO en EN (' +
    coKeys.filter(function (k) {
      return !enSet.has(k);
    }).length +
    ') ===',
);
coKeys
  .filter(function (k) {
    return !enSet.has(k);
  })
  .forEach(function (k) {
    console.log('  ' + k + ' = ' + co[k]);
  });

console.log(
  '\n=== En PR pero NO en CO (' +
    prKeys.filter(function (k) {
      return !co.hasOwnProperty(k);
    }).length +
    ') ===',
);
prKeys
  .filter(function (k) {
    return !co.hasOwnProperty(k);
  })
  .forEach(function (k) {
    console.log('  ' + k + ' = ' + pr[k]);
  });

console.log(
  '\n=== En EN pero NO en CO (' +
    enKeys.filter(function (k) {
      return !co.hasOwnProperty(k);
    }).length +
    ') ===',
);
enKeys
  .filter(function (k) {
    return !co.hasOwnProperty(k);
  })
  .forEach(function (k) {
    console.log('  ' + k + ' = ' + en[k]);
  });

console.log('\nTotales: CO=' + coKeys.length + ', PR=' + Object.keys(pr).length + ', EN=' + Object.keys(en).length);
