document.addEventListener('DOMContentLoaded', () => {
  const burgerButton = document.querySelector('.custom-banner__burger')
  const dropdown = document.querySelector('.custom-banner__dropdown')
  const burgerIcon = document.querySelector('.custom-banner__burger-icon')
  const closeIcon = document.querySelector('.custom-banner__close-icon')

  if (!(burgerButton instanceof HTMLElement)) return
  if (!(dropdown instanceof HTMLElement)) return
  if (!(burgerIcon instanceof HTMLElement)) return
  if (!(closeIcon instanceof HTMLElement)) return

  burgerButton.addEventListener('click', () => {
    const isOpen = dropdown?.classList.toggle('is-open')

    dropdown.classList.toggle('is-active')

    burgerButton?.setAttribute('aria-expanded', String(isOpen))
  })
})
