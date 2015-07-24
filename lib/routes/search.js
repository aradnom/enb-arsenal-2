/**
 * Search the database by passed properties.
 */

var Promise = require( 'bluebird' );

/**
 * Search the database (Items, Mobs or Vendors).
 *
 * @param {Object} db     Active MongoDB database connection object
 * @param {String} type   Type of object to retrieve: 'item', 'mob' or 'vendor'
 * @param {String} query  Object of properties to search
 *
 * @return {Object} Returns promise with results or error
 */
module.exports = function ( db, type, query ) {
  var deferred = Promise.defer();

  // Plurals, man
  type += 's';

  // Put together query object based on passed search properties
  var databaseQuery = formatSearchQuery( type, query );

  // If no query was returned, something went wrong
  if ( ! databaseQuery ) {
    return Promise.reject( 'queryError' );
  }

  // Make the search request
  db.collection( type )
    .find( databaseQuery )
    .toArray( function ( err, result ) {
      if ( err ) {
        return deferred.reject( err );
      }

      return deferred.resolve( result );
    });

  return deferred.promise;
};

///////////////////////////////////////////////////////////////////////////////
// Internal functions /////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

/**
 * Given an object type and a set of search properties, create proper query
 * object for searching the database.
 *
 * @param {String} type   Object type to search
 * @param {Object} query  Object of search properties
 *
 * @return {Object} Returns database query object ready to pass through database
 */
function formatSearchQuery ( type, query ) {
  switch ( type ) {
    case 'items':   return formatItemQuery( query ); break;
    case 'mobs':    return formatMobQuery( query ); break;
    case 'vendors': return formatVendorQuery( query ); break;
  }

  // If we got this far something went wrong
  return null;
}

/**
 * Return formatted database query object for item search.
 *
 * @param {Object} query Object of search properties
 *
 * @return {Object} Return database query object for item search
 */
function formatItemQuery ( query ) {
  var databaseQuery = { $and: [] };

  // Start throwing junk in the query trunk
  if ( query.name || query.description ) {
    databaseQuery[ '$and' ].push( { $text: { $search: query.name || query.description } } );
  }

  if ( query.level ) {
    databaseQuery[ '$and' ].push( { level: query.level } );
  }

  if ( query.type ) {
    databaseQuery[ '$and' ].push( { item_type: query.type } );
  }

  if ( query.manufacturer ) {
    databaseQuery[ '$and' ].push( { manufacturer: query.manufacturer } );
  }

  if ( query.race ) {
    databaseQuery[ '$and' ].push( { 'restrictions.raw.rest_race': query.race } );
  }

  if ( query.profession ) {
    databaseQuery[ '$and' ].push( { 'restrictions.raw.rest_prof': query.profession } );
  }

  if ( query.effects ) {
    var pattern = new RegExp( query.effects, 'i' );

    databaseQuery[ '$and' ].push({
      effects: { $elemMatch: {
        $or: [{ stats: pattern }, { description: pattern }]
      }}
    });
  }

  return databaseQuery;
}

/**
 * Return formatted database query object for mob search.
 *
 * @param {Object} query Object of search properties
 *
 * @return {Object} Return database query object for mob search
 */
function formatMobQuery ( query ) {
  var databaseQuery = { $and: [] };

  // Start throwing junk in the query trunk
  if ( query.name ) {
    databaseQuery[ '$and' ].push( { $text: { $search: query.name } } );
  }

  if ( query.location ) {
    databaseQuery[ '$and' ].push( { locations: query.location } );
  }

  if ( query.level ) {
    databaseQuery[ '$and' ].push( { level: query.level } );
  }

  if ( query.faction ) {
    databaseQuery[ '$and' ].push( { faction_id: query.faction } );
  }

  return databaseQuery;
}

/**
 * Return formatted database query object for vendor search.
 *
 * @param {Object} query Object of search properties
 *
 * @return {Object} Return database query object for vendor search
 */
function formatVendorQuery ( query ) {
  var databaseQuery = { $and: [] };

  // Start throwing junk in the query trunk
  if ( query.name ) {
    databaseQuery[ '$and' ].push( { $text: { $search: query.name } } );
  }

  if ( query.location ) {
    var pattern = new RegExp( query.location, 'i' );

    databaseQuery[ '$and' ].push( { $or: [ { name: pattern }, { sec_name: pattern } ] } );
  }

  if ( query.level ) {
    databaseQuery[ '$and' ].push( { level: query.level } );
  }

  return databaseQuery;
}
