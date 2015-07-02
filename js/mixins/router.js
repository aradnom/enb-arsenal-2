// Create new observable for watching route changes
var Router = riot.observable();

// Process routes on both route change and initial load
riot.route( processRoute );
riot.route.exec( processRoute );

// Expose the Router object
riot.mixin( 'Router', Router );

/**
 * Handle a route change (on route update or initial load)
 *
 * @param {String} Requested route
 */
function processRoute ( route ) {
  Router.trigger( 'routeChanged' );

  if ( route ) {
    riot.mount( route );
  } else {
    console.log( riot.mount( '*' ) );
  }
}

function getTagNames () {
  var scripts = document.querySelectorAll( 'script[type="riot/tag"]' );
  var names   = /([a-zA-Z0-9\|\-\_\~\+\.]+)\.(tag|html)/;

  if ( scripts.length ) {
    var tags = [].map.call( scripts, function ( tag ) {
      var src = tag.getAttribute( 'src' );

      if ( ! src ) { return null; }

      var matches = names.exec( src );

      if ( ! matches ) { return null; }

      return matches[ 1 ];
    });

    return tags;
  }
}
