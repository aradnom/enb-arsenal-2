App.models.DataStore = Backbone.Model.extend({
  initialize: function ( bucket ) {
    // Set up base Firebase object for accessing specific bucket
    this.db = new Firebase( App.config.db.base + bucket );

    // Create new cache object for the bucket as well
    this.cache = new App.models.Cache( bucket );
  },

  /**
   * Retrieve a single record from the database based on ID.
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
      deferred.resolve( cached );
    } else {
      this.db
        .child( id )
        .on( 'value', (function ( snapshot ) {
          var value = snapshot.val();

          if ( value ) {
            // Cache the item under the id
            this.cache.setValue( id, value );

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
