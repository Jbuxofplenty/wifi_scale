// Common packages
const iot = require('@google-cloud/iot');
const iotClient = new iot.v1.DeviceManagerClient({
  // optional auth parameters.
});

/**
 * Send a command to a device in the registry
 *
 * All params are referenced from req.body
 * @param {string} deviceId - The device id the message should be sent to
 * @param {string} commandMessage - The command to send to the device
 */

async function sendCommand(deviceId, commandMessage) {
  const projectId = 'wifi-scale-9b7b1';
  const registryId = 'wifi-scale-registry';
  const cloudRegion = 'us-central1';

  // Construct request
  // ASSUMPTION: Device ID's are the mac addresses with all of the colons removed
  const formattedName = iotClient.devicePath( 
    projectId,
    cloudRegion,
    registryId,
    deviceId.replace(/:/g, "")
  );

  const binaryData = Buffer.from(commandMessage);

  const request = {
    name: formattedName,
    binaryData: binaryData,
  };

  const [response] = await iotClient.sendCommandToDevice(request);
  console.log('Sent command: ', response);
}


module.exports = {
  sendCommand,
};