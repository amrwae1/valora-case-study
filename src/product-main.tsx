import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ProductApp from './product/ProductApp'
import './product/product.css'

createRoot(document.getElementById('product-root')!).render(
  <StrictMode>
    <ProductApp />
  </StrictMode>,
)
