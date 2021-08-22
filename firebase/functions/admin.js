const admin = require('firebase-admin');
// Initialize app for all files
const app = admin.initializeApp();
const db = admin.database();

module.exports = {
  app,
  db,
}