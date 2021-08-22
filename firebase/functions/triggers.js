// Common packages
const functions = require('firebase-functions');
const { sendCommand } = require('./iot');

// Trigger Functions

deviceAdded = functions.database.ref('/users/{uid}/devices/{deviceId}').onCreate(async (snapshot, context) => {
  const deviceId = context.params.deviceId.replace(/:/g, '');
  // const uid = context.params.uid;
  // console.log(deviceId);
  sendCommand(deviceId, "register");
});



module.exports = {
  deviceAdded,
}