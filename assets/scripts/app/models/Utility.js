App.models.Utility = Backbone.Model.extend({
  /**
   * Via: https://github.com/ded/domready
   */
  DomReady: function () {
    var fns = [], listener
      , doc = document
      , hack = doc.documentElement.doScroll
      , domContentLoaded = 'DOMContentLoaded'
      , loaded = (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(doc.readyState)


    if (!loaded)
    doc.addEventListener(domContentLoaded, listener = function () {
      doc.removeEventListener(domContentLoaded, listener)
      loaded = 1
      while (listener = fns.shift()) listener()
    })

    return function (fn) {
      loaded ? setTimeout(fn, 0) : fns.push(fn)
    }
  }
});

// Initialize a copy of this for use immediately
App.services.utility = new App.models.Utility;
