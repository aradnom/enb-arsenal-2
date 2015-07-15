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
