<template>
  <div class="boxes">
    <div class="box">
      <RouterLink to="/produits" class="back-link">← {{ $t('products.backToProducts') }}</RouterLink>
      
      <div class="introduction product-detail" v-if="product">
        <!-- LEFT COLUMN: IMAGES -->
        <div class="product-gallery">
          <div class="main-image-container">
            <img 
              :src="activeImage" 
              :alt="product.title" 
              class="main-image"
            >
          </div>
          
          <!-- THUMBNAILS (Only shown if more than 1 image) -->
          <div class="thumbnails-grid" v-if="product.images && product.images.length > 1">
            <div 
              v-for="(img, index) in product.images" 
              :key="index"
              class="thumbnail-wrapper"
              :class="{ active: activeImageIndex === index }"
              @click="activeImageIndex = index"
            >
              <img :src="img" :alt="product.title + ' view ' + index">
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: INFO -->
        <div class="product-info">
          <h1>{{ product.title }}</h1>
          
          <div class="description-wrapper">
            <p class="description">{{ getDisplayDescription() }}</p>
            <button 
              v-if="product.description && product.description.length > 200"
              @click="descriptionExpanded = !descriptionExpanded"
              class="read-more-btn"
            >
              {{ descriptionExpanded ? 'Réduire' : 'Lire plus' }}
            </button>
          </div>

          <div class="tags" v-if="product.tags && product.tags.length">
            <span v-for="tag in product.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>

          <div class="product-meta">
            <p class="price" v-if="product.price">
              <strong>{{ $t('products.price') }}:</strong> CHF {{ product.price }}
            </p>
            <p class="date" v-if="product.date">
              <strong>{{ $t('products.ref') }}:</strong> {{ formatDate(product.date) }}
            </p>
          </div>

          <div class="product-actions">
            <button 
              v-if="isInCart"
              class="add-btn in-cart"
              disabled
            >
              {{ $t('products.inCart') }}
            </button>
            <button 
              v-else-if="product.disponible" 
              @click="addToCart(product)" 
              class="add-btn"
            >
              {{ $t('products.addToCart') }}
            </button>
            <button v-else class="add-btn disabled" disabled>
              {{ $t('products.notAvailable') }}
            </button>

            <!-- See Cart Button -->
           <RouterLink to="/cart" class="cart-link" >
            <svg class="cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span v-if="cart.length" class="cart-count">{{ cart.length }}</span>
          </RouterLink>
          </div>

          <div class="contact-section" v-if="product.contact">
            <p><strong>{{ $t('products.contact') }}:</strong> <a :href="`mailto:${product.contact}`">{{ product.contact }}</a></p>
          </div>
        </div>
      </div>

      <div v-else class="no-product-state">
        <p v-if="loading">{{ $t('products.loadingDetails') }}</p>
        <p v-else>{{ $t('products.notFound') }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { RouterLink } from 'vue-router'
import { api } from '../services/api.js'
import { loadCart, saveCart } from '../utils/localStorage.js'

export default {
  name: 'ProductDetail',
  components: { RouterLink },
  data() {
    return {
      product: null,
      cart: [],
      loading: true,
      error: '',
      activeImageIndex: 0, // Track which image is being viewed
      descriptionExpanded: false // Track if description is expanded
    }
  },
  computed: {
    isInCart() {
      return this.cart.some(item => item._id === this.product?._id)
    },
    activeImage() {
      if (this.product?.images && this.product.images.length > 0) {
        return this.product.images[this.activeImageIndex]
      }
      return 'https://placehold.co/600x400?text=No+Image'
    }
  },
  methods: {
    async loadProduct() {
      try {
        this.loading = true
        const productId = this.$route.params.id
        const response = await api.getProduct(productId)
        if (response.success) {
          this.product = response.data
        }
      } catch (error) {
        console.error('Error loading product:', error)
      } finally {
        this.loading = false
      }
    },
    formatDate(dateString) {
      if (!dateString) return ''
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return new Date(dateString).toLocaleDateString('en-US', options)
    },
    getDisplayDescription() {
      const desc = this.product?.description || ''
      if (desc.length <= 200) return desc
      if (this.descriptionExpanded) return desc
      return desc.substring(0, 200) + '...'
    },
    addToCart(product) {
      if (!this.cart.some(item => item._id === product._id)) {
        this.cart.push({ ...product })
        saveCart(this.cart)
        this.$emit('add-to-cart', product)
      }
    },
    loadCart() {
      try {
        // First, forcefully check and clean localStorage
        const cartItem = localStorage.getItem('cart')
        if (cartItem) {
          const trimmed = cartItem.trim()
          // If it doesn't look like valid JSON, remove it
          if (!trimmed.startsWith('[') && !trimmed.startsWith('{')) {
            console.warn('[ProductDetail] Removing corrupted cart:', cartItem)
            localStorage.removeItem('cart')
            this.cart = []
            return
          }
        }
        // Use safe loader
        this.cart = loadCart()
      } catch (error) {
        console.error('[ProductDetail] Error loading cart:', error)
        localStorage.removeItem('cart')
        this.cart = []
      }
    }
  },
  mounted() {
    this.loadCart()
    this.loadProduct()
  }
}
</script>

<style scoped>
.back-link {
  display: inline-block;
  color: #4c6a65;
  text-decoration: none;
  margin-bottom: 25px;
  font-weight: 600;
  transition: transform 0.2s;
}

.back-link:hover { transform: translateX(-5px); color: #deb887; }

/* LAYOUT GRID */
.product-detail {
  display: grid;
  grid-template-columns: 1.2fr 1fr; /* Image takes slightly more space */
  gap: clamp(20px, 5vw, 60px);
  align-items: start;
}

/* GALLERY STYLES */
.product-gallery {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
}

.main-image-container {
  width: 100%;
  aspect-ratio: 1; /* Keep it square or use 4/3 */
  background: #f8fafc;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #f1f5f9;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: contain; /* Shows full image without cropping */
  display: block;
}

.thumbnails-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
  gap: 10px;
}

.thumbnail-wrapper {
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s;
  background: #f8fafc;
}

.thumbnail-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail-wrapper.active { border-color: #deb887; }
.thumbnail-wrapper:hover { opacity: 0.8; }

/* TEXT INFO STYLES (Fixed for long text) */
.product-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0; /* Important for text wrapping */
  text-align: left;
}

.product-info h1 {
  font-size: clamp(1.5rem, 3vw, 2.5rem);
  font-weight: 800;
  color: #1e293b;
  word-wrap: break-word;
  line-height: 1.2;
}

.description {
  color: #475569;
  font-size: 1.1rem;
  line-height: 1.7;
  word-wrap: break-word;
  white-space: pre-line; /* Respects line breaks from admin input */
  margin: 0;
}

.description-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.cart-link {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border: 2px solid #deb887;
  border-radius: 6px;
  color: #4c6a65;
  text-decoration: none;
  transition: all 0.3s ease;
}

.cart-link:hover {
  background-color: #deb887;
  color: #ffffff;
}

.cart-icon {
  width: 24px;
  height: 24px;
}

.cart-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #4c6a65;
  color: #deb887;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: bold;
}
.read-more-btn {
  background: none;
  border: none;
  color: #4c6a65;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
  transition: color 0.2s;
  align-self: flex-start;
}

