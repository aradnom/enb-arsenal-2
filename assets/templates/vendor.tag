<vendor>
  <section class="vendor  { loaded ? '--loaded': null }">
    <h2>{ vendor.first_name } { vendor.last_name }</h2>

    <ul class="meta-info">
      <li class="--em" if={ vendor.sec_name }>{ vendor.sec_name } > { vendor.name }</li>
      <li if={ vendor.level }>level { vendor.level }</li>
    </ul>

    <ul class="listing" if={ vendor.items && vendor.items.length }>
      <li each={ vendor.items }>
        <div class="listing__image" if={ filename }>
          <img riot-src={ '/assets/img/icons/png/' + filename } border="0" />
        </div>

        <a href="#item/{ slug }"><h3 class="heading4  listing__title">{ name }</h3></a>

        <ul class="listing__properties">
          <li if={ type_name }>{ type_name }</li>
          <li if={ level }>{ level }</li>
          <li if={ manu_name }>{  }</li>
          <li if={ no_manu }>Non-manufacturable</li>
          <li if={ description }>{ description }</li>
        </ul>
      </li>
    </ul>
  </section>

  App.services.vendors
    .get( opts.id )
    .then( (function ( vendor ) {
      this.vendor    = vendor;
      this.loaded    = true;

      this.update();
    }).bind( this ))
    .catch( function ( err ) {
      console.error( err );
    });
</vendor>
