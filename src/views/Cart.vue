<template>
  <div class="boxes">
    <div class="box">
      <div class="cart-header">
        <RouterLink to="/produits" class="back-link">← {{ $t('cart.backToProducts') }}</RouterLink>
        <h1>{{ $t('cart.title') }}</h1>
      </div>
      
      <div class="introduction cart-container">
        <div v-if="cart.length > 0" class="cart-content">
          <div class="cart-items">
            <div v-for="item in cart" :key="item._id" class="cart-item">
              <img :src="getProductImage(item)" :alt="item.title" class="item-image">
              <div class="item-details">
                <h3>{{ item.title }}</h3>
                <p class="item-description">{{ truncateDescription(item.description) }}</p>
                <p v-if="item.price" class="item-price">CHF {{ item.price }}</p>
              </div>
              <button @click="removeFromCart(item._id)" class="remove-btn">{{ $t('cart.remove') }}</button>
            </div>
          </div>

          <div class="cart-summary">
            <h2>{{ $t('cart.orderSummary') }}</h2>
            <div class="summary-row total">
              <span>{{ $t('cart.total') }}:</span>
              <span>CHF {{ subtotal.toFixed(2) }}</span>
            </div>
            
            <!-- <div class="terms-section">
              <label class="terms-checkbox">
                <input 
                  type="checkbox" 
                  v-model="termsAccepted"
                  class="checkbox-input"
                >
                <span>{{ $t('cart.termsLabel') }}</span>
              </label>
              <p class="terms-text">{{ $t('cart.termsDescription') }}</p>
            </div> -->
            
            <RouterLink 
              to="/payment-options" 
              class="checkout-btn"
          
              @click="$event.preventDefault()"
            >
              {{ $t('cart.continue') }}
            </RouterLink>
          </div>
        </div>

        <div v-else class="empty-cart">
          <p>{{ $t('cart.empty') }}</p>
          <RouterLink to="/produits" class="continue-shopping">{{ $t('cart.continueShopping') }}</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { RouterLink } from 'vue-router'
import { loadCart, saveCart } from '../utils/localStorage.js'

export default {
  name: 'Cart',
  components: {
    RouterLink
  },
  data() {
    return {
      cart: [],
      termsAccepted: false
    }
  },
  computed: {
    subtotal() {
      return this.cart.reduce((sum, item) => sum + (item.price || 0), 0)
    }
  },
  methods: {
    getProductImage(product) {
      return product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/100'
    },
    truncateDescription(text, maxLength = 100) {
      if (!text) return ''
      if (text.length <= maxLength) return text
      return text.substring(0, maxLength) + '...'
    },
    removeFromCart(productId) {
      const index = this.cart.findIndex(item => item._id === productId)
      if (index > -1) {
        this.cart.splice(index, 1)
        saveCart(this.cart)
      }
    },
    loadCart() {
      this.cart = loadCart()
    }
  },
  mounted() {
    this.loadCart()
  }
}
</script>

<style scoped>
.back-link {
  display: inline-block;
  color: #4c6a65;
  text-decoration: none;
  margin-bottom: 20px;
  font-weight: 500;
  transition: color 0.3s;
}

.back-link:hover {
  color: #deb887;
}

.cart-header {
  order: -1;
  width: 100%;
  margin-bottom: 30px;
}

.cart-header h1 {
  text-align: left;
  color: #333;
  margin: 10px 0 0 0;
  font-size: 2rem;
}

.cart-container {
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

.cart-container h1 {
  text-align: left;
  color: #333;
  margin-bottom: 30px;
  font-size: 2rem;
}

.cart-content {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 30px;
  margin-top: 30px;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cart-item {
  display: flex;
  gap: 20px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #ffffff;
  align-items: flex-start;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.cart-item:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.item-image {
  width: 140px;
  height: 140px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.item-details {
  flex: 1;
}

.item-details h3 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
}

.item-description {
  color: #666;
  font-size: 0.9rem;
  margin: 5px 0;
  line-height: 1.4;
}

.item-price {
  color: #4c6a65;
  font-weight: bold;
  font-size: 1.2rem;
  margin-top: 10px;
}

.remove-btn {
  padding: 8px 16px;
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;
  white-space: nowrap;
  flex-shrink: 0;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.remove-btn:hover {
  background-color: #e63946;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.cart-summary {
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #ffffff;
  height: fit-content;
  position: sticky;
  top: 20px;
}

.cart-summary h2 {
  color: #333;
  font-size: 1.3rem;
  margin: 0 0 20px 0;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  font-size: 0.95rem;
  color: #666;
}

.summary-row.total {
  border-bottom: none;
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
  padding-top: 15px;
  margin-top: 10px;
  padding-top: 15px;
}

.checkout-btn {
  width: 91%;
  margin-left: 0px;
  margin-right: -500px;
  padding: 14px;
  background-color: #deb887;
  color: #000000;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  margin-top: 20px;
  text-decoration: none;
  display: block;
  text-align: center;
  transition: all 0.3s ease;
}

.checkout-btn:hover:not(.disabled) {
  background-color: #816b4f;
  color: #ffffff;
}

.checkout-btn.disabled {
  background-color: #ccc;
  color: #666;
  cursor: not-allowed;
  opacity: 0.6;
}

.terms-section {
  margin: 20px 0;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #deb887;
}

.terms-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  margin-bottom: 10px;
}

.checkbox-input {
  width: 20px;
  height: 20px;
  margin-right: 12px;
  cursor: pointer;
  accent-color: #4c6a65;
}

.terms-checkbox span {
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
}

.terms-text {
  margin: 0;
  font-size: 0.85rem;
  color: #666;
  line-height: 1.5;

  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.checkout-btn:hover {
  background-color: #816b4f;
  color: #ffffff;
}

.empty-cart {
  text-align: center;
  padding: 60px 20px;
}

.empty-cart p {
  color: #999;
  font-size: 1.2rem;
  margin-bottom: 30px;
}

.continue-shopping {
  display: inline-block;
  padding: 12px 30px;
  background-color: #deb887;
  color: #000000;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  transition: all 0.3s ease;
  text-transform: uppercase;
}

.continue-shopping:hover {
  background-color: #816b4f;
  color: #ffffff;
}

/* Responsive */
@media (max-width: 1024px) {
  .cart-content {
    grid-template-columns: 1fr;
  }

  .cart-summary {
    position: static;
  }

  .cart-item {
    gap: 18px;
    padding: 18px;
  }

  .item-image {
    width: 130px;
    height: 130px;
  }

  .remove-btn {
    padding: 7px 14px;
    font-size: 0.85rem;
  }
}

@media (max-width: 768px) {
  .cart-content {
    grid-template-columns: 1fr;
  }

  .cart-summary {
    position: static;
  }

  .cart-item {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
    padding: 15px;
  }

  .item-image {
    width: 100%;
    height: 200px;
  }

  .item-details {
    order: 2;
  }

  .remove-btn {
    width: 100%;
    order: 3;
    margin-top: 10px;
  }
}

@media (max-width: 640px) {
  .cart-container h1 {
    font-size: 1.5rem;
  }

  .cart-item {
    flex-direction: column;
  }

  .item-image {
    width: 100%;
    height: 200px;
  }

  .remove-btn {
    width: 100%;
  }
}
</style>