.read-more-btn:hover {
  color: #deb887;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  background: #f1f5f9;
  color: #4c6a65;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

/* META & ACTIONS */
.product-meta {
  padding: 20px 0;
  border-top: 1px solid #f1f5f9;
  border-bottom: 1px solid #f1f5f9;
}

.price {
  font-size: 2rem;
  color: #4c6a65;
  font-weight: 800;
  margin-bottom: 5px;
}

.date { font-size: 0.9rem; color: #94a3b8; }

.add-btn {
  width: 100%;
  padding: 18px;
  background: #deb887;
  color: #2c1810;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s;
}

.add-btn:hover:not(:disabled) { background: #c5a375; transform: translateY(-2px); }
.add-btn.in-cart { background: #4c6a65; color: #deb887; }

/* See Cart Button */
.product-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.see-cart-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #4c6a65 0%, #3a4f4a 100%);
  color: #deb887;
  border: 2px solid #deb887;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  text-decoration: none;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  display: block;
}

.see-cart-btn:hover {
  background: linear-gradient(135deg, #3a4f4a 0%, #2c3a36 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(76, 106, 101, 0.3);
}

/* RESPONSIVE */
@media (max-width: 1024px) {
  .product-detail { grid-template-columns: 1fr; }
  .main-image-container { aspect-ratio: 4/3; }
}

@media (max-width: 640px) {
  .box { padding: 20px; }
  .product-info h1 { font-size: 1.8rem; }
}
</style>