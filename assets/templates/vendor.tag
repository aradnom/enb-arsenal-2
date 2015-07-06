<vendor>
  <section class="vendor  { loaded ? '--loaded': null }">
    <h2>{ opts.vendor.first_name } { opts.vendor.last_name }</h2>

    <ul class="meta-info">
      <li class="--em" if={ opts.vendor.sec_name }>{ opts.vendor.sec_name } > { opts.vendor.name }</li>
      <li if={ opts.vendor.level }>level { opts.vendor.level }</li>
    </ul>

    <ul class="listing" if={ opts.vendor.items && opts.vendor.items.length }>
      <li each={ opts.vendor.items }>
        <div class="listing__image" if={ filename }>
          <img riot-src={ '/assets/img/icons/png/' + filename } border="0" />
        </div>

        <a href="#item/{ slug }"><h3 class="heading4  listing__title">{ name }</h3></a>

        <ul class="listing__properties">
          <li if={ type_name }>{ type_name }</li>
          <li if={ level }>{ level }</li>
          <li if={ manu_name }>{ manu_name }</li>
          <li if={ no_manu }>Non-manufacturable</li>
          <li class="--block" if={ description }>{ description }</li>
        </ul>
      </li>
    </ul>
  </section>
</vendor>
