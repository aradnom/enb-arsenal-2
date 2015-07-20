<item>
  <section class="item">
    <h2>{ item.name }</h2>

    <div if={ item.image } class="item__image">
      <img riot-src={ '/assets/visual/icons/png/' + item.image } border="0" />
    </div>

    <p class="item__description" if={ item.basic.raw.description }>{ item.basic.raw.description }</p>

    <div if={ item.effects && item.effects.length } class="section">
      <h3>Effects</h3>
      <ul class="info">
        <li each={ item.effects }>
          <h4 class="heading5">{ description }</h4>
          <p>{ stats }</p>
        </li>
      </ul>
    </div>

    <div if={ item.basic.formatted && item.basic.formatted.length } class="section">
      <h3>Basic</h3>
      <ul class="info">
        <li each={ item.basic.formatted }>
          <h4 class="heading5">{ heading }</h4>
          <p>{ field } { unit }</p>
        </li>
      </ul>
    </div>

    <div if={ item.type.formatted && item.type.formatted.length } class="section">
      <h3>Stats</h3>
      <ul class="info">
        <li each={ item.type.formatted }>
          <h4 class="heading5">{ heading }</h4>
          <p>{ field } { unit }</p>
        </li>
      </ul>
    </div>

    <div if={ item.more.formatted && item.more.formatted.length } class="section">
      <h3>Attributes</h3>
      <ul class="info">
        <li each={ item.more.formatted }>
          <h4 class="heading5">{ heading }</h4>
          <p>{ field } { unit }</p>
        </li>
      </ul>
    </div>

    <div if={ item.vendors && item.vendors.length } class="section">
      <h3>Vendors</h3>
      <ul class="info">
        <li each={ item.vendors }>
          <a href="#vendor/{ slug }"><h4 class="heading5">{ first_name } { last_name }</h4></a>
          <p>{ name } - { sec_name }</p>
        </li>
      </ul>
    </div>

    <div if={ item.components && item.components.length } class="section">
      <h3>Components</h3>
      <ul class="info">
        <li each={ item.components }>
          <div if={ image } class="component__image">
            <a href="#item/{ slug }"><img riot-src={ '/assets/visual/icons/png/' + image } border="0" /></a>
          </div>
          <a href="#item/{ slug }"><p>{ name }</p></a>
        </li>
      </ul>
    </div>

    <div if={ item.mobs && item.mobs.length } class="section">
      <h3>Drops</h3>
      <ul class="info">
        <li each={ item.mobs }>
          <a href="#mob/{ slug }"><h4 class="heading5">{ name }</h4></a>
          <p if={ locations && locations.length }>{ locations.join( ', ' ) }</p>
          <p>Chance: { drop_chance.formatted }</p>
        </li>
      </ul>
    </div>

  </section>

  // Split the ID out from the slug
  var id = opts.slug.split( '-' )[ 0 ];

  // Load the item
  App.services.items
    .get( id )
    .then( (function ( item ) {
      // Set the item in the tag
      this.item = item;

      // And render view
      this.update();
    }).bind( this ))
    .catch( function ( err ) {
      console.error( 'Unable to retrieve item: ', err );
    });
</item>
