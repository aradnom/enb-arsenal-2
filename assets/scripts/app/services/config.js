var Config = require( '../models/config' );

// Search config
module.exports = {
  search: new Config({
    limit: 25
  }),
  cache: new Config({
    limit: 500000
  })
};
