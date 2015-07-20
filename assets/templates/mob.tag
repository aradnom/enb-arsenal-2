<mob>
  <section class="mob">
    <h2>{ mob.name }</h2>

    <ul class="info">
      <li class="--em" if={ mob.locations && mob.locations.length }>{ mob.locations.join( ', ' ) }</li>
      <li if={ mob.level }>level { mob.level }</li>
    </ul>

    <ul class="listing" if={ mob.items && mob.items.length }>
      <li each={ mob.items }>
        <div class="listing__image" if={ filename }>
          <img riot-src={ '/assets/visual/icons/png/' + filename } border="0" />
        </div>

        <a href="#item/{ slug }"><h3 class="heading4  listing__title">{ name }</h3></a>

        <ul class="listing__properties">
          <li if={ type_name }>
            <h4 class="heading5">Type:</h4> { type_name }
          </li>
          <li if={ level }>
            <h4 class="heading5">Level:</h4> { level }
          </li>
          <li if={ manu_name }>
            <h4 class="heading5">Manufacturer:</h4> { manu_name }
          </li>
          <li if={ drop_chance }>
            <h4 class="heading5">Drop Chance:</h4> { drop_chance }
          </li>
          <li if={ no_manu }>Non-manufacturable</li>
          <li class="--block" if={ description }>{ description }</li>
        </ul>
      </li>
    </ul>
  </section>

  // Split the ID out from the slug
  var id = opts.slug.split( '-' )[ 0 ];

  // Load the mob in
  App.services.mobs
    .get( id )
    .then( (function ( mob ) {
      // Set the mob in the tag
      this.mob = mob;

      // And render view
      this.update();
    }).bind( this ))
    .catch( function ( err ) {
      console.error( 'Unable to retrieve mob: ', err );
    });
</mob>
