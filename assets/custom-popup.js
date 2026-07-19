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

/** @type {NodeListOf<HTMLButtonElement>} */
const popupButtons = document.querySelectorAll('.custom-popup__button')

const productDetail = document.querySelector('.custom-product-detail')

const closeButton = document.querySelector(
  '.custom-product-detail__close-button'
)
const overlay = document.querySelector('.custom-product-detail-overlay')

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
    const selectedSize = sizeSelect.value

    const colors = getColorsBySize(product, selectedSize)

    renderColors(colors)
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
  const sizes = getSizes(product)

  renderSizes(sizes)

  const defaultSize = sizes[0]

  if (!defaultSize) return

  const colors = getColorsBySize(product, defaultSize)

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

  const sizeSelect = productDetail.querySelector(
    '.custom-product-detail__size-select'
  )
  if (!sizeSelect) return

  sizeSelect.innerHTML = ''

  const placeholder = document.createElement('option')

  placeholder.value = ''
  placeholder.textContent = 'Choose your size'
  placeholder.disabled = true
  placeholder.selected = true

  sizeSelect.appendChild(placeholder)

  sizes.forEach((size, index) => {
    const option = document.createElement('option')

    option.value = size
    option.textContent = size

    sizeSelect.appendChild(option)

    if (index === 0) {
      option.selected = true
    }
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

  colors.forEach(color => {
    const button = document.createElement('button')
    button.classList.add('custom-product-detail__color-button')

    const preview = document.createElement('span')
    preview.classList.add('custom-product-detail__color-preview')

    preview.style.backgroundColor = color.toLowerCase()

    button.appendChild(preview)
    button.append(color)

    colorContainer.appendChild(button)
  })
}
