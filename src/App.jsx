import { useEffect, useRef, useState } from 'react'
import CartDrawer from './components/CartDrawer.jsx'
import CustomerModal from './components/CustomerModal.jsx'
import OrderConfirmation from './components/OrderConfirmation.jsx'
import ProductCard from './components/ProductCard.jsx'
import { categories, products } from './data/products.js'
import './burgerhaus.css'

const categoryTitles = Object.fromEntries(
  categories.map(({ id, title }) => [id, title]),
)

function getQuantity(items) {
  return items.reduce((sum, item) => sum + item.quantity, 0)
}

function getTotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

function App() {
  const [customer, setCustomer] = useState(null)
  const [activeCategory, setActiveCategory] = useState('combos')
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [order, setOrder] = useState(null)
  const [toast, setToast] = useState('')
  const cartButtonRef = useRef(null)
  const restoreCartFocus = useRef(false)
  const toastTimer = useRef(null)
  const siteBlocked = !customer || Boolean(order) || cartOpen
  const visibleProducts = products.filter(
    (product) => product.category === activeCategory,
  )
  const itemCount = getQuantity(cart)
  const cartTotal = getTotal(cart)

  useEffect(() => () => window.clearTimeout(toastTimer.current), [])

  useEffect(() => {
    if (!order && restoreCartFocus.current) {
      cartButtonRef.current?.focus()
      restoreCartFocus.current = false
    }
  }, [order])

  function addToCart(product) {
    const existingItem = cart.find((item) => item.id === product.id)
    const nextCart = existingItem
      ? cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      : [...cart, { ...product, quantity: 1 }]

    setCart(nextCart)
    setToast(
      `Producto agregado: ${product.name}. Total ${getTotal(nextCart)} Bs.`,
    )
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(''), 2200)
  }

  function changeQuantity(productId, change) {
    setCart((currentCart) =>
      currentCart.flatMap((item) => {
        if (item.id !== productId) return [item]
        const quantity = item.quantity + change
        return quantity > 0 ? [{ ...item, quantity }] : []
      }),
    )
  }

  function removeFromCart(productId) {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== productId),
    )
  }

  function submitOrder() {
    if (cart.length === 0 || !customer) return

    const code = Math.floor(100000 + Math.random() * 900000)
    const total = getTotal(cart)
    const message = [
      `Hola, quiero realizar este pedido Burgerhaus (${code}).`,
      '',
      `Nombre: ${customer.name}`,
      `Teléfono: ${customer.phone}`,
      `Tipo: ${customer.type}`,
      ...(customer.type === 'Para Mesa' ? [`Mesa: ${customer.table}`] : []),
      '',
      ...cart.map(
        (item) =>
          `- ${item.name} x${item.quantity}: ${item.price * item.quantity} Bs`,
      ),
      '',
      `Total: ${total} Bs`,
    ].join('\n')

    setOrder({
      code,
      customer,
      items: cart,
      total,
      whatsappUrl: `https://wa.me/59162701097?${new URLSearchParams({ text: message })}`,
    })
  }

  function closeOrder() {
    restoreCartFocus.current = true
    setOrder(null)
    setCart([])
    setCartOpen(false)
  }

  const welcomeText = customer
    ? `Hola ${customer.name}. Pedido configurado para (${customer.type}${customer.type === 'Para Mesa' ? `, mesa ${customer.table}` : ''}). Disfruta lo mejor de Burgerhaus & Café.`
    : 'Sabor artesanal incomparable, papas crocantes, cafetería y postres preparados al instante.'

  return (
    <>
      <div
        className="site-content"
        inert={siteBlocked}
        aria-hidden={siteBlocked}
      >
        <nav className="top-nav" aria-label="Navegación principal">
          <div className="brand-logo-container">
            <div className="brand-logo-img" aria-hidden="true">
              BH
            </div>
            <div className="brand-logo-text">
              BURGERHAUS <span>&amp; CAFÉ</span>
            </div>
          </div>
          <button
            ref={cartButtonRef}
            className="cart-pill"
            type="button"
            aria-label={`Carrito: ${itemCount} ${itemCount === 1 ? 'producto' : 'productos'}`}
            aria-expanded={cartOpen}
            aria-controls="cartDrawer"
            onClick={() => setCartOpen(true)}
          >
            <i className="fa-solid fa-cart-shopping" aria-hidden="true" />
            <span>{itemCount}</span>
          </button>
        </nav>

        <header className="hero-banner">
          <div className="hero-content">
            <div className="hero-text">
              <h1>LAS MEJORES HAMBURGUESAS</h1>
              <p>{welcomeText}</p>
              <div className="hero-categories" aria-label="Categorías del menú">
                {categories.map((category) => (
                  <button
                    className={`cat-btn-hero${activeCategory === category.id ? ' active' : ''}`}
                    type="button"
                    key={category.id}
                    aria-pressed={activeCategory === category.id}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="hero-img-box">
              <img
                src="https://pngimg.com/uploads/burger_sandwich/burger_sandwich_PNG4135.png"
                className="main-burger"
                alt="Hamburguesa Burgerhaus"
              />
            </div>
          </div>
        </header>

        <main className="menu-section">
          <h2 className="section-title" id="categoryTitle">
            {categoryTitles[activeCategory]}
          </h2>
          <div className="sr-only" role="status" aria-live="polite">
            {visibleProducts.length} productos en {categoryTitles[activeCategory]}.
          </div>
          <div className="products-grid">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAdd={() => addToCart(product)}
              />
            ))}
          </div>
        </main>

        <footer className="site-footer">
          <div className="footer-title">BURGERHAUS &amp; CAFÉ</div>
          <div className="footer-thanks">¡Gracias por tu compra!</div>
          <div className="footer-socials">
            <a
              href="https://www.instagram.com/burgerhaus.cafe?igsh=MXh0NDJ6MjQ1cmYyeA=="
              target="_blank"
              rel="noreferrer"
              className="social-link"
              title="Instagram de Burgerhaus"
              aria-label="Instagram de Burgerhaus"
            >
              <i className="fa-brands fa-instagram" aria-hidden="true" />
            </a>
            <a
              href="https://wa.me/59162701097"
              target="_blank"
              rel="noreferrer"
              className="social-link"
              title="WhatsApp de Burgerhaus"
              aria-label="WhatsApp de Burgerhaus"
            >
              <i className="fa-brands fa-whatsapp" aria-hidden="true" />
            </a>
          </div>
          <div className="footer-copy">
            © Burgerhaus &amp; Café. Todos los derechos reservados.
          </div>
        </footer>
      </div>

      {!customer && <CustomerModal onComplete={setCustomer} />}
      {order && <OrderConfirmation order={order} onClose={closeOrder} />}
      <div
        className={`add-confirmation${toast ? ' visible' : ''}`}
        role="status"
        aria-live="polite"
      >
        {toast}
      </div>
      <CartDrawer
        cart={cart}
        total={cartTotal}
        itemCount={itemCount}
        isOpen={cartOpen && !order}
        onClose={() => setCartOpen(false)}
        onChangeQuantity={changeQuantity}
        onRemove={removeFromCart}
        onSubmitOrder={submitOrder}
      />
    </>
  )
}

export default App
