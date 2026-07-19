import { CartLinesUpdateEvent } from '@shopify/events'
/**
 * ------------------------------------
 * TYPES
 * ------------------------------------
 */

/**
 * @typedef {Object} Variant
 * @property {number} id
 * @property {string} title
 * @property {string} option1
 * @property {string} option2
 */

/**
 * @typedef {Object} Product
 * @property {string} title
 * @property {string} description
 * @property {number} price
 * @property {string} featured_image
 * @property {Array<Variant>} variants
 */

/**
 * ------------------------------------
 * GLOBAL STATE
 * ------------------------------------
 */

/** @type {string} */
let selectedSize = ''

/** @type {string} */
let selectedColor = ''

/** @type {Product | null} */
let currentProduct = null

/**
 * ------------------------------------
 * DOM ELEMENTS
 * ------------------------------------
 */

/** @type {NodeListOf<HTMLButtonElement>} */
const popupButtons = document.querySelectorAll('.custom-popup__button')

const productDetail = document.querySelector('.custom-product-detail')

const closeButton = document.querySelector(
  '.custom-product-detail__close-button'
)
const overlay = document.querySelector('.custom-product-detail-overlay')

const addToCartButton = document.querySelector(
  '.custom-product-detail__add-to-cart'
)
const addToCartText = addToCartButton?.querySelector(
  '.custom-product-detail__add-to-cart-text'
)

/**
 * ------------------------------------
 * EVENT LISTENERS
 * ------------------------------------
 */

popupButtons.forEach(button => {
  button.addEventListener('click', () => {
    const productData = button.dataset.product

    if (!productData) return

    const product = JSON.parse(productData)

    openProductDetail(product)
  })
})

if (closeButton) {
  closeButton.addEventListener('click', () => {
    closeProductDetail()
  })
}

if (overlay) {
  overlay.addEventListener('click', () => {
    closeProductDetail()
  })
}

if (addToCartButton) {
  addToCartButton.addEventListener('click', () => {
    addToCart()
  })
}

/**
 * ------------------------------------
 * PRODUCT DETAIL FUNCTIONS
 * ------------------------------------
 */
/**
 * @param {Product} product
 */
function openProductDetail (product) {
  currentProduct = product
  selectedSize = ''
  selectedColor = ''
  if (!productDetail || !overlay) return

  productDetail.classList.add('is-open')
  overlay.classList.add('is-open')

  renderProductInfo(product)
  renderVariants(product)
}

function closeProductDetail () {
  if (!productDetail || !overlay) return

  productDetail.classList.remove('is-open')
  overlay.classList.remove('is-open')
}

/**
 * @param {Product} product
 */
function renderProductInfo (product) {
  if (!productDetail) return

  const title = productDetail.querySelector('.custom-product-detail__title')

  /** @type {HTMLImageElement | null} */
  const image = productDetail.querySelector('.custom-product-detail__img')

  const description = productDetail.querySelector(
    '.custom-product-detail__description'
  )

  const price = productDetail.querySelector('.custom-product-detail__price')

  if (!title || !description || !price || !image) return

  image.src = `https:${product.featured_image}`
  image.alt = product.title

  title.textContent = product.title

  description.innerHTML = product.description

  price.textContent = `$${product.price}`
}

/**
 * Initializes the product variant UI
 * by rendering sizes, colors and their
 * corresponding event listeners.
 */

/**
 * @param {Product} product
 */
function renderVariants (product) {
  const sizes = getSizes(product)

  renderSizes(sizes)

  addSizeDropdownListener()

  const colors = getAllColors(product)

  renderColors(colors)

  addSizeListener(product)
}

/**
 * ------------------------------------
 * SIZE FUNCTIONS
 * ------------------------------------
 */
/**
 * @param {Product} product
 */
function addSizeListener (product) {
  if (!productDetail) return

  /** @type {HTMLSelectElement | null} */
  const sizeSelect = productDetail.querySelector(
    '.custom-product-detail__size-select'
  )

  if (!sizeSelect) return

  sizeSelect.addEventListener('change', () => {
    selectedSize = sizeSelect.value

    const colors = getColorsBySize(product, selectedSize)

    renderColors(colors)
    if (!currentProduct) return

    const variant = getSelectedVariant(currentProduct)
  })
}

/**
 * @param {Product} product
 */
function getSizes (product) {
  const sizes = new Set()

  product.variants.forEach(variant => {
    sizes.add(variant.option1)
  })
  return [...sizes]
}
/**
 * The custom size dropdown is built using
 * a hidden native select element plus a custom UI.
 *
 * This approach provides full control over the
 * visual appearance while keeping the selected
 * value synchronized.
 */

