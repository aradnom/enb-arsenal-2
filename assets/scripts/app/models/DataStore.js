var Cache  = require( './cache' );
var config = require( '../services/config' );

module.exports = Backbone.Model.extend({
  initialize: function ( type ) {
    // Save the type for use later
    this.type  = type;

    // Create new cache object for the type as well
    this.cache = new Cache( type );
  },

  /**
   * Retrieve a single record from the database based on id.
   *
   * @param {Integer} id ID of record to retrieve
   *
   * @return {Object} Returns promise containing record or error
   */
  get: function ( id ) {
    var deferred = Promise.defer();

    if ( ! id ) { return deferred.reject( 'invalidParams' ); }

    // Attempt to pull the object from the cache
    var cached = this.cache.getValue( id );

    if ( cached ) {
      // Hurray, return immediately
      deferred.resolve( cached );
    } else {
      // Fine, make fresh request for it
      $.getJSON( '/get/' + this.type + '/' + id, ( function ( result ) {
        if ( result && result.success ) {
          // Set item in the cache
          this.cache.setValue( id, result.result );

          // And back we go
          return deferred.resolve( result.result );
        } else {
          return deferred.reject();
        }
      }).bind( this ));
    }

    return deferred.promise;
  }
});
