<item>
  <section class="item">
    <h2>{ opts.item.name }</h2>

    <div if={ opts.item.image } class="item__image">
      <img riot-src={ '/assets/img/icons/png/' + opts.item.image } border="0" />
    </div>

    <ul class="info">
      <li each={ opts.item.basic.formatted }>
        { field }
      </li>
    </ul>
  </section>
</item>