/**
 * @param {Array<string>} sizes
 */
function renderSizes (sizes) {
  if (!productDetail) return

  /** @type {HTMLSelectElement | null} */
  const sizeSelect = productDetail.querySelector(
    '.custom-product-detail__size-select'
  )
  const sizeButton = productDetail.querySelector(
    '.custom-product-detail__size-button'
  )

  const sizeOptions = productDetail.querySelector(
    '.custom-product-detail__size-options'
  )
  const sizeArrow = productDetail.querySelector(
    '.custom-product-detail__size-arrow'
  )
  if (!sizeSelect || !sizeButton || !sizeOptions || !sizeArrow) return

  sizeSelect.innerHTML = ''
  sizeOptions.innerHTML = ''

  sizeButton.textContent = 'Choose your size'
  sizeButton.classList.remove('is-selected')

  const placeholder = document.createElement('option')

  placeholder.value = ''
  placeholder.textContent = 'Choose your size'
  placeholder.disabled = true
  placeholder.selected = true
  placeholder.hidden = true

  sizeSelect.appendChild(placeholder)

  sizes.forEach(size => {
    const option = document.createElement('option')

    option.value = size
    option.textContent = size

    sizeSelect.appendChild(option)

    const li = document.createElement('li')

    li.textContent = size

    li.addEventListener('click', () => {
      sizeButton.textContent = size

      sizeButton.classList.add('is-selected')

      sizeSelect.value = size

      sizeSelect.dispatchEvent(new Event('change'))

      sizeOptions.classList.remove('is-open')
      sizeArrow.classList.remove('is-open')
    })

    sizeOptions.appendChild(li)
  })
}
function addSizeDropdownListener () {
  if (!productDetail) return

  /** @type {HTMLButtonElement | null} */
  const sizeButton = productDetail.querySelector(
    '.custom-product-detail__size-button'
  )

  const sizeOptions = productDetail.querySelector(
    '.custom-product-detail__size-options'
  )

  const sizeArrow = productDetail.querySelector(
    '.custom-product-detail__size-arrow'
  )

  if (!sizeButton || !sizeOptions || !sizeArrow) return

  sizeButton.onclick = () => {
    sizeOptions.classList.toggle('is-open')
    sizeArrow.classList.toggle('is-open')
  }
}

/**
 * ------------------------------------
 * COLOR FUNCTIONS
 * ------------------------------------
 */

/**
 * @param {Product} product
 * @param {string} selectedSize
 */
function getColorsBySize (product, selectedSize) {
  /**
   * Colors are dynamically filtered based on the
   * selected size, matching the available Shopify variants.
   */

  const colors = new Set()

  product.variants.forEach(variant => {
    if (variant.option1 === selectedSize) {
      colors.add(variant.option2)
    }
  })

  return [...colors]
}

/**
 * @param {Array<string>} colors
 */
function renderColors (colors) {
  if (!productDetail) return

  const colorContainer = productDetail.querySelector(
    '.custom-product-detail__color-options'
  )

  if (!colorContainer) return

  colorContainer.innerHTML = ''

  const selector = document.createElement('span')

  selector.classList.add('custom-product-detail__color-selector')

  colorContainer.appendChild(selector)

  colors.forEach(color => {
    const button = document.createElement('button')
    button.classList.add('custom-product-detail__color-button')

    button.addEventListener('click', () => {
      selectedColor = color
      selector.style.opacity = '1'

      selector.style.transform = `translateX(${button.offsetLeft}px) scale(1)`

      const buttons = colorContainer.querySelectorAll(
        '.custom-product-detail__color-button'
      )

      buttons.forEach(button => {
        button.classList.remove('is-selected')
      })

      button.classList.add('is-selected')

      if (!currentProduct) return
      const variant = getSelectedVariant(currentProduct)

      console.log({
        size: selectedSize,
        color: selectedColor,
        variant
      })
    })

    const preview = document.createElement('span')
    preview.classList.add('custom-product-detail__color-preview')

    preview.style.backgroundColor = color.toLowerCase()

    button.appendChild(preview)
    button.append(color)

    colorContainer.appendChild(button)
  })
}

/**
 * @param {Product} product
 */
function getAllColors (product) {
  const colors = new Set()

  product.variants.forEach(variant => {
    colors.add(variant.option2)
  })

  return [...colors]
}

/**
 * ------------------------------------
 * PRODUCT HELPERS
 * ------------------------------------
 */

/**
 * @param {Product} product
 */
function getSelectedVariant (product) {
  return product.variants.find(
    variant =>
      variant.option1 === selectedSize && variant.option2 === selectedColor
  )
}

/**
 * ------------------------------------
 * CART FUNCTIONS
 * ------------------------------------
 */

