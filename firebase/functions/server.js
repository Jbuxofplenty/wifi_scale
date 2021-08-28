// Common packages
const express = require('express');

// Common functions
const { 
  getDefault,
} = require('./util');

///////////////////////////////////////////////////////////////////
//////////////////////        STRIPE          /////////////////////
///////////////////////////////////////////////////////////////////

const { 
  createStripeUser,
  createSource,
  retrieveCard,
  generateTransaction,
} = require('./stripe');

// Create an Express object and routes (in order)
const stripe = express();
stripe.use('/createStripeUser', createStripeUser);
stripe.use('/createSource', createSource);
stripe.use('/createStripeUser', retrieveCard);
stripe.use('/createSource', generateTransaction);
stripe.use(getDefault);

///////////////////////////////////////////////////////////////////
//////////////////////        SCALE          //////////////////////
///////////////////////////////////////////////////////////////////

const { 
  deleteDevice,
  getCurrentWeight,
  calibrate,
  updatePublishFrequency,
  tare,
} = require('./scale');

// Create an Express object and routes (in order)
const scale = express();
scale.use('/deleteDevice', deleteDevice);
scale.use('/getCurrentWeight', getCurrentWeight);
scale.use('/calibrate', calibrate);
scale.use('/updatePublishFrequency', updatePublishFrequency);
scale.use('/tare', tare);
scale.use(getDefault);


///////////////////////////////////////////////////////////////////
//////////////////////        VERSION          ////////////////////
///////////////////////////////////////////////////////////////////

const v1 = express();
v1.use('/stripe', stripe);
v1.use('/scale', scale);
v1.use(getDefault);


module.exports = {
  v1,
};
