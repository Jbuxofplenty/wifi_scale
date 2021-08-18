// Utility functions 
// Server response when URL invalid
function getDefault(req, res) { res.status(404).send('Bad URL'); }

module.exports = {
  getDefault
};
  