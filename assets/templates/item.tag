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
