<item>
  <section class="item  { loaded ? '--loaded': null }">
    <h2>It's an item! ID: { item.basic.raw.name }</h2>

    <basic-info item={ item }></basic-info>
  </section>

  // Split the ID out from the slug
  var segments = opts.slug.split( '-' );
  var id       = segments[ segments.length - 1 ];
  App.services.items
    .get( id )
    .then( (function ( item ) {
      this.item   = item;
      this.loaded = true;

      this.update();
    }).bind( this ))
    .catch( function ( err ) {
      console.error( err );
    });
</item>
