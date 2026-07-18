/** @type {NodeListOf<HTMLButtonElement>} */
const popupButtons = document.querySelectorAll('.custom-popup__button')

const productDetail = document.querySelector('.custom-product-detail')

popupButtons.forEach(button => {
  button.addEventListener('click', () => {
    const productData = button.dataset.product

    if (!productData) return
    console.log(productData)

    const product = JSON.parse(productData)

    console.log(product)

    openProductDetail(product)
  })
})

/**
 * @param {{
 * title:string,
 * description:string,
 * price:number
 * }} product
 */
function openProductDetail (product) {
  if (!productDetail) return
  productDetail.classList.add('is-open')

  const title = productDetail.querySelector('.custom-product-detail__title')

  const description = productDetail.querySelector(
    '.custom-product-detail__description'
  )

  const price = productDetail.querySelector('.custom-product-detail__price')

  if (!title || !description || !price) return

  title.textContent = product.title

  description.innerHTML = product.description

  price.textContent = `$${product.price}`
}
