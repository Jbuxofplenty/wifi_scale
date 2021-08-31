// Common packages
const express = require('express');
const cors = require('cors');
const { db } = require('./admin');
const { sendCommand } = require('./iot');

/**
 * Delete a device from the firebase realtime database and reset the device to factory settings if it is online
 *
 * All params are referenced from req.body
 * @param {string} macAddress - The mac address of the microcontroller associated with the scale to be deleted
 * @param {string} uid - The firebase uid of the user who "owns" the scale
 */
var deleteDevice = express();

// For production
deleteDevice.use(express.json()) // for parsing application/json
deleteDevice.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Automatically allow cross-origin requests
deleteDevice.use(cors({ origin: true }));

deleteDevice.post('*', async (req, res, next) => {
  const macAddress = req.body.macAddress;
  const uid = req.body.uid;
  console.log(macAddress, uid)
  await db.ref('/devices/' + macAddress).remove();
  await db.ref('/users/' + uid + '/devices/' + macAddress).remove();
  sendCommand(macAddress, "reset")
  .then(function () {
    res.send({ type: 'success' });
  })
  .catch((error) => {
    next(error);
  });
});

/**
 * Send a command to a device to get the current weight of the scale and log it in the database
 *
 * All params are referenced from req.body
 * @param {string} macAddress - The mac address of the microcontroller
 */
var getCurrentWeight = express();

// For production
getCurrentWeight.use(express.json()) // for parsing application/json
getCurrentWeight.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Automatically allow cross-origin requests
getCurrentWeight.use(cors({ origin: true }));

getCurrentWeight.post('*', async (req, res, next) => {
  const macAddress = req.body.macAddress;
  sendCommand(macAddress, "getWeight")
  .then(function () {
    res.send({ type: 'success' });
  })
  .catch((error) => {
    next(error);
  });
});

/**
 * Send a command to a device to start the calibration process
 *
 * All params are referenced from req.body
 * @param {string} macAddress - The mac address of the microcontroller
 * @param {number} calibrationWeight - The weight of the object the user will place on the scale during the calibration process
 */
var calibrate = express();

// For production
calibrate.use(express.json()) // for parsing application/json
calibrate.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Automatically allow cross-origin requests
calibrate.use(cors({ origin: true }));

calibrate.post('*', async (req, res, next) => {
  const macAddress = req.body.macAddress;
  const calibrationWeight = req.body.calibrationWeight;
  const command = "calibrate " + calibrationWeight.toString();
  sendCommand(macAddress, command)
  .then(function () {
    res.send({ type: 'success' });
  })
  .catch((error) => {
    next(error);
  });
});

/**
 * Send a command to a device to update the publish frequency
 *
 * All params are referenced from req.body
 * @param {string} macAddress - The mac address of the microcontroller
 * @param {number} publishFrequency - The time in hours the scale should publish its weight to the cloud
 */
var updatePublishFrequency = express();

// For production
updatePublishFrequency.use(express.json()) // for parsing application/json
updatePublishFrequency.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Automatically allow cross-origin requests
updatePublishFrequency.use(cors({ origin: true }));

updatePublishFrequency.post('*', async (req, res, next) => {
  const macAddress = req.body.macAddress;
  const publishFrequency = req.body.publishFrequency;
  const command = "publishFrequency " + publishFrequency.toString();
  sendCommand(macAddress, command)
  .then(function () {
    res.send({ type: 'success' });
  })
  .catch((error) => {
    next(error);
  });
});

/**
 * Send a command to a device to tare the scale
 *
 * All params are referenced from req.body
 * @param {string} macAddress - The mac address of the microcontroller
 */
var tare = express();

// For production
tare.use(express.json()) // for parsing application/json
tare.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Automatically allow cross-origin requests
tare.use(cors({ origin: true }));

tare.post('*', async (req, res, next) => {
  const macAddress = req.body.macAddress;
  const command = "tare";
  sendCommand(macAddress, command)
  .then(function () {
    res.send({ type: 'success' });
  })
  .catch((error) => {
    next(error);
  });
});

/**
 * Send a command to a device to put the scale into "light" sleep mode (Wifi off and CPU off, only interupts wake it)
 *
 * All params are referenced from req.body
 * @param {string} macAddress - The mac address of the microcontroller
 */
var sleep = express();

// For production
sleep.use(express.json()) // for parsing application/json
sleep.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Automatically allow cross-origin requests
sleep.use(cors({ origin: true }));

sleep.post('*', async (req, res, next) => {
  const macAddress = req.body.macAddress;
  const command = "sleep";
  sendCommand(macAddress, command)
  .then(function () {
    res.send({ type: 'success' });
  })
  .catch((error) => {
    next(error);
  });
});


module.exports = {
  deleteDevice,
  getCurrentWeight,
  calibrate,
  updatePublishFrequency,
  tare,
  sleep,
};