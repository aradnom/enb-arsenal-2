<item-grid>
  <div class="item-grid">
    <item-card each={ items } data={ this }></item-card>
  </div>

  items = [];

  riot.observable( this );

  this.on( 'addItem', (function ( item ) {
    // Make sure the item is not already here and only add if it's not
    var existing = items.filter( function ( other ) {
      return other.id === item.id;
    });

    if ( ! existing.length ) {
      items.push( item );

      this.update();

      // Build the Packery grid again
      App.itemGrid = new Packery( $( '.item-grid' )[ 0 ], {
        itemSelector: '.item-card',
        gutter: 10
      });
    }
  }).bind( this ));

  this.on( 'unmount', function () {
    // Destroy Packery on the way out
    if ( App.itemGrid ) {
      App.itemGrid.destroy();
    }
  });

</item-grid>
