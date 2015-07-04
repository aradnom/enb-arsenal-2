App.models.Search = Backbone.Model.extend({

  initialize: function () {
    // Pull in the search index data
    $.getJSON( '/assets/json/search.json.gz', (function ( data ) {
      // And build the index
      this.buildIndices( data );
    }).bind( this ));
  },

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
  }

});
