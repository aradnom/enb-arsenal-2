<mob>
  <section class="mob  { loaded ? '--loaded': null }">
    <h2>{ mob.name }</h2>

    <ul class="meta-info">
      <li class="--em" if={ mob.locations && mob.locations.length }>{ mob.locations.join( ', ' ) }</li>
      <li if={ mob.level }>level { mob.level }</li>
    </ul>

    <ul class="listing" if={ mob.items && mob.items.length }>
      <li each={ mob.items }>
        <div class="listing__image" if={ filename }>
          <img riot-src={ '/assets/img/icons/png/' + filename } border="0" />
        </div>

        <a href="#item/{ slug }"><h3 class="heading4  listing__title">{ name }</h3></a>

        <ul class="listing__properties">
          <li if={ type_name }>{ type_name }</li>
          <li if={ level }>{ level }</li>
          <li if={ manu_name }>{ manu_name }</li>
          <li if={ drop_chance }>{ drop_chance }</li>
          <li if={ no_manu }>Non-manufacturable</li>
          <li class="--block" if={ description }>{ description }</li>
        </ul>
      </li>
    </ul>
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
