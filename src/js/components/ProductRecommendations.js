export class ProductRecommendations extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    const handleIntersection = (entries, observer) => {
      if (!entries[0].isIntersecting) return
      observer.unobserve(this)

      fetch(this.dataset.url)
        .then((response) => response.text())
        .then((text) => {
          const html = document.createElement('div')
          html.innerHTML = text
          const recommendations = html.querySelector('product-recommendations')

          if (recommendations && recommendations.innerHTML.trim().length) {
            this.innerHTML = recommendations.innerHTML
          }

          if (
            !this.querySelector('slideshow-component') &&
            this.classList.contains('complementary-products')
          ) {
            this.remove()
          }

          if (html.querySelector('.grid__item')) {
            this.classList.add('product-recommendations--loaded')
          }

          const container = this.querySelector('#RecommendationsProduct')
          const swiper = new Swiper(container, {
            modules: [SwiperNavigation],
            slidesPerView: 4,
            spaceBetween: 16,
            navigation: {
              nextEl: this.querySelector('.swiper-button-next'),
              prevEl: this.querySelector('.swiper-button-prev'),
            },
            breakpoints: {
              150: {
                slidesPerView: 1.5,
                spaceBetween: 8,
              },
              500: {
                slidesPerView: 2,
                spaceBetween: 8,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 16,
              },
              968: {
                slidesPerView: 4,
                spaceBetween: 16,
              },
            },
          })
        })
        .catch((e) => {
          console.error(e)
        })
    }

    new IntersectionObserver(handleIntersection.bind(this), {
      rootMargin: '0px 0px 400px 0px',
    }).observe(this)
  }
}