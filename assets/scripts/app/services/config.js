var Config = require( '../models/config' );

// Database config
module.exports = {
  db: new Config({
    base: 'https://incandescent-torch-1326.firebaseio.com/'
  })
};
