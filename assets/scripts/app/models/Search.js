module.exports = Backbone.Model.extend({

  initialize: function () {
    // Pull in the search index data
    $.getJSON( '/assets/json/search.json.gz', (function ( data ) {
      // Wait a wee bit before building the search index just to give all other
      // async requests a chance to fire first.
      // TODO: Tie this into an actual event
      setTimeout( (function () {
        this.buildIndices( data );
      }).bind( this ), 250 );
    }).bind( this ));
  },

  /**
   * Construct search indices for text values (name, description, effects) as
   * well as keyed objects for numeric values (level, race, profession).
   *
   * @param {Array} items Array of items from loaded search JSON
   */
  buildIndices: function ( items ) {
    // Construct indices for the fields we're interested in
    // Text index for name/description field
    this.nameIndex = lunr( function () {
      this.field( 'n' );
      this.field( 'd' );

      this.ref( 'i' );
    });

    // Text index for item effects
    this.effectsIndex = lunr( function () {
      this.field( 'e' );

      this.ref( 'i' );
    });

    // Object of level-keyed items
    this.levelIndex = {};

    // Object of race-keyed items
    this.raceIndex = {};

    // Object of profession-keyed items
    this.professionIndex = {};

    // And add items to everybody
    items.forEach( (function ( item ) {
      // Text indices - add these into Lunr
      if ( item.n || item.d ) {
        this.nameIndex.add( item );
      }
      if ( item.e ) {
        this.effectsIndex.add( item );
      }

      // Objects (numerical values)
      if ( item.l ) {
        if ( typeof( this.levelIndex[ item.l ] ) === 'undefined' ) {
          this.levelIndex[ item.l ] = [];
        }

        this.levelIndex[ item.l ].push( item );
      }
      if ( item.r ) {
        if ( typeof( this.raceIndex[ item.r ] ) === 'undefined' ) {
          this.raceIndex[ item.r ] = [];
        }

        this.raceIndex[ item.r ].push( item );
      }
      if ( item.p ) {
        if ( typeof( this.professionIndex[ item.p ] ) === 'undefined' ) {
          this.professionIndex[ item.p ] = [];
        }

        this.professionIndex[ item.p ].push( item );
      }
    }).bind( this ));

    console.info( 'Finished building search indices.' );
  },

  /**
   * Search items. Items can be searched by: name (also includes description),
   * effects, level, race and profession.
   *
   * @return {Object} Returns promise containing item results or error
   */
  search: function ( query ) {
    var items = require( '../services/items' );

    // Pull the IDs of matching items
    var ids = this.searchIndices( query );

    // If no results were returned, just send that back
    if ( ! ids.length ) { return ids; }

    // For each returned item ID, retrieve the actual item for the ID
    return Promise.all( ids.map( function ( id ) {
      return items.get( id );
    }));
  },

  /**
   * Search the loaded search indices.  Will return array of item IDs
   * (these are not the actual item, but contain the item ID for pulling actual
   * item results).
   *
   * @param {Object} query Object containing query params
   *
   * @return {Array} Returns array of matching item IDs
   */
  searchIndices: function ( query ) {
    var intersectArrays  = [];

    if ( query.name ) {
      var ids = this.nameIndex.search( query.name ).map( function ( item ) {
        return item.ref;
      });

      intersectArrays.push( ids );
    }
    if ( query.effects ) {
      var ids = this.effectsIndex.search( query.name ).map( function ( item ) {
        return item.ref;
      });

      intersectArrays.push( ids );
    }
    if ( query.level ) {
      var ids = this.levelIndex[ query.level ].map( function ( item ) {
        return item.i;
      });

      intersectArrays.push( ids );
    }
    if ( query.race ) {
      var ids = this.raceIndex[ query.level ].map( function ( item ) {
        return item.i;
      });

      intersectArrays.push( ids );
    }
    if ( query.profession ) {
      var ids = this.professionIndex[ query.level ].map( function ( item ) {
        return item.i;
      });

      intersectArrays.push( ids );
    }

    // If nothing was pushed, just leave
    if ( ! intersectArrays.length ) { return []; }

    // If there's only one result array, just return that.  Otherwise,
    // intersect arrays to perform AND search operation.
    if ( intersectArrays.length === 1 ) {
      return intersectArrays[ 0 ];
    } else {
      return this.arrayIntersect.apply( this, intersectArrays );
    }
  },

  /**
   * Return the intersection of passed arrays.
   * Via: https://gist.github.com/lovasoa/3361645
   *
   * @return {Array} Returns intersecting items
   */
  arrayIntersect: function () {
    var i, all, shortest, nShortest, n, len, ret = [], obj={}, nOthers;
    nOthers   = arguments.length-1;
    nShortest = arguments[ 0 ].length;
    shortest  = 0;
    for ( i = 0; i <= nOthers; i++ ) {
      n = arguments[ i ].length;
      if ( n < nShortest ) {
        shortest  = i;
        nShortest = n;
      }
    }

    for ( i = 0; i <= nOthers; i++ ) {
      n   = ( i === shortest ) ? 0 : ( i || shortest ); //Read the shortest array first. Read the first array instead of the shortest
      len = arguments[ n ].length;
      for ( var j = 0; j < len; j++ ) {
          var elem = arguments[ n ][ j ];
          if ( obj[ elem ] === i - 1 ) {
            if ( i === nOthers ) {
              ret.push( elem );
              obj[ elem ] = 0;
            } else {
              obj[ elem ] = i;
            }
          } else if ( i === 0 ) {
            obj[ elem ] = 0;
          }
      }
    }

    return ret;
  }

});
