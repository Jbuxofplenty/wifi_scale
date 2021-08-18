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
  submitIssue,
  whileYouWereAway,
} = require('./stripe');

// Create an Express object and routes (in order)
const github = express();
github.use('/submitIssue', submitIssue);
github.use('/whileYouWereAway', whileYouWereAway);
github.use(getDefault);


///////////////////////////////////////////////////////////////////
//////////////////////        VERSION          ////////////////////
///////////////////////////////////////////////////////////////////
const v1 = express();
v1.use('/stripe', stripe);
v1.use(getDefault);


module.exports = {
  v1,
};
