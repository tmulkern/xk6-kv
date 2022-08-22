import kv from 'k6/x/kv';
import { check } from 'k6';
import exec from 'k6/execution';

export const options = {
  scenarios: {
    generator: {
      exec: 'generator',
      executor: 'per-vu-iterations',
      vus: 5,
    },
    results: {
      exec: 'results',
      executor: 'per-vu-iterations',
      startTime: '1s',
      maxDuration: '2s',
      vus: 1,
    },
    ttl: {
      exec: 'ttl',
      executor: 'constant-vus',
      startTime: '3s',
      vus: 1,
      duration: '2s',
    },
  },
};

const client = new kv.Client();

export function generator() {
  client.set(`hello_${__VU}`, 'world');
  client.setWithTTLInSecond(`ttl_${__VU}`, `ttl_${__VU}`, 5);
}

export function results() {
  var value = client.get("hello_1")

  check(value,{
    "Item contains correct value" : (v) => v == 'world'
  });

  console.debug(value);

  client.delete("hello_1");

  try {
    var keyDeleteValue = client.get("hello_1");
    console.debug(typeof (keyDeleteValue));
  }
  catch (err) {
    check(err,{
      "Delete: Empty value is correct" : (e) => Object.keys(e.value).length == 0
    });
    console.debug("empty value", err);
  }
  var r = client.viewPrefix("hello");

  check(r,{
    "Collection of values with prefix 'hello' created" : (x) => Object.keys(x).length > 0
  })

  for (var key in r) {
    console.debug(key, r[key])
  }
}

export function ttl() {
  try {
    var value = client.get('ttl_1')
    
    check(value,{
      "TTL: Item contains correct value" : (v) => v == 'ttl_1'
    });

    console.debug(value);
  }
  catch (err) {
    check(err,{
      "TTL : Empty value is correct" : (e) => Object.keys(e.value).length == 0
    });
    console.debug("empty value", err);
  }
}