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

  this.renderRouteComponents([
    { tag: 'mini-search' },
    { tag: 'item', args: { id: id } }
  ]);
});

// Mobs
App.router.route( 'mob/:slug', 'mob', function ( slug ) {
  // Split the ID out from the slug
  var id = slug.split( '-' )[ 0 ];

  this.renderRouteComponents([
    { tag: 'mini-search' },
    { tag: 'mob', args: { id: id } }
  ]);
});

// Vendors
App.router.route( 'vendor/:slug', 'vendor', function ( slug ) {
  // Split the ID out from the slug
  var id = slug.split( '-' )[ 0 ];

  this.renderRouteComponents([
    { tag: 'mini-search' },
    { tag: 'vendor', args: { id: id } }
  ]);
});

// Start the music
Backbone.history.start();
