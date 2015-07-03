<basic-info>
  <h2>Title: { opts.item.basic.raw.name }</h2>

  <div if={ opts.item && opts.item.image } class="item__image">
    <img riot-src={ '/assets/img/icons/png/' + opts.item.image } border="0" />
  </div>
</basic-info>
