// Create blanket app object to be populated with all of our App Junk.  This
// isn't needed for app functionality (Browserify takes care of all of that),
// it's just a handy debugging thing
window.App = {
  config: require( './services/config' ),
  models: {
    cache:     require( './models/cache' ),
    config:    require( './models/config' ),
    datastore: require( './models/datastore' ),
    router:    require( './models/router' ),
    search:    require( './models/search' ),
    utility:   require( './models/utility' )
  },
  services: {
    items:   require( './services/items' ),
    mobs:    require( './services/mobs' ),
    search:  require( './services/search' ),
    utility: require( './services/utility' ),
    vendors: require( './services/vendors' )
  },

  // Populated as tags are mounted
  tags: {},

  // Will contain the Packery grid when grid is populated
  itemGrid: null,

  // The main router populates everything for the app routes
  router: require( './router.js' )
};
