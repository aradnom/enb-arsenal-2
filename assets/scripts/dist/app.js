(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Create blanket app object to be populated with all of our App Junk.  This
// isn't needed for app functionality (Browserify takes care of all of that),
// it's just a handy debugging thing
'use strict';

window.App = {
  config: require('./services/config'),
  models: {
    cache: require('./models/cache'),
    config: require('./models/config'),
    datastore: require('./models/datastore'),
    router: require('./models/router'),
    search: require('./models/search'),
    utility: require('./models/utility')
  },
  services: {
    items: require('./services/items'),
    mobs: require('./services/mobs'),
    search: require('./services/search'),
    utility: require('./services/utility'),
    vendors: require('./services/vendors')
  },

  // Populated as tags are mounted
  tags: {},

  // Will contain the Packery grid when grid is populated
  itemGrid: null,

  // Populated with volatile view data (view state that gets destroyed when the
  // view changes)
  state: {},

  // The main router populates everything for the app routes
  router: require('./router.js')
};

},{"./models/cache":2,"./models/config":3,"./models/datastore":4,"./models/router":5,"./models/search":6,"./models/utility":7,"./router.js":8,"./services/config":9,"./services/items":10,"./services/mobs":11,"./services/search":12,"./services/utility":13,"./services/vendors":14}],2:[function(require,module,exports){
'use strict';

module.exports = Backbone.Model.extend({
  initialize: function initialize(bucket) {
    this.bucket = bucket;

    // Populate/create initial cache bucket
    var cache = localStorage.getItem('cache_' + bucket);

    // Likewise with internal added array (keeps track of when items were added
    // to the cache)
    var added = localStorage.getItem('cache_added_' + bucket);

    try {
      this.cache = JSON.parse(cache);
    } catch (err) {
      console.error('Error parsing cache bucket: ', err);
    }

    try {
      this.cacheAdded = JSON.parse(added);
    } catch (err) {
      console.error('Error parsing cache added array: ', err);
    }

    // If it doesn't exist, create a blank object (but don't bother storing it
    // yet until something is actually pushed to it)
    if (!this.cache) {
      this.cache = {};
    }
    if (!this.cacheAdded) {
      this.cacheAdded = [];
    }
  },

  /**
   * Retrieve the entire bucket.
   *
   * @return {Object} Returns the entire cache bucket
   */
  getAll: function getAll() {
    return this.cache;
  },

  /**
   * Attempt to retrieve a value from the bucket based on a specific key.
   *
   * @param {String} key Key to search cache for
   *
   * @return {Mixed} Returns cached value if found or null
   */
  getValue: function getValue(key) {
    return this.cache[key];
  },

  /**
   * Set a new cache value based on a specific key and persist it to local
   * storage.
   *
   * @param {String} key   Key to set new value under
   * @param {Mixed} value Value to set with key
   */
  setValue: function setValue(key, value) {
    // First thing, check if there's room in the cache.  If there's not, remove
    // the oldest item added to make room, then proceed.
    this.clearCacheSpace();

    // Then move on to adding this item
    this.cache[key] = value;
    this.cacheAdded.push(key);

    // Then save the current cache
    this.saveCache();
  },

  /**
   * Save the current cache contents (persist the contents to localStorage).
   */
  saveCache: function saveCache() {
    try {
      var update = JSON.stringify(this.cache);

      // Save the current version of the cache
      localStorage.setItem('cache_' + this.bucket, update);

      // Update the added array as well (but only if adding the actual item
      // works)
      try {
        var addedUpdate = JSON.stringify(this.cacheAdded);

        localStorage.setItem('cache_added_' + this.bucket, addedUpdate);
      } catch (err) {
        console.error('Unable to save cache added array: ', err);
      }
    } catch (err) {
      console.error('Unable to save cache bucket: ', err);
    }
  },

  /**
   * Make sure localStorage is not full and clear junk out if it is.  Will
   * remove oldest added item if necessary to make room for new incoming item.
   */
  clearCacheSpace: function clearCacheSpace() {
    // First check the cache size.  This is based on the fact that localStorage
    // stores approximately 2.5 million UTF-16 characters.
    var used = JSON.stringify(localStorage).length / 2500000;

    if (used >= 1) {
      // Blam the oldest item in the added queue.
      var key = this.cacheAdded.shift();

      if (key) {
        delete this.cache[key];

        // And save the updated cache
        this.saveCache();
      }
    }
  },

  /**
   * Flush the cache completely.  Kills both the cache itself as well as the
   * added array.
   */
  flush: function flush() {
    localStorage.removeItem('cache_' + this.bucket);
    localStorage.removeItem('cache_added_' + this.bucket);
  }
});

},{}],3:[function(require,module,exports){
"use strict";

module.exports = Backbone.Model.extend({
  initialize: function initialize(config) {
    // Save each passed config property into the local object context
    Object.keys(config).forEach((function (key) {
      this[key] = config[key];
    }).bind(this));
  }
});

},{}],4:[function(require,module,exports){
'use strict';

var Cache = require('./cache');
var config = require('../services/config');

module.exports = Backbone.Model.extend({
  initialize: function initialize(type) {
    // Save the type for use later
    this.type = type;

    // Create new cache object for the type as well
    this.cache = new Cache(type);
  },

  /**
   * Retrieve a single record from the database based on id.
   *
   * @param {Integer} id ID of record to retrieve
   *
   * @return {Object} Returns promise containing record or error
   */
  get: function get(id) {
    var deferred = Promise.defer();

    if (!id) {
      return deferred.reject('invalidParams');
    }

    // Attempt to pull the object from the cache
    var cached = this.cache.getValue(id);

    if (cached) {
      // Hurray, return immediately
      deferred.resolve(cached);
    } else {
      // Fine, make fresh request for it
      $.getJSON('/get/' + this.type + '/' + id, (function (result) {
        if (result && result.success) {
          // Set item in the cache
          this.cache.setValue(id, result.result);

          // And back we go
          return deferred.resolve(result.result);
        } else {
          return deferred.reject();
        }
      }).bind(this));
    }

    return deferred.promise;
  }
});

},{"../services/config":9,"./cache":2}],5:[function(require,module,exports){
'use strict';

module.exports = Backbone.Router.extend({

  renderRouteComponents: function renderRouteComponents(components) {
    var $content = $('article.main-content');

    // If no components were passed just empty the content
    if (!components || !components.length) {
      return $content.empty();
    }

    // Build nodes for components in one go so they can be set all at once
    var nodes = components.map(function (component) {
      return $('<' + component.tag + '/>')[0];
    });

    // Do a bit of cleanup before mounting the route's tags
    if (typeof App !== 'undefined') {
      Object.keys(App.tags).forEach(function (key) {
        App.tags[key].unmount();

        delete App.tags[key];
      });
    }

    // Set the content nodes
    $content.html(nodes);

    // Wait for riot compiler to finish before mounting tags
    riot.compile(function () {
      // Then mount individually so separate args can be passed
      components.forEach(function (component) {
        var instance = riot.mount(component.tag, component.args);

        // Save the created tag to the tag object for referencing later (events)
        App.tags[component.tag] = instance[0];
      });
    });
  }

});

},{}],6:[function(require,module,exports){
'use strict';

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
  search: function search(type, query) {
    var deferred = Promise.defer();

    $.getJSON('/search/' + type, { query: query }, function (result) {
      if (result && result.success) {
        return deferred.resolve(result.result);
      } else {
        return deferred.reject();
      }
    });

    return deferred.promise;
  }

});

},{}],7:[function(require,module,exports){
'use strict';

module.exports = Backbone.Model.extend({
  /**
   * Via: https://github.com/ded/domready
   */
  DomReady: function DomReady() {
    var fns = [],
        listener,
        doc = document,
        hack = doc.documentElement.doScroll,
        domContentLoaded = 'DOMContentLoaded',
        loaded = (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(doc.readyState);

    if (!loaded) doc.addEventListener(domContentLoaded, listener = function () {
      doc.removeEventListener(domContentLoaded, listener);
      loaded = 1;
      while (listener = fns.shift()) listener();
    });

    return function (fn) {
      loaded ? setTimeout(fn, 0) : fns.push(fn);
    };
  }
});

},{}],8:[function(require,module,exports){
'use strict';

var Router = require('./models/router');

// Load new router object into the main app object
var appRouter = new Router();

// 404 route - should be at the top as the catch-all
appRouter.route('*notFound', 'pageNotFound', function () {
  this.renderRouteComponents();
});

// Home page - aka empty route
appRouter.route('', 'home', function () {
  this.renderRouteComponents([{ tag: 'search' }, { tag: 'item-grid' }]);
});

// Items
appRouter.route('item/:slug', 'item', function (slug) {
  this.renderRouteComponents([{ tag: 'search' }, { tag: 'item', args: { slug: slug } }]);
});

// Mobs
appRouter.route('mob/:slug', 'mob', function (slug) {
  this.renderRouteComponents([{ tag: 'search' }, { tag: 'mob', args: { slug: slug } }]);
});

// Vendors
appRouter.route('vendor/:slug', 'vendor', function (slug) {
  this.renderRouteComponents([{ tag: 'search' }, { tag: 'vendor', args: { slug: slug } }]);
});

// Start the music
Backbone.history.start();

// Return the router object
module.exports = appRouter;

},{"./models/router":5}],9:[function(require,module,exports){
'use strict';

var Config = require('../models/config');

// Build config objects as needed
module.exports = {};

},{"../models/config":3}],10:[function(require,module,exports){
'use strict';

var DataStore = require('../models/datastore');

module.exports = new DataStore('item');

},{"../models/datastore":4}],11:[function(require,module,exports){
'use strict';

var DataStore = require('../models/datastore');

module.exports = new DataStore('mob');

},{"../models/datastore":4}],12:[function(require,module,exports){
'use strict';

var Search = require('../models/search');

module.exports = new Search();

},{"../models/search":6}],13:[function(require,module,exports){
'use strict';

var Utility = require('../models/utility');

module.exports = new Utility();

},{"../models/utility":7}],14:[function(require,module,exports){
'use strict';

var DataStore = require('../models/datastore');

module.exports = new DataStore('vendor');

},{"../models/datastore":4}]},{},[1]);
