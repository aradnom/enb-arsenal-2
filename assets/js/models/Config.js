var Config = Backbone.Model.extend({
  initialize: function ( config ) {
    // Save each passed config property into the local object context
    Object.keys( config ).forEach( (function ( key ) {
      this[ key ] = config[ key ];
    }).bind( this ));
  }
});

// Database config
App.config.db = new Config({
  base: 'https://incandescent-torch-1326.firebaseio.com/'
});
