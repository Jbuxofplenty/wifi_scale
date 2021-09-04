// Common packages
const functions = require('firebase-functions');
const { db } = require('./admin');

const defaultDevice = {
  dateAddedString: new Date().toLocaleString("en-US", {timeZone: "America/New_York"}),
  dateAdded: Date.now(),
  currentlySubscribed: false,
  currentWeight: 0,
  dateLastCalibrated: null,
  dateLastCalibratedString: "",
  publishFrequency: 12, // hours
  lastPublished: Date.now(),
  name: "Wifi-Scale",
  lastPublishedString: new Date().toLocaleString("en-US", {timeZone: "America/New_York"}),
  deviceType: "scale",
}


/**
 * Handles published data to the wifi-scale-topic (all wifi-scales publish here)
 *
 * The device will publish to a particular sub-topic which determines how it should be handled in the cloud. The following sub-topics are currently handled
 * @param {string} register - Registers a device by adding the default data to our database so a user who just added it can interact with it in the mobile app
 * @param {string} getWeight - A user has requested to get the current weight of the scale, so log this data to the database when it is published to this topic by the device 
 *      @param {string} data - Assumes the device sent the current weight in grams in the message
 */
handleTopicPublish = functions.pubsub.topic('wifi-scale-topic').onPublish(
  async (message, context) => {
    const deviceId = message.attributes.deviceId;
    const subFolder = message.attributes.subFolder;
    // Debug
    const messageBody = message.data ? Buffer.from(message.data, 'base64').toString() : null;
    // console.log('The function was triggered at ', context.timestamp);
    // console.log('The unique ID for the event is', context.eventId);
    console.log(deviceId, subFolder, messageBody);
    if(subFolder === "register") return registerDevice(deviceId);
    else if(subFolder === "getWeight") return updateWeight(deviceId, parseFloat(messageBody));
    else if(subFolder === "calibrated") return calibrated(deviceId);
});

async function registerDevice(deviceId) {
  let device = {...defaultDevice};
  let mac = deviceId;
  mac.match(/.{0,2}/g).join(":");
  device.mac = mac;
  return db.ref('/devices/' + deviceId).set(device);
}

async function updateWeight(deviceId, currentWeight) {
  let lastPublished = Date.now();
  let lastPublishedString = new Date().toLocaleString("en-US", {timeZone: "America/New_York"});
  await db.ref('/devices/' + deviceId).update({ lastPublished });
  await db.ref('/devices/' + deviceId).update({ lastPublishedString });
  return db.ref('/devices/' + deviceId).update({ currentWeight });
}

async function calibrated(deviceId) {
  let dateLastCalibrated = Date.now();
  let dateLastCalibratedString = new Date().toLocaleString("en-US", {timeZone: "America/New_York"});
  console.log(dateLastCalibratedString)
  await db.ref('/devices/' + deviceId).update({ dateLastCalibrated });
  return db.ref('/devices/' + deviceId).update({ dateLastCalibratedString });
}

module.exports = {
  handleTopicPublish,
}