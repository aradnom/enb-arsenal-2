var Router = require( './models/router' );

// Load new router object into the main app object
var appRouter = new Router();

// 404 route - should be at the top as the catch-all
appRouter.route( '*notFound', 'pageNotFound', function () {
  console.log( '404' );
  this.renderRouteComponents();
});

// Home page - aka empty route
appRouter.route( '', 'home', function () {
  this.renderRouteComponents();
});

// Items
appRouter.route( 'item/:slug', 'item', function ( slug ) {
  var items = require( './services/items' );

  // Split the ID out from the slug
  var id = slug.split( '-' )[ 0 ];

  // Load the item
  items.get( id )
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
appRouter.route( 'mob/:slug', 'mob', function ( slug ) {
  var mobs = require( './services/mobs' );

  // Split the ID out from the slug
  var id = slug.split( '-' )[ 0 ];

  // Load the mob in
  mobs
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
appRouter.route( 'vendor/:slug', 'vendor', function ( slug ) {
  var vendors = require( './services/vendors' );

  // Split the ID out from the slug
  var id = slug.split( '-' )[ 0 ];

  // Load the vendor in
  vendors
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

// Return the router object
module.exports = appRouter;
