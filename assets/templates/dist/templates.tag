<item>
  <section class="item">
    <h2>{ opts.item.name }</h2>

    <div if={ opts.item.image } class="item__image">
      <img riot-src={ '/assets/visual/icons/png/' + opts.item.image } border="0" />
    </div>

    <p class="item__description" if={ opts.item.basic.raw.description }>{ opts.item.basic.raw.description }</p>

    <div if={ opts.item.effects && opts.item.effects.length } class="section">
      <h3>Effects</h3>
      <ul class="info">
        <li each={ opts.item.effects }>
          <h4 class="heading5">{ description }</h4>
          <p>{ stats }</p>
        </li>
      </ul>
    </div>

    <div if={ opts.item.basic.formatted && opts.item.basic.formatted.length } class="section">
      <h3>Basic</h3>
      <ul class="info">
        <li each={ opts.item.basic.formatted }>
          <h4 class="heading5">{ heading }</h4>
          <p>{ field } { unit }</p>
        </li>
      </ul>
    </div>

    <div if={ opts.item.type.formatted && opts.item.type.formatted.length } class="section">
      <h3>Stats</h3>
      <ul class="info">
        <li each={ opts.item.type.formatted }>
          <h4 class="heading5">{ heading }</h4>
          <p>{ field } { unit }</p>
        </li>
      </ul>
    </div>

    <div if={ opts.item.more.formatted && opts.item.more.formatted.length } class="section">
      <h3>Attributes</h3>
      <ul class="info">
        <li each={ opts.item.more.formatted }>
          <h4 class="heading5">{ heading }</h4>
          <p>{ field } { unit }</p>
        </li>
      </ul>
    </div>

    <div if={ opts.item.vendors && opts.item.vendors.length } class="section">
      <h3>Vendors</h3>
      <ul class="info">
        <li each={ opts.item.vendors }>
          <a href="#vendor/{ slug }"><h4 class="heading5">{ first_name } { last_name }</h4></a>
          <p>{ name } - { sec_name }</p>
        </li>
      </ul>
    </div>

    <div if={ opts.item.components && opts.item.components.length } class="section">
      <h3>Components</h3>
      <ul class="info">
        <li each={ opts.item.components }>
          <div if={ image } class="component__image">
            <a href="#item/{ slug }"><img riot-src={ '/assets/visual/icons/png/' + image } border="0" /></a>
          </div>
          <a href="#item/{ slug }"><p>{ name }</p></a>
        </li>
      </ul>
    </div>

    <div if={ opts.item.mobs && opts.item.mobs.length } class="section">
      <h3>Drops</h3>
      <ul class="info">
        <li each={ opts.item.mobs }>
          <a href="#mob/{ slug }"><h4 class="heading5">{ name }</h4></a>
          <p if={ locations && locations.length }>{ locations.join( ', ' ) }</p>
          <p>Chance: { drop_chance.formatted }</p>
        </li>
      </ul>
    </div>

  </section>
</item>

<mob>
  <section class="mob">
    <h2>{ opts.mob.name }</h2>

    <ul class="info">
      <li class="--em" if={ opts.mob.locations && opts.mob.locations.length }>{ opts.mob.locations.join( ', ' ) }</li>
      <li if={ opts.mob.level }>level { opts.mob.level }</li>
    </ul>

    <ul class="listing" if={ opts.mob.items && opts.mob.items.length }>
      <li each={ opts.mob.items }>
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
</mob>

<search>
  <div class="search">
    <form>
      <input type="text" class="search__query" placeholder="Search..." onkeyup={ keyup } />

      <button class="search__show-filters" onclick={ showFilters }><span class="vh">show filters</span></button>

      <div class="search__filters">
        <fieldset>

          <label for="searchtype-item">Item</label>
          <input type="radio" id="searchtype-item" name="search-type" value="item" />

          <label for="searchtype-mob">Mob</label>
          <input type="radio" id="searchtype-mob" name="search-type" value="mob" />

          <label for="searchtype-vendor">Vendor</label>
          <input type="radio" id="searchtype-vendor" name="search-type" value="vendor" />

          <label for="searchtype-effects">Effects</label>
          <input type="radio" id="searchtype-effects" name="search-type" value="effects" />

        </fieldset>

        <fieldset class="search__filters">

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

          <select name="race" id="race">
            <option value="">All</option>
            <option value="2">Jenquai Restricted</option>
            <option value="4">Progen Restricted</option>
            <option value="1">Terran Restricted</option>
            <option value="5">Jenquai Only</option>
            <option value="3">Progen Only</option>
            <option value="6">Terran Only</option>
          </select>

          <select name="class" id="class">
            <option value="">All</option>
            <option value="3">Explorer Only</option>
            <option value="5">Trader Only</option>
            <option value="6">Warrior Only</option>
          </select>

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

        </fieldset>
      </div>

    </form>
  </div>

  keyup = (_.debounce( function ( event ) {
    var value = event.target.value;

    // Run search
    console.log( value );
  }, 150 )).bind( this );

</search>

<vendor>
  <section class="vendor  { loaded ? '--loaded': null }">
    <h2>{ opts.vendor.first_name } { opts.vendor.last_name }</h2>

    <ul class="info">
      <li class="--em" if={ opts.vendor.sec_name }>{ opts.vendor.sec_name } > { opts.vendor.name }</li>
      <li if={ opts.vendor.level }>level { opts.vendor.level }</li>
    </ul>

    <ul class="listing" if={ opts.vendor.items && opts.vendor.items.length }>
      <li each={ opts.vendor.items }>
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
</vendor>
