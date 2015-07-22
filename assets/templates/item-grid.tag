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
      buildGrid();
    }
  }).bind( this ));

  this.on( 'mount', function () {
    // Reload any stored items
    if ( App.state.gridItems && App.state.gridItems.length ) {
      items = App.state.gridItems;

      this.update();

      // And reestablish the grid
      buildGrid();
    }
  });

  this.on( 'unmount', function () {
    // Save the current items into the app state for retrieval
    App.state.gridItems = items;

    // Destroy Packery on the way out
    if ( App.itemGrid ) {
      App.itemGrid.destroy();
    }
  });

  /////////////////////////////////////////////////////////////////////////////
  // Internal functions ///////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////

  function buildGrid () {
    App.itemGrid = new Packery( $( '.item-grid' )[ 0 ], {
      itemSelector: '.item-card',
      gutter: 10
    });
  }

</item-grid>
