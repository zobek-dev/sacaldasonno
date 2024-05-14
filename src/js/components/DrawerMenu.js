
export class MenuDrawer extends HTMLElement {
  constructor() {
    super()

    this.mainDetailsToggle = this.querySelector('details')

    this.addEventListener('keyup', this.onKeyUp.bind(this))
    this.addEventListener('focusout', this.onFocusOut.bind(this))
    this.bindEvents()
  }

  bindEvents() {
    this.querySelectorAll('summary').forEach((summary) =>
      summary.addEventListener('click', this.onSummaryClick.bind(this))
    )
    this.querySelectorAll(
      'button:not(.localization-selector):not(.country-selector__close-button):not(.country-filter__reset-button)'
    ).forEach((button) =>
      button.addEventListener('click', this.onCloseButtonClick.bind(this))
    )
  }

  onKeyUp(event) {
    if (event.code.toUpperCase() !== 'ESCAPE') return

    const openDetailsElement = event.target.closest('details[open]')
    if (!openDetailsElement) return

    openDetailsElement === this.mainDetailsToggle
      ? this.closeMenuDrawer(
          event,
          this.mainDetailsToggle.querySelector('summary')
        )
      : this.closeSubmenu(openDetailsElement)
  }

  onSummaryClick(event) {
    const summaryElement = event.currentTarget
    const detailsElement = summaryElement.parentNode
    const parentMenuElement = detailsElement.closest('.has-submenu')
    const isOpen = detailsElement.hasAttribute('open')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    function addTrapFocus() {
      trapFocus(
        summaryElement.nextElementSibling,
        detailsElement.querySelector('button')
      )
      summaryElement.nextElementSibling.removeEventListener(
        'transitionend',
        addTrapFocus
      )
    }

    if (detailsElement === this.mainDetailsToggle) {
      if (isOpen) event.preventDefault()
      isOpen
        ? this.closeMenuDrawer(event, summaryElement)
        : this.openMenuDrawer(summaryElement)

      if (window.matchMedia('(max-width: 990px)')) {
        document.documentElement.style.setProperty(
          '--viewport-height',
          `${window.innerHeight}px`
        )
      }
    } else {
      setTimeout(() => {
        detailsElement.classList.add('menu-opening')
        summaryElement.setAttribute('aria-expanded', true)
        parentMenuElement && parentMenuElement.classList.add('submenu-open')
        !reducedMotion || reducedMotion.matches
          ? addTrapFocus()
          : summaryElement.nextElementSibling.addEventListener(
              'transitionend',
              addTrapFocus
            )
      }, 100)
    }
  }

  openMenuDrawer(summaryElement) {
    setTimeout(() => {
      this.mainDetailsToggle.classList.add('menu-opening')
    })
    summaryElement.setAttribute('aria-expanded', true)
    trapFocus(this.mainDetailsToggle, summaryElement)
    document.body.classList.add(`overflow-hidden-${this.dataset.breakpoint}`)
  }

  closeMenuDrawer(event, elementToFocus = false) {
    if (event === undefined) return

    this.mainDetailsToggle.classList.remove('menu-opening')
    this.mainDetailsToggle.querySelectorAll('details').forEach((details) => {
      details.removeAttribute('open')
      details.classList.remove('menu-opening')
    })
    this.mainDetailsToggle
      .querySelectorAll('.submenu-open')
      .forEach((submenu) => {
        submenu.classList.remove('submenu-open')
      })
    document.body.classList.remove(`overflow-hidden-${this.dataset.breakpoint}`)
    removeTrapFocus(elementToFocus)
    this.closeAnimation(this.mainDetailsToggle)

    if (event instanceof KeyboardEvent)
      elementToFocus?.setAttribute('aria-expanded', false)
  }

  onFocusOut() {
    setTimeout(() => {
      if (
        this.mainDetailsToggle.hasAttribute('open') &&
        !this.mainDetailsToggle.contains(document.activeElement)
      )
        this.closeMenuDrawer()
    })
  }

  onCloseButtonClick(event) {
    const detailsElement = event.currentTarget.closest('details')
    this.closeSubmenu(detailsElement)
  }

  closeSubmenu(detailsElement) {
    const parentMenuElement = detailsElement.closest('.submenu-open')
    parentMenuElement && parentMenuElement.classList.remove('submenu-open')
    detailsElement.classList.remove('menu-opening')
    detailsElement.querySelector('summary').setAttribute('aria-expanded', false)
    removeTrapFocus(detailsElement.querySelector('summary'))
    this.closeAnimation(detailsElement)
  }

  closeAnimation(detailsElement) {
    let animationStart

    const handleAnimation = (time) => {
      if (animationStart === undefined) {
        animationStart = time
      }

      const elapsedTime = time - animationStart

      if (elapsedTime < 400) {
        window.requestAnimationFrame(handleAnimation)
      } else {
        detailsElement.removeAttribute('open')
        if (detailsElement.closest('details[open]')) {
          trapFocus(
            detailsElement.closest('details[open]'),
            detailsElement.querySelector('summary')
          )
        }
      }
    }

    window.requestAnimationFrame(handleAnimation)
  }
}
