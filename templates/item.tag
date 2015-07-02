<item>
  <section class="item  { loaded ? '--loaded': null }">
    <h2>It's an item! ID: { item.basic.raw.name }</h2>

    <basic-info item={ item }></basic-info>
  </section>

  // Load the item
  App
    .services
    .items
    .get( opts.id )
    .then( (function ( item ) {
      this.item   = item;
      this.loaded = true;
      console.log( item );

      this.update();
    }).bind( this ));
</item>
