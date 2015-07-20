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
  initialize: function initialize(bucket) {
    // Set up base Firebase object for accessing specific bucket
    this.db = new Firebase(config.db.base + bucket);

    // Create new cache object for the bucket as well
    this.cache = new Cache(bucket);
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
      deferred.resolve(cached);
    } else {
      this.db.orderByChild('id').equalTo(id).limitToFirst(1).once('value', (function (snapshot) {
        var value = snapshot.val();

        if (value) {
          // Pop the first record out
          value = value[Object.keys(value)[0]];

          // Cache the item under the id
          this.cache.setValue(id, value);

          deferred.resolve(value);
        } else {
          deferred.reject('noResults');
        }
      }).bind(this), function (err) {
        deferred.reject(err.code);

        console.error('Error retrieving database object: ', err);
      });
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

    // Set the content nodes
    $content.html(nodes);

    // Wait for riot compiler to finish before mounting tags
    riot.compile(function () {
      // Then mount individually so separate args can be passed
      components.forEach(function (component) {
        riot.mount(component.tag, component.args);
      });
    });
  }

});

},{}],6:[function(require,module,exports){
'use strict';

module.exports = Backbone.Model.extend({

  initialize: function initialize() {
    // Pull in the search index data
    $.getJSON('/assets/json/search.json.gz', (function (data) {
      // Wait a wee bit before building the search index just to give all other
      // async requests a chance to fire first.
      // TODO: Tie this into an actual event
      setTimeout((function () {
        this.buildIndices(data);
      }).bind(this), 250);
    }).bind(this));
  },

  /**
   * Construct search indices for text values (name, description, effects) as
   * well as keyed objects for numeric values (level, race, profession).
   *
   * @param {Array} items Array of items from loaded search JSON
   */
  buildIndices: function buildIndices(items) {
    // Construct indices for the fields we're interested in
    // Text index for name/description field
    this.nameIndex = lunr(function () {
      this.field('n');
      this.field('d');

      this.ref('i');
    });

    // Text index for item effects
    this.effectsIndex = lunr(function () {
      this.field('e');

      this.ref('i');
    });

    // Object of level-keyed items
    this.levelIndex = {};

    // Object of race-keyed items
    this.raceIndex = {};

    // Object of profession-keyed items
    this.professionIndex = {};

    // And add items to everybody
    items.forEach((function (item) {
      // Text indices - add these into Lunr
      if (item.n || item.d) {
        this.nameIndex.add(item);
      }
      if (item.e) {
        this.effectsIndex.add(item);
      }

      // Objects (numerical values)
      if (item.l) {
        if (typeof this.levelIndex[item.l] === 'undefined') {
          this.levelIndex[item.l] = [];
        }

        this.levelIndex[item.l].push(item);
      }
      if (item.r) {
        if (typeof this.raceIndex[item.r] === 'undefined') {
          this.raceIndex[item.r] = [];
        }

        this.raceIndex[item.r].push(item);
      }
      if (item.p) {
        if (typeof this.professionIndex[item.p] === 'undefined') {
          this.professionIndex[item.p] = [];
        }

        this.professionIndex[item.p].push(item);
      }
    }).bind(this));

    console.info('Finished building search indices.');
  },

  /**
   * Search items. Items can be searched by: name (also includes description),
   * effects, level, race and profession.
   *
   * @return {Object} Returns promise containing item results or error
   */
  search: function search(query) {
    var items = require('../services/items');

    // Pull the IDs of matching items
    var ids = this.searchIndices(query);

    // If no results were returned, we're done
    if (!ids.length) {
      return Promise.reject('noResults');
    }

    // For each returned item ID, retrieve the actual item for the ID
    return Promise.all(ids.map(function (id) {
      return items.get(id);
    }));
  },

  /**
   * Search the loaded search indices.  Will return array of item IDs
   * (these are not the actual item, but contain the item ID for pulling actual
   * item results).
   *
   * @param {Object} query Object containing query params
   *
   * @return {Array} Returns array of matching item IDs
   */
  searchIndices: function searchIndices(query) {
    var intersectArrays = [];

    if (query.name) {
      var ids = this.nameIndex.search(query.name).map(function (item) {
        return item.ref;
      });

      intersectArrays.push(ids);
    }
    if (query.effects) {
      var ids = this.effectsIndex.search(query.name).map(function (item) {
        return item.ref;
      });

      intersectArrays.push(ids);
    }
    if (query.level) {
      var ids = this.levelIndex[query.level].map(function (item) {
        return item.i;
      });

      intersectArrays.push(ids);
    }
    if (query.race) {
      var ids = this.raceIndex[query.level].map(function (item) {
        return item.i;
      });

      intersectArrays.push(ids);
    }
    if (query.profession) {
      var ids = this.professionIndex[query.level].map(function (item) {
        return item.i;
      });

      intersectArrays.push(ids);
    }

    // If nothing was pushed, just leave
    if (!intersectArrays.length) {
      return [];
    }

    // If there's only one result array, just return that.  Otherwise,
    // intersect arrays to perform AND search operation.
    if (intersectArrays.length === 1) {
      return intersectArrays[0];
    } else {
      return this.arrayIntersect.apply(this, intersectArrays);
    }
  },

  /**
   * Return the intersection of passed arrays.
   * Via: https://gist.github.com/lovasoa/3361645
   *
   * @return {Array} Returns intersecting items
   */
  arrayIntersect: function arrayIntersect() {
    var i,
        all,
        shortest,
        nShortest,
        n,
        len,
        ret = [],
        obj = {},
        nOthers;
    nOthers = arguments.length - 1;
    nShortest = arguments[0].length;
    shortest = 0;
    for (i = 0; i <= nOthers; i++) {
      n = arguments[i].length;
      if (n < nShortest) {
        shortest = i;
        nShortest = n;
      }
    }

    for (i = 0; i <= nOthers; i++) {
      n = i === shortest ? 0 : i || shortest; //Read the shortest array first. Read the first array instead of the shortest
      len = arguments[n].length;
      for (var j = 0; j < len; j++) {
        var elem = arguments[n][j];
        if (obj[elem] === i - 1) {
          if (i === nOthers) {
            ret.push(elem);
            obj[elem] = 0;
          } else {
            obj[elem] = i;
          }
        } else if (i === 0) {
          obj[elem] = 0;
        }
      }
    }

    return ret;
  }

});

},{"../services/items":10}],7:[function(require,module,exports){
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
  this.renderRouteComponents([{ tag: 'search' }]);
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

// Database config
module.exports = {
  db: new Config({
    base: 'https://incandescent-torch-1326.firebaseio.com/'
  })
};

},{"../models/config":3}],10:[function(require,module,exports){
'use strict';

var DataStore = require('../models/datastore');

module.exports = new DataStore('items');

},{"../models/datastore":4}],11:[function(require,module,exports){
'use strict';

var DataStore = require('../models/datastore');

module.exports = new DataStore('mobs');

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

module.exports = new DataStore('vendors');

},{"../models/datastore":4}]},{},[1]);
