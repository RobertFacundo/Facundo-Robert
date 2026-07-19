/*
 * ------------------------------------
 * Mobile Navigation Toggle
 * ------------------------------------
 *
 * Handles the mobile burger menu state by:
 * - Opening and closing the dropdown menu.
 * - Updating the aria-expanded attribute for accessibility.
 */
document.addEventListener('DOMContentLoaded', () => {
  // DOM elements
  const burgerButton = document.querySelector('.custom-banner__burger')
  const dropdown = document.querySelector('.custom-banner__dropdown')
  const burgerIcon = document.querySelector('.custom-banner__burger-icon')
  const closeIcon = document.querySelector('.custom-banner__close-icon')

  // Guard clauses
  if (!(burgerButton instanceof HTMLElement)) return
  if (!(dropdown instanceof HTMLElement)) return
  if (!(burgerIcon instanceof HTMLElement)) return
  if (!(closeIcon instanceof HTMLElement)) return

  // Toggle dropdown visibility
  burgerButton.addEventListener('click', () => {
    const isOpen = dropdown?.classList.toggle('is-open')

    dropdown.classList.toggle('is-active')

    burgerButton?.setAttribute('aria-expanded', String(isOpen))
  })
})
