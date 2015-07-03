App.models.DataStore = Backbone.Model.extend({
  initialize: function ( bucket ) {
    // Set up base Firebase object for accessing specific bucket
    this.db = new Firebase( App.config.db.base + bucket );

    // Create new cache object for the bucket as well
    this.cache = new App.models.Cache( bucket );
  },

  /**
   * Retrieve a single record from the database based on slug.
   *
   * @param {Integer} id ID of record to retrieve
   *
   * @return {Object} Returns promise containing record or error
   */
  get: function ( slug ) {
    var deferred = Promise.defer();

    if ( ! slug ) { return deferred.reject( 'invalidParams' ); }

    // Attempt to pull the object from the cache
    var cached = this.cache.getValue( slug );

    if ( cached ) {
      deferred.resolve( cached );
    } else {
      this.db
        .orderByChild( 'slug' )
        .equalTo( slug )
        .limitToFirst( 1 )
        .once( 'value', (function ( snapshot ) {
          var value = snapshot.val();

          if ( value ) {
            // Pop the first record out
            value = value[ Object.keys( value )[ 0 ] ];

            // Cache the item under the id
            this.cache.setValue( slug, value );

            deferred.resolve( value );
          } else {
            deferred.reject( 'noResults' );
          }
        }).bind( this ), function ( err ) {
          deferred.reject( err.code );

          console.error( 'Error retrieving database object: ', err );
        });
    }

    return deferred.promise;
  }
});
