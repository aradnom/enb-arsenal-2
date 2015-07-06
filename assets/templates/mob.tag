<mob>
  <section class="mob  { loaded ? '--loaded': null }">
    <h2>It's a mob! ID: { mob.name }</h2>
  </section>

  App.services.mobs
    .get( opts.id )
    .then( (function ( mob ) {
      this.mob    = mob;
      this.loaded = true;

      this.update();
    }).bind( this ))
    .catch( function ( err ) {
      console.error( err );
    });
</mob>
