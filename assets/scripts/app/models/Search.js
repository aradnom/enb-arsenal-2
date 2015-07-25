module.exports = Backbone.Model.extend({

  /**
   * Search items, mobs and vendors.
   * Item search properties:
   * name, level, type, manufacturer, race, profession, effects
   *
   * Mob search properties:
   * name, location, level, faction
   *
   * Vendor search properties:
   * name, location, level
   *
   * @param {String} type  Type of search: item, vendor or mob
   * @param {Object} query Query args for search
   *
   * @return {Object} Returns promise containing item results or error
   */
  search: function ( type, query ) {
    var deferred = Promise.defer();

    $.getJSON( '/search/' + type, { query: query }, function ( result ) {
      if ( result && result.success ) {
        return deferred.resolve( result.result );
      } else {
        return deferred.reject();
      }
    });

    return deferred.promise;
  }

});
