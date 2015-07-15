App.models.Router = Backbone.Router.extend({

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

    // Set the content nodes
    $content.html( nodes );

    // Then mount individually so separate args can be passed
    components.forEach( function ( component ) {
      riot.mount( component.tag, component.args );
    });
  }

});
