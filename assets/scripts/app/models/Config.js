var Backbone = require( '../../node_modules/backbone/backbone-min' );

module.exports = Backbone.Model.extend({
  initialize: function ( config ) {
    // Save each passed config property into the local object context
    Object.keys( config ).forEach( (function ( key ) {
      this[ key ] = config[ key ];
    }).bind( this ));
  }
});
