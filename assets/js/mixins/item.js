var items = [];

var Item = {
  set: function ( value ) {
    items.push( value );
  },

  get: function () {
    return items;
  }
};

riot.mixin( 'Item', Item );
