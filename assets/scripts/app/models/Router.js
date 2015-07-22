module.exports = Backbone.Router.extend({

  renderRouteComponents: function ( components ) {
    var $content = $( 'article.main-content' );

    // If no components were passed just empty the content
    if ( ! components || ! components.length ) {
      return $content.empty();
    }

    // Build nodes for components in one go so they can be set all at once
    var nodes = components.map( function ( component ) {
      return $( '<' + component.tag + '/>' )[ 0 ];
    });

    // Do a bit of cleanup before mounting the route's tags
    if ( typeof( App ) !== 'undefined' ) {
      Object.keys( App.tags ).forEach( function ( key ) {
        App.tags[ key ].unmount();

        delete App.tags[ key ];
      });
    }

    // Set the content nodes
    $content.html( nodes );

    // Wait for riot compiler to finish before mounting tags
    riot.compile( function() {
      // Then mount individually so separate args can be passed
      components.forEach( function ( component ) {
        var instance = riot.mount( component.tag, component.args );

        // Save the created tag to the tag object for referencing later (events)
        App.tags[ component.tag ] = instance[ 0 ];
      });
    });
  }

});
