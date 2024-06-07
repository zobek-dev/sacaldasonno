import Alpine from 'alpinejs';
import Swiper, {Navigation, Pagination, Controller, Autoplay} from 'swiper';
import fslightbox from 'fslightbox';
import {validate, format} from "rut.js"

window.validateRut = validate
window.formatRut = format

window.Alpine = Alpine;
Alpine.start();

window.addEventListener('DOMContentLoaded', () => { 
  if(document.querySelector('.fslightbox')){
    fslightbox.initialize({
      selector: '.fslightbox'
    })
  }
})

class GalleryThumbnail extends HTMLElement{
  constructor(){
    super();

    this.gallery = this.querySelector('.gallery');
    this.thumbnail = this.querySelector('.thumbnail');
    this.next = this.querySelector('.swiper-button-next');
    this.prev = this.querySelector('.swiper-button-prev');
    this.count = Number(this.dataset.count);

    this.gall = new Swiper(this.gallery, {
      modules: [Controller, Navigation],
      direction: 'horizontal',
      slidesPerView: 1,
      loop: true,
      spaceBetween: 16,
      centeredSlides: true,
      loopedSlides: this.count,
      navigation: {
        nextEl: this.next,
        prevEl: this.prev
      }
    })
    this.thumb = new Swiper(this.thumbnail, {
      modules: [Controller],
      slidesPerView: 5,
      spaceBetween: 16,
      direction: 'horizontal',
      loop: true,
      centeredSlides: true,
      loopedSlides: this.count,
      slideToClickedSlide: true,
    })

    this.gall.controller.control = this.thumb;
    this.thumb.controller.control = this.gall;
  }
}

customElements.define('gallery-thumbnail', GalleryThumbnail)


class ProductCaracteristicasCarousel extends HTMLElement{
  constructor(){
    super();
    this.carousel = this.querySelector('.caracteristica-carousel');
    this.next = this.querySelector('.swiper-button-next');
    this.prev = this.querySelector('.swiper-button-prev');

    this.swiper = new Swiper(this.carousel, {
      modules: [Navigation],
      slidesPerView:1,
      spaceBetween:16,
      breakpoints: {
        550:{
          slidesPerView: 2
        },
        875:{
          slidesPerView: 4
        },
        1280:{
          slidesPerView: 6
        }
      },
      navigation: {
        nextEl: this.next,
        prevEl: this.prev
      }
    })
  }
}

customElements.define('caracteristicas-carousel', ProductCaracteristicasCarousel)

class ProductConsejosCarousel extends HTMLElement{
  constructor(){
    super();

    this.carousel = this.querySelector('.carousel-consejos');
    this.next = this.querySelector('.swiper-button-next');
    this.prev = this.querySelector('.swiper-button-prev');
    this.count = Number(this.dataset.count);
    
    this.swiper = new Swiper(this.carousel, {
      modules: [Navigation],
      slidesPerView: 1, 
      spaceBetween:16,
      breakpoints: {
        1024: {
          slidesPerView:this.count,
          spaceBetween:16
        }
      },
      navigation: {
        nextEl: this.next,
        prevEl: this.prev
      }
    })
  }
}

customElements.define('carousel-consejos', ProductConsejosCarousel);

class HomeIcons extends HTMLElement{
  constructor(){
    super()
    this.carousel = this.querySelector('.icon-carousel');
    this.next = this.querySelector('.swiper-button-next');
    this.prev = this.querySelector('.swiper-button-prev');

    this.swiper = new Swiper(this.carousel, {
      modules: [Navigation],
      slidesPerView: 1,
      spaceBetween: 16,
      navigation: {
        nextEl: this.next,
        prevEl: this.prev
      },
      breakpoints:{
        768: {
          slidesPerView: 2,
          spaceBetween: 16
        },
        1024: {
          slidesPerView: 4,
          spaceBetween: 16
        }
      }
    })
  }
}

customElements.define('icon-carousel', HomeIcons)

