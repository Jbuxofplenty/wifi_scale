const stripe = require('stripe')(functions.config().stripe.token);
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

/**
 * Create a source (payment type) for a given user
 *
 * All params are referenced from req.body
 * @param {string} customerId - ID of the customer which the source should be created for
 * @param {string} source - The source generated using stripe's API by the app (mobile/web)
 * 
 * @return {Object} {type, [card, error]} - Returns the generated payment type
 */
var createSource = express();

// For production
createSource.use(bodyParser.json()) // for parsing application/json
createSource.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Automatically allow cross-origin requests
createSource.use(cors({ origin: true }));

createSource.post('*', async (req, res) => {
  await stripe.customers.createSource(
    req.body.customerId,
    {source: req.body.source},
    function(err, card) {
      if(err){
        console.log(err.message);
        res.send({ type: 'apiFailure', error: err.message })
      }
      console.log(card);
      res.send({ type: 'success', card: card })
    }
  );
});


/**
 * Create a new stripe user (should be invoked upon user account creation)
 *
 * All params are referenced from req.body
 * @param {string} email - Email of the user to create an account for
 * @param {string} firebaseId - The firebase ID of the user so the public stripe token can be updated in our DB
 * 
 * @return {Object} {type, [id, error]} - Returns the stripe ID of the user
 */
var createStripeUser = express();

// For production
createStripeUser.use(bodyParser.json()) // for parsing application/json
createStripeUser.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Automatically allow cross-origin requests
createStripeUser.use(cors({ origin: true }));

createStripeUser.post('*', async (req, res) => {
  const customer = await stripe.customers.create({ email: req.body.email });
  var temp = {'stripeId': customer.id};
  await db.ref(debug + 'users/' + req.body.firebaseId).update(temp);
  res.send({ type: 'success', id: customer.id })
});


/**
 * Retrieve a single source associated with a user account
 *
 * All params are referenced from req.body
 * @param {string} customerId - Stripe ID associated with the payment card
 * 
 * @return {Object} {type, [savedCard, error]} - Returns a single saved source to the user
 */
var retrieveCard = express();

// For production
retrieveCard.use(bodyParser.json()) // for parsing application/json
retrieveCard.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Automatically allow cross-origin requests
retrieveCard.use(cors({ origin: true }));

retrieveCard.post('*', async (req, res) => {
  await stripe.customers.listSources(
    req.body.customerId,
    {object: 'card', limit: 1},
    function(err, card) {
      if(err){
        console.log(err.message);
        res.send({ type: 'apiFailure', error: err.message })
      }
      res.send({ type: 'success', savedCard: card })
    }
  );
});


/**
 * Create a source (payment type) for a given user
 *
 * All params are referenced from req.body
 * @param {string} firebaseId - Firebase ID of the customer for use of updating the DB
 * @param {string} customer - ID of the customer which the transaction should be created for (buyer)
 * @param {string} source - The source (associated with the customer) retrieved using the retrieveCard cloud function
 * @param {string} stripeMerchantId - The merchant ID where to send the funds
 * @param {string} merchant - Name of the merchant for populating the charge description
 * @param {string} product - Name of the product for populating the charge description
 * @param {float} amount - Amount in dollars of the transaction
 * 
 * @return {Object} {type, [charge, error]} - Returns the confirmation of the charge
 */
var generateTransaction = express();

// For production
generateTransaction.use(bodyParser.json()) // for parsing application/json
generateTransaction.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Automatically allow cross-origin requests
generateTransaction.use(cors({ origin: true }));

generateTransaction.post('*', async (req, res) => {
  var feeAmount = Number.parseInt(Number.parseFloat(req.body.amount*.25));
  var email = req.body.email;
  await stripe.charges.create({
      amount: req.body.amount,
      currency: 'usd',
      customer: req.body.customer,
      source: req.body.source,
      description: 'Charge from ' + req.body.merchant + ' for ' + req.body.product + '.',
      application_fee_amount: feeAmount,
      receipt_email: email,
      transfer_data: {
        destination: req.body.stripeMerchantId,
      },
    },
    function(err, charge) {
      if(err){
        console.log(err.message);
        res.send({ type: 'apiFailure', error: err.message })
      }
      res.send({ type: 'success', charge: charge })
    }
  );
});