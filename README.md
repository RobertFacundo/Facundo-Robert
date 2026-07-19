# 🛍️ Shopify Custom Product Challenge

Implementation of a custom Shopify page based on the provided Figma design.

🔗 Preview:
https://facundo-robert-48-teststore.myshopify.com/pages/challenge

## 📌 Overview

This project was built on top of the Shopify Dawn theme and recreates the requested page using custom Shopify sections, snippets, styles and JavaScript.

The goal was to create a pixel-perfect implementation while avoiding Dawn's default sections and components.

## ✨ Features

- 🎨 Custom responsive banner section
- 🛒 Custom product grid section
- 🪟 Custom product detail modal
- 🎛️ Variant selection (size and color)
- 🔄 Dynamic product data rendering
- ➕ Custom add-to-cart integration
- 🛍️ Shopify cart drawer synchronization
- 📱 Responsive desktop/mobile layouts

## 🏗️ Shopify Architecture

The implementation uses:

- Liquid custom sections
- Liquid custom snippets
- Theme assets (CSS/JS/SVG/fonts)
- Shopify Cart API
- Shopify Section Rendering API
- Dawn theme cart events

## 🛒 Cart Integration

The custom add-to-cart flow:

1. Adds selected variants through Shopify Cart API
2. Requests updated cart sections
3. Retrieves updated cart state
4. Dispatches Shopify's `CartLinesUpdateEvent`
5. Allows Dawn components to refresh automatically

This keeps the custom implementation synchronized with the native Shopify cart drawer behavior.

## 🌱 Development Workflow

Branches:

- `development` - feature development
- `master` - production/final version

Changes were developed through feature commits and merged using pull requests.

## 📝 Notes

The project was created as part of a Shopify developer technical assessment.
