var _  = require( 'lodash' );

// Main config
var config = {
  basePath: __dirname.replace( 'lib', '' ),
  env: 'production',
  port: 3622,
  db: {
    host: 'localhost',
    port: 27017,
    db: 'enbarsenal'
  }
};

// Roll in any config options from the local config
config = _.merge( config, getLocalConfig() );

// And return the finished config
module.exports = config;

///////////////////////////////////////////////////////////////////////////////
// Functions //////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

/**
 * Attempt to read in local config.  Any options set here will bypass the
 * options in the main config.
 *
 * @return {Object} Returns any retrieved config options from local config or
 * empty object if there are none
 */
function getLocalConfig () {
  // Check for a local config and return it if found
  try {
    return require( './config.local' );
  } catch ( err ) {
    // If the module wasn't found, that's fine, do nothing
    if ( err ) {
      if ( err.code !== 'MODULE_NOT_FOUND' ) {
        console.error( 'Error opening local config: ', err.code );

        // Just return an empty object if it wasn't found
        return {};
      }
    }
  }
}
