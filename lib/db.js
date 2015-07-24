/**
 * Establish connection with MongoDB and return the connection.  Returns
 * promise with connection on success or error if not.
 */

var Promise = require( 'bluebird' );
var Mongo   = require( 'mongodb' ).MongoClient;
var config  = require( './config' );

// Set up connection string from the config
var connectUrl = 'mongodb://' + config.db.host + ':' + config.db.port + '/' + config.db.db;

// Attempt to establish the connection
var deferred = Promise.defer();

Mongo.connect( connectUrl, function ( err, db ) {
  if ( err ) {
    return deferred.reject( err );
  }

  // Return the established connection
  return deferred.resolve( db );
});

// Send back the deferred promise
module.exports = deferred.promise;
