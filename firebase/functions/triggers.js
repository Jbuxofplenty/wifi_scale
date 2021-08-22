// Common packages
const functions = require('firebase-functions');
const { sendCommand } = require('./iot');

// Trigger Functions

deviceAdded = functions.database.ref('/users/{uid}/devices/{deviceId}').onCreate(async (snapshot, context) => {
  const deviceId = context.params.deviceId.replace(/:/g, '');
  // const uid = context.params.uid;
  // console.log(deviceId);
  // Wait a few seconds to allow the device to come online
  setTimeout(() => { sendCommand(deviceId, "register") }, 5000);
});



module.exports = {
  deviceAdded,
}