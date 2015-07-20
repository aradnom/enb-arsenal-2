var Router = require( './models/router' );

// Load new router object into the main app object
var appRouter = new Router();

// 404 route - should be at the top as the catch-all
appRouter.route( '*notFound', 'pageNotFound', function () {
  this.renderRouteComponents();
});

// Home page - aka empty route
appRouter.route( '', 'home', function () {
  this.renderRouteComponents([
    { tag: 'search' }
  ]);
});

// Items
appRouter.route( 'item/:slug', 'item', function ( slug ) {
  this.renderRouteComponents([
    { tag: 'search' },
    { tag: 'item', args: { slug: slug } }
  ]);
});

// Mobs
appRouter.route( 'mob/:slug', 'mob', function ( slug ) {
  this.renderRouteComponents([
    { tag: 'search' },
    { tag: 'mob', args: { slug: slug } }
  ]);
});

// Vendors
appRouter.route( 'vendor/:slug', 'vendor', function ( slug ) {
  this.renderRouteComponents([
    { tag: 'search' },
    { tag: 'vendor', args: { slug: slug } }
  ]);
});

// Start the music
Backbone.history.start();

// Return the router object
module.exports = appRouter;
