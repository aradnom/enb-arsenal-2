module.exports = Backbone.Model.extend({
  initialize: function ( bucket ) {
    this.bucket = bucket;

    // Populate/create initial cache bucket
    var cache  = localStorage.getItem( 'cache_' + bucket );

    // Likewise with internal added array (keeps track of when items were added
    // to the cache)
    var added  = localStorage.getItem( 'cache_added_' + bucket );

    try {
      this.cache = JSON.parse( cache );
    } catch ( err ) {
      console.error( 'Error parsing cache bucket: ', err );
    }

    try {
      this.cacheAdded = JSON.parse( added );
    } catch ( err ) {
      console.error( 'Error parsing cache added array: ', err );
    }

    // If it doesn't exist, create a blank object (but don't bother storing it
    // yet until something is actually pushed to it)
    if ( ! this.cache ) { this.cache = {}; }
    if ( ! this.cacheAdded ) { this.cacheAdded = []; }
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
    // First thing, check if there's room in the cache.  If there's not, remove
    // the oldest item added to make room, then proceed.
    this.clearCacheSpace();

    // Then move on to adding this item
    this.cache[ key ] = value;
    this.cacheAdded.push( key );

    // Then save the current cache
    this.saveCache();
  },

  /**
   * Save the current cache contents (persist the contents to localStorage).
   */
  saveCache: function () {
    try {
      var update = JSON.stringify( this.cache );

      // Save the current version of the cache
      localStorage.setItem( 'cache_' + this.bucket, update );

      // Update the added array as well (but only if adding the actual item
      // works)
      try {
        var addedUpdate = JSON.stringify( this.cacheAdded );

        localStorage.setItem( 'cache_added_' + this.bucket, addedUpdate );
      } catch ( err ) {
        console.error( 'Unable to save cache added array: ', err );
      }
    } catch ( err ) {
      console.error( 'Unable to save cache bucket: ', err );
    }
  },

  /**
   * Make sure localStorage is not full and clear junk out if it is.  Will
   * remove oldest added item if necessary to make room for new incoming item.
   */
  clearCacheSpace: function () {
    // First check the cache size.  This is based on the fact that localStorage
    // stores approximately 2.5 million UTF-16 characters.
    var used = ( JSON.stringify( localStorage ).length / 2500000 );

    if ( used >= 1 ) {
      // Blam the oldest item in the added queue.
      var key = this.cacheAdded.shift();

      if ( key ) {
        delete this.cache[ key ];

        // And save the updated cache
        this.saveCache();
      }
    }
  },

  /**
   * Flush the cache completely.  Kills both the cache itself as well as the
   * added array.
   */
  flush: function () {
    localStorage.removeItem( 'cache_' + this.bucket );
    localStorage.removeItem( 'cache_added_' + this.bucket );
  }
});