/**
 * Shopify challenge business rule:
 *
 * If the customer selects the Black / M variant,
 * a Soft Winter Jacket is automatically added
 * to the cart as an additional item.
 */

async function addToCart () {
  if (!currentProduct) return

  // Extra variant added as a bundle example.
  // If the selected variant matches this condition,
  // another product is added in the same cart operation.
  const softWinterJacketVariantId = 50011002798328

  const variant = getSelectedVariant(currentProduct)

  if (!variant) {
    showError('SELECT SIZE & COLOR')
    return
  }

  // Items that will be sent to Shopify Cart API
  const items = [{ id: variant.id, quantity: 1 }]

  // Custom bundle logic
  const shouldAddWinterJacket =
    variant.option1 === 'M' && variant.option2 === 'Black'

  if (shouldAddWinterJacket) {
    items.push({
      id: softWinterJacketVariantId,
      quantity: 1
    })
  }

  /*
    Dawn uses CartLinesUpdateEvent as the communication layer
    between cart mutations and UI components.

    The deferred promise allows cart components to wait
    until the cart update finishes before refreshing sections.
  */
  const deferredEventPromise = CartLinesUpdateEvent.createPromise()
  try {
    /*
      Retrieve cart sections that need to be refreshed.
      
      Dawn uses Section Rendering API to replace
      parts of the DOM instead of manually updating
      every cart component.
    */
    const cartItemsComponents = document.querySelectorAll(
      'cart-items-component'
    )

    /** @type {string[]} */
    const sections = []

    cartItemsComponents.forEach(component => {
      if (component instanceof HTMLElement && component.dataset.sectionId) {
        sections.push(component.dataset.sectionId)
      }
    })

    /*
      Add product(s) to Shopify cart.
      
      The `sections` parameter tells Shopify to return
      updated HTML for those sections.
    */
    const response = await fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        items,
        sections: sections.join(',')
      })
    })

    const data = await response.json()

    /*
      Small UI feedback for the user.
    */

    if (!addToCartButton) return

    const originalContent = addToCartButton.innerHTML

    addToCartButton.innerHTML = '✓ ADDED TO CART'

    setTimeout(() => {
      closeProductDetail()

      addToCartButton.innerHTML = originalContent
    }, 700)

    /*
      Fetch final cart state after Shopify mutation.
    */
    const cartResponse = await fetch('/cart.js')
    const cart = await cartResponse.json()

    /*
      Notify Theme that a cart mutation happened.

      Cart components listen to this event and handle:
      - cart drawer updates
      - cart counter updates
      - section hydration
      - UI synchronization
    */
    const event = new CartLinesUpdateEvent({
      action: 'add',
      context: 'product',
      lines: items.map(item => ({
        merchandiseId: String(item.id),
        quantity: item.quantity
      })),
      promise: deferredEventPromise.promise
    })

    document.dispatchEvent(event)

    /*
      Resolve the event with the updated cart data.

      This unlocks Dawn's internal update flow.
    */

    deferredEventPromise.resolve({
      cart: CartLinesUpdateEvent.createCartFromAjaxResponse(cart),
      detail: {
        sections: data.sections,
        items: cart.items,
        source: 'custom-add-to-cart',
        itemCount: cart.item_count,
        didError: false
      }
    })
  } catch (error) {
    deferredEventPromise.reject(error)

    console.error('Error adding product:', error)
  }
}
/**
 * Adds the selected product variant to the Shopify cart.
 *
 * Custom add-to-cart logic:
 *
 * Initially, the cart was being updated correctly through `/cart/add.js`,
 * but the Dawn theme UI was not reacting to the change:
 * - Cart drawer was not refreshing
 * - Cart counter was not updating
 * - Cart sections were not being re-rendered
 *
 * After investigating Dawn's native cart implementation,
 * I found that the theme relies on `CartLinesUpdateEvent`
 * to notify cart-related components when a cart mutation occurs.
 *
 * This function follows the same communication pattern:
 * 1. Add items through Shopify Cart API
 * 2. Request updated cart sections
 * 3. Fetch the updated cart state
 * 4. Dispatch `CartLinesUpdateEvent`
 * 5. Resolve the deferred promise so Dawn components
 *    can update themselves through their existing logic.
 */

/**
 * Displays a validation error message to the user.
 *
 * @param {string} message - Error message to display.
 */
function showError (message) {
  if (!addToCartButton) return

  if (!addToCartText) return

  addToCartText.textContent = message

  addToCartButton.classList.add('error')

  setTimeout(() => {
    addToCartText.textContent = 'ADD TO CART'
    addToCartButton.classList.remove('error')
  }, 500)
}
