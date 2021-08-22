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

export async function retrieveScaleMAC() {
  let rawHTML = await axios({
    method: 'get',
    url: 'http://192.168.4.1/info?',
    responseType: 'text'
  })
  .then(function (response) {
    return response.data
  });
  const root = parse(rawHTML);
  let mac = "";
  root.querySelectorAll('dt').forEach((element) => {
    if(element.text === "Station MAC") {
      mac = element.nextSibling.text;
    }
  })
  return mac.replace(/:/g, "");
}

export async function connectToSSID(data) {
  let rawHTML = await axios({
    method: 'post',
    url: 'http://192.168.4.1/wifisave',
    data,
    responseType: 'text'
  })
  .then(function (response) {
    return response.data;
  })
  return rawHTML;
}