// General utility functions
var Utility = require( './lib/utility' );

// Pull in the app config
var config  = require( './lib/config' );

// Set up app-wide logger
var logger  = require( './lib/logger' );

// Attempt to create database connection - if we can't connect don't bother
// doing anything else
var dbConnect = require( './lib/db' );
var db;

// Build the Express app
var Express     = require( 'express' );
var Compression = require( 'compression' );
var BodyParser  = require( 'body-parser' );
var Ejs         = require( 'ejs' );
var app         = Express();

// Set the app up
app.use( Compression() );
app.use( BodyParser.json() );
app.use( '/assets', Express.static( __dirname + '/assets' ));
app.use( '/favicon.ico', Express.static( __dirname + '/favicon.ico' ));
app.set( 'views', __dirname + '/views' );
app.engine( 'html', Ejs.renderFile );

// Pull in route controllers
var apiGet    = require( './lib/routes/get' );
var apiSearch = require( './lib/routes/search' );

// First attempt database connection
dbConnect
  .then( function ( _db ) {
    db = _db;

    ///////////////////////////////////////////////////////////////////////////////
    // Routes /////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////

    // Home
    app.get( '/', function ( req, res ) {
      res.render( 'index.html' );
    });

    // Get object (Item, Vendor or Mob)
    app.all( '/get/:type/:id', function( req, res ) {
      var id   = req.params.id;
      var type = req.params.type;

      // If type isn't valid, we out
      if ( type !== 'item' && type !== 'mob' && type !== 'vendor' ) {
        return res.status( 404 ).jsonp({ error: 'Nothin\' there, chief.', errorCode: 'pageNotFound' });
      }

      // Retrieve the specified item
      apiGet( db, type, id )
        .then( function ( result ) {
          return res.jsonp({ success: true, result: result });
        })
        .catch( function ( err ) {
          logger.error( 'Error fetching database object: ', err );

          return res.jsonp({ error: 'Error fetching object', errorCode: 'databaseError' });
        });
    });

    // Search the database
    app.all( '/search/:type', function( req, res ) {
      var type  = req.params.type;
      var query = Utility.getRequestValue( 'query', req );

      // If type isn't valid, we out
      if ( type !== 'item' && type !== 'mob' && type !== 'vendor' ) {
        return res.status( 404 ).jsonp({ error: 'Nothin\' there, chief.', errorCode: 'pageNotFound' });
      }

      // If query wasn't passed, we also out
      if ( ! query ) {
        return res.jsonp({ error: 'Must pass valid search query to search.', errorCode: 'invalidParams' });
      }

      apiSearch( db, type, query )
        .then( function ( result ) {
          return res.jsonp({ success: true, result: result });
        })
        .catch( function ( err ) {
          logger.error( 'Error fetching database object: ', err );

          return res.jsonp({ error: 'Error fetching object', errorCode: 'databaseError' });
        });
    });

    // FOUR OH FOUR
    app.get( '*', function( req, res ) {
      return res.status( 404 ).jsonp({ error: 'Nothin\' there, chief.', errorCode: 'pageNotFound' });
    });

    ///////////////////////////////////////////////////////////////////////////////
    // Away we go /////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////

    // Then if that went well, start the app
    app.listen( config.port, function () {
      logger.info( 'API server active.', { port: config.port } );
    });
  })
  .catch( function ( err ) {
    logger.error( 'Unable to establish database connection.', err );
  });

///////////////////////////////////////////////////////////////////////////////
// Exit ///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

// Prevents node from existing instantly by starting to read stdInput
process.stdin.resume();

// Interrupt signal (Ctrl+C)
process.on( 'SIGINT', cleanup );

///////////////////////////////////////////////////////////////////////////////
// Internal functions /////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function cleanup () {
  // Close the database connection
  if ( db && typeof( db.close ) === 'function' ) {
    db.close();
  }

  logger.info( 'Exiting...' );

  process.exit();
}
