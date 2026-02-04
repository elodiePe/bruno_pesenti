/**
 * Safely parse JSON from localStorage with error handling
 * @param {string} key - The localStorage key
 * @param {*} defaultValue - The default value to return if parsing fails
 * @returns {*} The parsed value or defaultValue
 */
export function safeGetLocalStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key)
    if (!item) return defaultValue
    
    // Validate the string before parsing
    if (typeof item !== 'string') return defaultValue
    
    // Check if it looks like JSON (starts with { or [)
    const trimmed = item.trim()
    if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
      console.warn(`[LocalStorage] Item "${key}" doesn't look like JSON, clearing it`)
      localStorage.removeItem(key)
      return defaultValue
    }
    
    const parsed = JSON.parse(item)
    return parsed
  } catch (error) {
    console.error(`[LocalStorage Error] Failed to parse key "${key}":`, error, 'Value was:', localStorage.getItem(key))
    // Clear the corrupted data
    try {
      localStorage.removeItem(key)
    } catch (e) {
      console.error('Failed to remove corrupted localStorage item:', e)
    }
    return defaultValue
  }
}

/**
 * Safely set JSON in localStorage with error handling
 * @param {string} key - The localStorage key
 * @param {*} value - The value to store (will be JSON stringified)
 * @returns {boolean} True if successful, false otherwise
 */
export function safeSetLocalStorage(key, value) {
  try {
    const stringified = JSON.stringify(value)
    localStorage.setItem(key, stringified)
    return true
  } catch (error) {
    console.error(`[LocalStorage Error] Failed to set key "${key}":`, error)
    return false
  }
}

/**
 * Load cart from localStorage with validation and error handling
 * @returns {Array} Array of cart items, empty array if error
 */
export function loadCart() {
  try {
    // First check if cart exists and is valid
    const cartItem = localStorage.getItem('cart')
    
    if (!cartItem) {
      return []
    }
    
    // Check if it looks like valid JSON
    const trimmed = cartItem.trim()
    if (!trimmed.startsWith('[') && !trimmed.startsWith('{')) {
      console.warn('[Cart] Invalid cart data format, clearing')
      localStorage.removeItem('cart')
      return []
    }
    
    const cart = safeGetLocalStorage('cart', [])
    
    // Validate cart is an array
    if (!Array.isArray(cart)) {
      console.warn('[Cart] Invalid cart data: not an array, resetting')
      localStorage.removeItem('cart')
      return []
    }
    
    // Validate and filter cart items
    const validCart = cart.filter(item => {
      return item && 
             typeof item === 'object' && 
             item._id && 
             (item.title || item.name)
    })
    
    // Log if items were removed
    if (validCart.length !== cart.length) {
      console.warn(`[Cart] Removed ${cart.length - validCart.length} invalid items`)
    }
    
    return validCart
  } catch (error) {
    console.error('[Cart] Error loading cart:', error)
    // Clear corrupted cart
    try {
      localStorage.removeItem('cart')
    } catch (e) {
      console.error('[Cart] Failed to clear corrupted cart:', e)
    }
    return []
  }
}

/**
 * Save cart to localStorage
 * @param {Array} cart - Array of cart items
 * @returns {boolean} True if successful, false otherwise
 */
export function saveCart(cart) {
  if (!Array.isArray(cart)) {
    console.error('[Cart] Cannot save: not an array')
    return false
  }
  return safeSetLocalStorage('cart', cart)
}

/**
 * Clear cart from localStorage
 * @returns {boolean} True if successful
 */
export function clearCart() {
  try {
    localStorage.removeItem('cart')
    return true
  } catch (error) {
    console.error('[Cart] Failed to clear cart:', error)
    return false
  }
}
