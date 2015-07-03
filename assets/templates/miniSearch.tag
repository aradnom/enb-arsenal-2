<mini-search>
  <div class="mini-search">
    <h2>It be the search.</h2>

    <form>
      <input type="text" class="mini-search__query" placeholder="Search..." onkeyup={ keyup } />
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
    </form>
  </div>

  keyup = (_.debounce( function ( event ) {
    var value = event.target.value;

    // Run search
    console.log( value );
  }, 150 )).bind( this );

</mini-search>
