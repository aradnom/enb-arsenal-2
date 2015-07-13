// Load new router object into the main app object
App.router = new App.models.Router();

// 404 route - should be at the top as the catch-all
App.router.route( '*notFound', 'pageNotFound', function () {
  console.log( '404' );
  this.renderRouteComponents();
});

// Home page - aka empty route
App.router.route( '', 'home', function () {
  this.renderRouteComponents();
});

// Items
App.router.route( 'item/:slug', 'item', function ( slug ) {
  // Split the ID out from the slug
  var id = slug.split( '-' )[ 0 ];

  // Load the item
  App.services.items.get( id )
    .then( (function ( item ) {
      // And render the route
      this.renderRouteComponents([
        { tag: 'search' },
        { tag: 'item', args: { item: item } }
      ]);
    }).bind( this ))
    .catch( function ( err ) {
      console.error( 'Unable to retrieve item: ', err );
    });
});

// Mobs
App.router.route( 'mob/:slug', 'mob', function ( slug ) {
  // Split the ID out from the slug
  var id = slug.split( '-' )[ 0 ];

  // Load the mob in
  App.services.mobs
    .get( id )
    .then( (function ( mob ) {
      // And render the route's components
      this.renderRouteComponents([
        { tag: 'search' },
        { tag: 'mob', args: { mob: mob } }
      ]);
    }).bind( this ))
    .catch( function ( err ) {
      console.error( 'Unable to retrieve mob: ', err );
    });
});

// Vendors
App.router.route( 'vendor/:slug', 'vendor', function ( slug ) {
  // Split the ID out from the slug
  var id = slug.split( '-' )[ 0 ];

  // Load the vendor in
  App.services.vendors
    .get( id )
    .then( (function ( vendor ) {
      this.renderRouteComponents([
        { tag: 'search' },
        { tag: 'vendor', args: { vendor: vendor } }
      ]);
    }).bind( this ))
    .catch( function ( err ) {
      console.error( 'Unable to retrieve vendor: ', err );
    });
});

// Start the music
Backbone.history.start();
