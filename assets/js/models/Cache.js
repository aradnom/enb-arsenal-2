App.models.Cache = Backbone.Model.extend({
  initialize: function ( bucket ) {
    this.bucket = bucket;

    // Populate/create initial cache bucket
    var cache  = localStorage.getItem( 'cache_' + bucket );

    try {
      this.cache = JSON.parse( cache );
    } catch ( err ) {
      console.error( 'Error parsing cache bucket: ', err );
    }

    // If it doesn't exist, create a blank object (but don't bother storing it
    // yet until something is actually pushed to it)
    if ( ! this.cache ) { this.cache = {}; }
  },

  /**
   * Retrieve the entire bucket.
   *
   * @return {Object} Returns the entire cache bucket
   */
  getAll: function () {
    return this.cache;
  },

  /**
   * Attempt to retrieve a value from the bucket based on a specific key.
   *
   * @param {String} key Key to search cache for
   *
   * @return {Mixed} Returns cached value if found or null
   */
  getValue: function ( key ) {
    return this.cache[ key ];
  },

  /**
   * Set a new cache value based on a specific key and persist it to local
   * storage.
   *
   * @param {String} key   Key to set new value under
   * @param {Mixed} value Value to set with key
   */
  setValue: function ( key, value ) {
    this.cache[ key ] = value;

    try {
      var update = JSON.stringify( this.cache );

      // Save the current version of the cache
      localStorage.setItem( 'cache_' + this.bucket, update );
    } catch ( err ) {
      console.error( 'Unable to save cache bucket: ', err );
    }
  },

  /**
   * Flush the cache completely.
   */
  flush: function () {
    localStorage.removeItem( 'cache_' + this.bucket );
  }
});
