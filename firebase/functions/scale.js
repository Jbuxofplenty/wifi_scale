// Common packages
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
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
deleteDevice.use(bodyParser.json()) // for parsing application/json
deleteDevice.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Automatically allow cross-origin requests
deleteDevice.use(cors({ origin: true }));

deleteDevice.post('*', async (req, res) => {
  const macAddress = req.body.macAddress;
  const uid = req.body.uid;
  await sendCommand(macAddress, "reset");
  await db.ref('/devices/' + macAddress).remove();
  await db.ref('/users/' + uid + '/devices/' + macAddress).remove();
  res.send({ type: 'success'});
});

/**
 * Send a command to a device to get the current weight of the scale and log it in the database
 *
 * All params are referenced from req.body
 * @param {string} macAddress - The mac address of the microcontroller associated with the scale to be deleted
 */
var getCurrentWeight = express();

// For production
getCurrentWeight.use(bodyParser.json()) // for parsing application/json
getCurrentWeight.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Automatically allow cross-origin requests
getCurrentWeight.use(cors({ origin: true }));

getCurrentWeight.post('*', async (req, res) => {
  const macAddress = req.body.macAddress;
  await sendCommand(macAddress, "getWeight");
  res.send({ type: 'success'});
});


module.exports = {
  deleteDevice,
  getCurrentWeight,
};