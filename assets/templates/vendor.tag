<vendor>
  <section class="vendor  { loaded ? '--loaded': null }">
    <h2>{ vendor.first_name } { vendor.last_name }</h2>

    <ul class="info">
      <li class="--em" if={ vendor.sec_name }>{ vendor.sec_name } > { vendor.name }</li>
      <li if={ vendor.level }>level { vendor.level }</li>
    </ul>

    <ul class="listing" if={ vendor.items && vendor.items.length }>
      <li each={ vendor.items }>
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
            <h4 class="heading5">Manufacturer:</h4> { manu_name || 'Unknown' }
          </li>
          <li if={ no_manu }>Non-manufacturable</li>
          <li class="--block" if={ description }>{ description }</li>
        </ul>
      </li>
    </ul>
  </section>

  // Split the ID out from the slug
  var id = opts.slug.split( '-' )[ 0 ];

  // Load the vendor in
  App.services.vendors
    .get( id )
    .then( (function ( vendor ) {
      // Set the vendor in the tag
      this.vendor = vendor;

      // And render view
      this.update();
    }).bind( this ))
    .catch( function ( err ) {
      console.error( 'Unable to retrieve vendor: ', err );
    });
</vendor>
