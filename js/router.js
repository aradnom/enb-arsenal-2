var Router = Backbone.Router.extend({

  routes: {
    "":                     "home",
    "item/:id":             "item",
    "*notFound":            "notFound"
  },

  home: function () {
    renderRouteComponents();
  },

  item: function ( id ) {
    renderRouteComponents([
      { tag: 'mini-search' },
      { tag: 'item', args: { id: id } }
    ]);
  },

  notFound: function () {
    renderRouteComponents();
  }

});

// Load new router object into the main app object
App.router = new Router();

// Start the music
Backbone.history.start();

///////////////////////////////////////////////////////////////////////////////
// Internal functions /////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function renderRouteComponents ( components ) {
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
