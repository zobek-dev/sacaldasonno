import Alpine from 'alpinejs';
import Swiper, {Navigation, Pagination, Controller} from 'swiper';
import fslightbox from 'fslightbox';

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
    
    console.log(this.count);

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
    
    this.swiper = new Swiper(this.carousel, {
      slidesPerView: 1, 
      spaceBetween:16,
      breakpoints: {
        1024: {
          slidesPerView:4,
          spaceBetween:16
        }
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