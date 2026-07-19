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

/** @type {string} */
let selectedSize = ''

/** @type {string} */
let selectedColor = ''

/** @type {Product | null} */
let currentProduct = null

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

    console.log({
      size: selectedSize,
      color: selectedColor,
      variant
    })
  })
}

/**
 * ------------------------------------
 * FUNCTIONS
 * ------------------------------------
 */

/**
 * @param {Product} product
 */
function openProductDetail (product) {
  currentProduct = product
  selectedSize = ''
  selectedColor = ''
  console.log(product, 'log del script')
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
 * @param {Product} product
 */
function renderVariants (product) {
  console.log(product.variants, 'TODAS LAS VARIANTS')
  const sizes = getSizes(product)

  renderSizes(sizes)

  addSizeDropdownListener()

  const colors = getAllColors(product)

  renderColors(colors)

  addSizeListener(product)
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

/**
 * @param {Product} product
 * @param {string} selectedSize
 */
function getColorsBySize (product, selectedSize) {
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
 * @param {Product} product
 */
function getSelectedVariant (product) {
  return product.variants.find(
    variant =>
      variant.option1 === selectedSize && variant.option2 === selectedColor
  )
}

async function addToCart () {
  if (!currentProduct) return

  const softWinterJacketVariantId = 50011002798328

  const variant = getSelectedVariant(currentProduct)

  if (!variant) {
    console.log('Please select size and color')
    return
  }

  const items = [{ id: variant.id, quantity: 1 }]

  const shouldAddWinterJacket =
    variant.option1 === 'M' && variant.option2 === 'Black'

  if (shouldAddWinterJacket) {
    items.push({
      id: softWinterJacketVariantId,
      quantity: 1
    })
  }

  try {
    const response = await fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        items
      })
    })

    const data = await response.json()

    console.log('Added:', data)

    const cart = await fetch('/cart.js')
    const cartData = await cart.json()

    console.log('Current cart:', cartData)
  } catch (error) {
    console.error('Error adding product:', error)
  }
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
