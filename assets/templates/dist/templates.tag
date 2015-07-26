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

<item-grid>
  <div class="item-grid  content">
    <item-card each={ items } data={ this }></item-card>
  </div>

  /////////////////////////////////////////////////////////////////////////////
  // Scripts //////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////

  var tag = this;

  items = [];

  this.cache = new App.models.cache( 'itemGrid' );

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
    var cached = tag.cache.getAll();

    // Reload any stored items
    if ( cached && cached.length ) {
      items = cached;
    
      this.update();

      // And reestablish the grid
      buildGrid();
    }
  });

  this.on( 'unmount', function () {
    // Save the current items into the app state for retrieval
    tag.cache.setCache( items );

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

<item>
  <section class="item">
    <h2>{ item.name }</h2>

    <div if={ item.image } class="item__image">
      <img riot-src={ '/assets/visual/icons/png/' + item.image } border="0" />
    </div>

    <p class="item__description" if={ item.description }>{ item.description }</p>

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

<search>
  <div class="search  content  --top">
    <form>
      <div class="search__query-container { searchFocused ? '--focused' : '' }">
        <div class="search__query__icon" data-icon="search"></div>
        <input type="text" class="search__query" id="search-query" name="search-query" placeholder="Search..." onkeyup={ keyup } onfocus={ searchFocus } onblur={ searchBlur } />
      </div>

      <button class="search__show-filters  --primary" onclick={ showFilters }><span class="vh">{ filtersShowing ? 'hide' : 'show' } filters</span></button>

      <div class="search__filters">
        <fieldset class="search__filters__type">

          <input type="radio" id="searchtype-item" name="search-type" value="item" onchange={ setTypeFilters } checked />
          <label for="searchtype-item">Item</label>

          <input type="radio" id="searchtype-mob" name="search-type" value="mob" onchange={ setTypeFilters } />
          <label for="searchtype-mob">Mob</label>

          <input type="radio" id="searchtype-vendor" name="search-type" value="vendor" onchange={ setTypeFilters } />
          <label for="searchtype-vendor">Vendor</label>

          <input type="radio" id="searchtype-effects" name="search-type" value="effects" onchange={ setTypeFilters } />
          <label for="searchtype-effects">Effects</label>

        </fieldset>

        <fieldset class="search__filters__attributes">

          <div class="search-filter-attribute  --type  { setMobFilters || setVendorFilters ? '--hidden' : '' }">
            <select name="type" id="type">
              <option value="">All</option>
              <option value="14">Beams</option>
              <option value="15">Missile Launchers</option>
              <option value="16">Projectile Launchers</option>
              <option value="10">Ammo</option>
              <option value="2">Shields</option>
              <option value="7">Reactors</option>
              <option value="6">Engines</option>
              <option value="11">Devices</option>
              <option value="13">Components/Ore</option>
              <option value="lootother">Loots and Other</option>
            </select>
          </div>

          <div class="search-filter-attribute  --level">
            <select name="level" id="level">
              <option value="">Any</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
            </select>
          </div>

          <div class="search-filter-attribute  --race  { setMobFilters || setVendorFilters ? '--hidden' : '' }">
            <select name="race" id="race">
              <option value="">All</option>
              <option value="2">Jenquai Restricted</option>
              <option value="4">Progen Restricted</option>
              <option value="1">Terran Restricted</option>
              <option value="5">Jenquai Only</option>
              <option value="3">Progen Only</option>
              <option value="6">Terran Only</option>
            </select>
          </div>

          <div class="search-filter-attribute  --class  { setMobFilters || setVendorFilters ? '--hidden' : '' }">
            <select name="class" id="class">
              <option value="">All</option>
              <option value="3">Explorer Only</option>
              <option value="5">Trader Only</option>
              <option value="6">Warrior Only</option>
            </select>
          </div>

          <div class="search-filter-attribute  --manufacturer  { setMobFilters || setVendorFilters ? '--hidden' : '' }">
            <select name="manufacturer" id="manufacturer">
              <option value="">All</option>
              <option value="0">Unknown</option>
              <option value="36">Athanor</option>
              <option value="37">BlackBox</option>
              <option value="1">Blacksun</option>
              <option value="19">Bogeril</option>
              <option value="45">Brimstone</option>
              <option value="24">CE3K</option>
              <option value="38">Cyclo</option>
              <option value="9">DigiApogee</option>
              <option value="2">EarthCorps</option>
              <option value="23">Electro</option>
              <option value="48">Evoco</option>
              <option value="25">Evolver</option>
              <option value="39">Focus</option>
              <option value="16">GETco</option>
              <option value="5">InfinitiCorp</option>
              <option value="14">InZen</option>
              <option value="26">K3</option>
              <option value="20">Kokura</option>
              <option value="54">Light Speed Inc.</option>
              <option value="11">Merus Milia</option>
              <option value="27">Mi</option>
              <option value="42">MX</option>
              <option value="28">Nebula</option>
              <option value="3">Nishido</option>
              <option value="40">Nova</option>
              <option value="13">null</option>
              <option value="44">Pharaoh</option>
              <option value="29">Plasma</option>
              <option value="22">Play-O</option>
              <option value="49">Prometheus</option>
              <option value="30">Proton</option>
              <option value="41">Quark</option>
              <option value="52">Shaitan</option>
              <option value="50">Sharushar</option>
              <option value="15">Shikari</option>
              <option value="4">Sparta</option>
              <option value="31">Sunburst</option>
              <option value="17">Sundari</option>
              <option value="43">Surge-Inflexor</option>
              <option value="6">Tada-O</option>
              <option value="53">Triad Technologies</option>
              <option value="32">Turbo2</option>
              <option value="33">Ultra</option>
              <option value="21">V'rix</option>
              <option value="34">Vortex</option>
              <option value="7">Vrix</option>
              <option value="46">Warlock</option>
              <option value="35">Zeke</option>
              <option value="51">Zenrei</option>
            </select>
          </div>

        </fieldset>
      </div>

    </form>

    <div class="search-results">
      <li each={ results } onclick={ addItem }>{ name }</li>
    </div>
  </div>

  /////////////////////////////////////////////////////////////////////////////
  // Scripts //////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////

  var tag = this;

  searchFocus = function () {
    searchFocused = true;
  };

  searchBlur = function () {
    searchFocused = false;
  };

  setTypeFilters = function () {
    var searchType = $( '[name="search-type"]:checked' ).val();

    // Reset everything to start
    tag.setMobFilters    = false;
    tag.setVendorFilters = false;
    tag.setItemFilters   = false;

    switch ( searchType ) {
      case 'mob':    tag.setMobFilters = true; break;
      case 'vendor': tag.setVendorFilters = true; break;
      default: tag.setItemFilters = true;
    }
  };

  keyup = (_.debounce( function ( event ) {
    var value = event.target.value;

    runSearch();
  }, 150 )).bind( this );

  showFilters = function () {
    var $filters = $( '.search__filters' );

    if ( this.filtersShowing ) {
      this.filtersShowing = false;
      $filters
        .velocity( 'stop' )
        .velocity( 'slideUp', { duration: 200 });
    } else {
      this.filtersShowing = true;
      $filters
        .velocity( 'stop' )
        .velocity( 'slideDown', { duration: 200, complete: function () {
          $( '.search-filter-attribute' ).each( function () {
            // Set the width and height of each filter attribute for use with
            // transitions later
            $( this ).css({ 'max-width': $( this ).width(), 'max-height': $( this ).height() })
          });
        }});
    }
  };

  addItem = function ( event ) {
    console.log( event.item );

    App.tags[ 'item-grid' ].trigger( 'addItem', event.item );
  };

  runSearch = function () {
    var filters     = $('.search form').serializeArray();
    var formObject  = {};
    filters.forEach( function ( v ) { formObject[ v.name ] = v.value; } );

    var value      = formObject[ 'search-query' ];
    var searchType = formObject[ 'search-type' ];

    if ( value && value.length > 2 ) {
      App.services.search
        .search( searchType, { name: value }, App.config.search.limit )
        .then( ( function ( results ) {
          tag.results = results;

          tag.update();
        }).bind( this ))
        .catch( function ( err ) {
          console.error( err );
        });
    } else {
      tag.results = null;

      tag.update();
    }
  };

</search>

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