class FeaturedProduct extends HTMLElement{
  constructor(){
    super();

    this.carousel = this.querySelector('.featured-products'); 
    this.next = this.querySelector('.swiper-button-next');
    this.prev = this.querySelector('.swiper-button-prev');

    this.swiper = new Swiper(this.carousel, {
      modules: [Navigation],
      slidesPerView: 2,
      spaceBetween: 16,
      breakpoints: {
        768: {
          slidesPerView: 3,
        },
        768: {
          slidesPerView: 4,
        },
      },
      navigation: {
        nextEl: this.next,
        prevEl: this.prev
      }
    })
  }
}

customElements.define('featured-products', FeaturedProduct);

class ArticlesCarousel extends HTMLElement{
  constructor(){
    super();

    this.carousel = this.querySelector('.articles-carousel');
    this.next = this.querySelector('.swiper-button-next');
    this.prev = this.querySelector('.swiper-button-prev');

    this.swiper = new Swiper(this.carousel, {
      modules:[Navigation],
      slidesPerView: 1,
      spaceBetween: 16,
      navigation: {
        nextEl: this.next,
        prevEl: this.prev
      },
      breakpoints: {
        500:{
          slidesPerView: 2,
        },
        1024:{
          slidesPerView: 3,
        },
      }
    })
  }
}

customElements.define('articles-carousel', ArticlesCarousel);




// Shopify Global Functions

Shopify.postLink = function(path, options) {
  options = options || {};
  var method = options['method'] || 'post';
  var params = options['parameters'] || {};

  var form = document.createElement("form");
  form.setAttribute("method", method);
  form.setAttribute("action", path);

  for(var key in params) {
    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", key);
    hiddenField.setAttribute("value", params[key]);
    form.appendChild(hiddenField);
  }
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
};

Shopify.CountryProvinceSelector = function(country_domid, province_domid, options) {
  this.countryEl         = document.getElementById(country_domid);
  this.provinceEl        = document.getElementById(province_domid);
  this.provinceContainer = document.getElementById(options['hideElement'] || province_domid);

  Shopify.addListener(this.countryEl, 'change', Shopify.bind(this.countryHandler,this));

  this.initCountry();
  this.initProvince();
};

Shopify.CountryProvinceSelector.prototype = {
  initCountry: function() {
    var value = this.countryEl.getAttribute('data-default');
    Shopify.setSelectorByValue(this.countryEl, value);
    this.countryHandler();
  },

  initProvince: function() {
    var value = this.provinceEl.getAttribute('data-default');
    if (value && this.provinceEl.options.length > 0) {
      Shopify.setSelectorByValue(this.provinceEl, value);
    }
  },

  countryHandler: function(e) {
    var opt       = this.countryEl.options[this.countryEl.selectedIndex];
    var raw       = opt.getAttribute('data-provinces');
    var provinces = JSON.parse(raw);

    this.clearOptions(this.provinceEl);
    if (provinces && provinces.length == 0) {
      this.provinceContainer.style.display = 'none';
    } else {
      for (var i = 0; i < provinces.length; i++) {
        var opt = document.createElement('option');
        opt.value = provinces[i][0];
        opt.innerHTML = provinces[i][1];
        this.provinceEl.appendChild(opt);
      }

      this.provinceContainer.style.display = "";
    }
  },

  clearOptions: function(selector) {
    while (selector.firstChild) {
      selector.removeChild(selector.firstChild);
    }
  },

  setOptions: function(selector, values) {
    for (var i = 0, count = values.length; i < values.length; i++) {
      var opt = document.createElement('option');
      opt.value = values[i];
      opt.innerHTML = values[i];
      selector.appendChild(opt);
    }
  }
};

class Slideshow extends HTMLElement{
  constructor(){
    super()
    this.carousel = this.querySelector('.slideshow');
    this.next = this.querySelector('.btn-next');
    this.prev = this.querySelector('.btn-prev');
    this.pagination = this.querySelector('.swiper-pagination')

    this.swiper = new Swiper(this.carousel, {
      modules: [Navigation, Pagination, Autoplay],
      loop: true, 
      navigation: {
        nextEl: this.next,
        prevEl: this.prev
      },
      pagination: {
        el: this.pagination,
        clickable: true
      },
      speed: 500, 
      autoplay: 
      {
        delay: 4000,
      },
    })
  } 
}

customElements.define('slideshow-carousel', Slideshow);