import axios from 'axios';
import { parse } from 'node-html-parser';

export async function retrieveSSIDs() {
  let rawHTML = await axios({
    method: 'get',
    url: 'http://192.168.4.1/wifi?',
    responseType: 'text'
  })
  .then(function (response) {
    return response.data
  });
  const root = parse(rawHTML);
  let ssids = root.querySelectorAll('a').map(function (el) {
    return el.text;
  });
  let signalStrengths = root.querySelectorAll('[role="img"]').map(function (el) {
    return el.getAttribute('title');
  });
  return { ssids, signalStrengths };
}

export async function connectToSSID(opts) {
  let response = await fetch('http://192.168.4.1/wifi', {
    method: 'post',
    body: JSON.stringify(opts)
  });
  let data = await response.json();
  return data;
}

export async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}