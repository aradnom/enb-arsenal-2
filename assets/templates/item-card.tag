<item-card>
  <div class="item-card { expanded ? '--expanded' : '' }">
    <button onclick={ expand }>expand</button>

    <a href="#/item/{ slug }">View Item</a>

    <h3>{ name }</h3>

    <div if={ image } class="item-card__image">
      <img riot-src={ '/assets/visual/icons/png/' + image } border="0" />
    </div>

    <p>{ description }</p>
  </div>

  /////////////////////////////////////////////////////////////////////////////
  // Scripts //////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////

  expand = function ( event ) {
    event.item.expanded = true;

    setTimeout( function () {
      // Fit the item to the grid
      var card = $( event.target ).parent( '.item-card' )[ 0 ];

      App.itemGrid.fit( card, 0, 0 );
    });
  }

</item-card>
