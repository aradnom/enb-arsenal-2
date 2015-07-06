<item>
  <section class="item">
    <h2>{ opts.item.name }</h2>

    <div if={ opts.item.image } class="item__image">
      <img riot-src={ '/assets/img/icons/png/' + opts.item.image } border="0" />
    </div>

    <p class="item__description" if={ opts.item.basic.raw.description }>{ opts.item.basic.raw.description }</p>

    <ul class="info">
      <li each={ opts.item.basic.formatted }>
        <h4 class="heading5">{ heading }</h4>{ field } { unit }
      </li>
    </ul>

    <ul class="info">
      <li each={ opts.item.more.formatted }>
        <h4 class="heading5">{ heading }</h4>{ field } { unit }
      </li>
    </ul>
  </section>
</item>
