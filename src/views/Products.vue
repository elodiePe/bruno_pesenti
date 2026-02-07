<template>
  <div class="boxes">
    <div class="box">
      <h1>{{ $t("products.title") || "Our Products" }}</h1>
      
      <div class="introduction">
        <!-- Search Bar -->
        <div class="filters">
          <div class="search-container">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input 
              v-model="searchQuery" 
              type="text" 
              :placeholder="$t('products.searchPlaceholder')"
              class="search-box"
            >
          </div>
          <RouterLink to="/cart" class="cart-link">
            <svg class="cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span v-if="cart.length" class="cart-count">{{ cart.length }}</span>
          </RouterLink>
        </div>

        <!-- Tag Filters -->
        <div class="tag-filters" v-if="allTags.length">
          <button 
            v-for="tag in allTags" 
            :key="tag"
            @click="toggleTag(tag)"
            :class="['tag-filter-btn', { active: selectedTags.includes(tag) }]"
          >
            {{ tag }}
          </button>
        </div>

        <!-- Loading & Error States -->
        <div v-if="loading" class="no-products">{{ $t('products.loading') }}</div>
        <div v-else-if="error" class="no-products" style="color: red;">{{ error }}</div>

        <!-- Products Grid -->
        <div v-else class="products-grid">
          <div 
            v-for="product in paginatedProducts" 
            :key="product._id"
            class="product-card"
          >
            <!-- Note: Utilisation de _id pour MongoDB -->
            <RouterLink 
              :to="{ name: 'ProductDetail', params: { id: product._id } }"
              class="product-link"
            >
              <div class="image-container">
                <div v-if="loadingImages[product._id]" class="image-loader">
                  <div class="spinner"></div>
                </div>
                <img 
                  :src="getProductImage(product)" 
                  :alt="product.title" 
                  class="product-image"
                  @load="onImageLoad(product._id)"
                  @error="onImageError(product._id)"
                  :style="{ opacity: loadingImages[product._id] ? 0 : 1 }"
                >
              </div>
              <h3>{{ product.title }}</h3>
              <p class="description">
                <span v-if="!getYoutubeUrl(product.description)">{{ truncateDescription(product.description) }}</span>
                <span v-else>
                  {{ truncateDescription(product.description.replace(getYoutubeUrl(product.description), '')) }}
                  <div class="youtube-video">
                    <iframe
                      :src="getYoutubeEmbedUrl(getYoutubeUrl(product.description))"
                      frameborder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowfullscreen
                      width="100%"
                      height="220"
                    ></iframe>
                  </div>
                </span>
              </p>
            </RouterLink>

            <p class="price" v-if="product.price">CHF {{ product.price }}</p>
            
            <button 
              v-if="isInCart(product._id)"
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
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="!loading && !error && filteredProducts.length > 0" class="pagination-container">
          <button 
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="pagination-btn"
          >
            <span class="arrow">←</span><span class="pagination-text">{{ $t('products.previous') }}</span>
          </button>
          
          <div class="pagination-info">
            {{ $t('products.page') }} {{ currentPage }} {{ $t('products.of') }} {{ totalPages }}
          </div>
          
          <button 
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="pagination-btn"
          >
            <span class="pagination-text">{{ $t('products.next') }}</span><span class="arrow">→</span>
          </button>
        </div>

        <p v-if="!loading && !error && filteredProducts.length === 0" class="no-products">
          {{ $t('products.noProducts') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { RouterLink } from 'vue-router'
import { api } from '../services/api.js'
import { loadCart, saveCart } from '../utils/localStorage.js'

export default {
  name: 'Products',
  components: {
    RouterLink
  },
  data() {
    return {
      searchQuery: '',
      products: [],
      cart: [],
      selectedTags: [],
      loading: true,
      error: '',
      currentPage: 1,
      itemsPerPage: 10,
      loadingImages: {} // Track which images are loading
    }
  },
  computed: {
    allTags() {
      const tags = new Set()
      this.products.forEach(product => {
        if (Array.isArray(product.tags)) {
          product.tags.forEach(tag => tags.add(tag))
        }
      })
      return Array.from(tags).sort()
    },
    filteredProducts() {
      if (!this.products) return []
      
      return this.products.filter(p => {
        // 1. Filtre disponibilité (MongoDB renvoie souvent true/false)
        if (p.disponible === false) return false
        
        const searchTerm = this.searchQuery.toLowerCase()
        
        // Sécurité avec l'optional chaining ?. pour les champs MongoDB
        const titleMatch = p.title?.toLowerCase().includes(searchTerm) || false
        const descriptionMatch = p.description?.toLowerCase().includes(searchTerm) || false
        const tagsMatch = p.tags?.some(tag => tag.toLowerCase().includes(searchTerm)) || false
        
        const searchMatches = titleMatch || descriptionMatch || tagsMatch
        
        // 2. Filtre par tags sélectionnés
        if (this.selectedTags.length > 0) {
          const hasSelectedTag = p.tags?.some(tag => this.selectedTags.includes(tag))
          return searchMatches && hasSelectedTag
        }
        
        return searchMatches
      })
    },
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredProducts.slice(start, end)
    },
    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.itemsPerPage)
    }
  },
  methods: {
    async loadProducts() {
      try {
        this.loading = true
        this.error = ''
        // On appelle votre service api.js qui utilise les variables d'environnement
        const response = await api.getProducts()
        
        // Adaptation selon la structure habituelle des retours API
        if (response.success) {
          this.products = response.data
        } else {
          // Si l'API renvoie directement le tableau
          this.products = Array.isArray(response) ? response : []
        }
      } catch (error) {
        this.error = 'Failed to load products from Atlas: ' + error.message
        console.error('Atlas Loading Error:', error)
      } finally {
        this.loading = false
      }
    },
    addToCart(product) {
      // Utilisation de _id (MongoDB standard)
      if (!this.cart.some(item => item._id === product._id)) {
        this.cart.push({ ...product })
        this.updateLocalStorage()
        this.$emit('add-to-cart', product)
      }
    },
    isInCart(productId) {
      return this.cart.some(item => item._id === productId)
    },
    getProductImage(product) {
      // Gestion des URLs stockées en base
      if (product.image) return product.image
      if (product.images && product.images.length > 0) return product.images[0]
      return 'https://via.placeholder.com/300x200?text=No+Image'
    },
    truncateDescription(text, maxLength = 80) {
      if (!text) return ''
      return text.length <= maxLength ? text : text.substring(0, maxLength) + '...'
    },
    getYoutubeUrl(text) {
      if (!text) return null;
      const urlRegex = /(https?:\/\/(www\.)?youtube\.com\/watch\?v=[^\s]+|https?:\/\/(www\.)?youtu\.be\/[^\s]+)/;
      const match = text.match(urlRegex);
      return match ? match[0] : null;
    },
    getYoutubeEmbedUrl(url) {
      if (!url) return '';
      // Convert youtube.com/watch?v=... or youtu.be/... to embed URL
      let videoId = '';
      if (url.includes('youtube.com/watch?v=')) {
        videoId = url.split('watch?v=')[1].split('&')[0];
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
      }
      return `https://www.youtube.com/embed/${videoId}`;
    },
    toggleTag(tag) {
      const index = this.selectedTags.indexOf(tag)
      if (index > -1) {
        this.selectedTags.splice(index, 1)
      } else {
        this.selectedTags.push(tag)
      }
      this.currentPage = 1 // Réinitialiser à la page 1
    },
    loadCart() {
      try {
        this.cart = loadCart()
      } catch (error) {
        console.error('[Products] Error loading cart:', error)
        localStorage.removeItem('cart')
        this.cart = []
      }
    },
    updateLocalStorage() {
      saveCart(this.cart)
    },
    onImageLoad(productId) {
      this.loadingImages[productId] = false
    },
    onImageError(productId) {
      this.loadingImages[productId] = false
    },
    initializeImageLoading() {
      // Initialize all images as loading
      this.paginatedProducts.forEach(product => {
        this.loadingImages[product._id] = true
      })
    }
  },
  mounted() {
    this.loadProducts()
    this.loadCart()
  },
  watch: {
    searchQuery() {
      this.currentPage = 1 // Réinitialiser à la page 1 lors de la recherche
    },
    paginatedProducts() {
      this.initializeImageLoading()
    }
  }
}
</script>


<style scoped>
/* Container structure matching Accueil.vue */
.boxes {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.box {
  text-align: center;
  line-height: 1.6;
  width: 100%;
  background-color: #ffffff;
  padding-left: 5%;
  padding-right: 5%;
  padding-top: 3%;
  padding-bottom: 3%;
  align-items: center;
}

.box h1 {
  text-align: left;
  color: #333;
  margin-bottom: 30px;
  font-size: 2rem;
}

/* Introduction section with responsive layout */
.introduction {
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* Filter section */
.filters {
  margin-bottom: 30px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 15px;
  align-items: center;
  width: 100%;
}

.search-container {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center;
  max-width: 350px;
}

.search-icon {
  position: absolute;
  left: 12px;
  width: 20px;
  height: 20px;
  color: #999;
  pointer-events: none;
  z-index: 1;
}

.search-box {
  padding: 12px 12px 12px 40px;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.search-box:focus {
  outline: none;
  border-color: #4c6a65;
  box-shadow: 0 0 0 3px rgba(76, 106, 101, 0.1);
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

/* Tag Filters */
.tag-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
  justify-content: center;
}

.tag-filter-btn {
  padding: 8px 16px;
  background-color: #f5f5f5;
  color: #333;
  border: 2px solid #e0e0e0;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.tag-filter-btn:hover {
  border-color: #4c6a65;
  background-color: #f0f0f0;
}

.tag-filter-btn.active {
  background-color: #deb887;
  color: #000000;
  border-color: #deb887;
}

.no-products {
  text-align: center;
  color: #999;
  font-size: 1.1rem;
  padding: 40px 20px;
}

/* Responsive grid */
.products-grid {
  display: grid;
  gap: 40px;
  width: 100%;
  margin-top: 20px;
}

/* Mobile: 1 column */
@media (max-width: 640px) {
  .box {
    padding-left: 3%;
    padding-right: 3%;
    padding-top: 5%;
    padding-bottom: 5%;
    width: 100%;
    max-width: 100%;
    margin: 0 auto;
    box-sizing: border-box;
  }

  .box h1 {
    font-size: 1.5rem;
    margin-bottom: 20px;
  }

  .filters {
    flex-direction: column;
    gap: 12px;
    align-items: center;
  }

  .search-container {
    width: 100%;
    justify-content: center;
    max-width: 100%;
  }

  .search-box {
    width: 100%;
    max-width: 100%;
  }

  .cart-link {
    width: 45px;
    height: 45px;
  }

  .tag-filters {
    gap: 8px;
  }

  .tag-filter-btn {
    padding: 6px 12px;
    font-size: 0.85rem;
  }

  .products-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .product-card {
    width: 100%;
    padding: 15px;
  }

  .image-container {
    height: 200px;
  }

  .product-link {
    margin-bottom: 10px;
  }

  .product-card h3 {
    font-size: 1.1rem;
    margin: 8px 0;
  }

  .description {
    font-size: 0.9rem;
    margin: 6px 0;
  }

  .price {
    font-size: 1.2rem;
    margin: 10px 0;
 
  }

  .add-btn,
  .add-btn.in-cart,
  .add-btn.disabled {
    font-size: 0.9rem;
    padding: 12px;
  }

  .add-btn,
  .add-btn.in-cart,
  .add-btn.disabled {
    width: 100%;
  }
}

/* Tablet: 2 columns */
@media (min-width: 641px) and (max-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
gap: 50px 30px;

  }

  .search-container {
    max-width: 320px;
  }

  .search-box {
    width: 100%;
  }

  .product-card {
    width: 100%;
  }
}

/* Desktop: 3 columns */
@media (min-width: 1025px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
    gap:50px 40px;

  }

  .search-container {
    max-width: 350px;
  }

  .search-box {
    width: 100%;
  }
}

/* Product card styling */
.product-card {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  width: 90%;
  flex-direction: column;
  height: 100%;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  ;
}

.product-card:hover {

  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
  
}

.product-link {
  text-decoration: none;
  color: inherit;
  display: block;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.product-link:visited {
  text-decoration: none;
}

.product-link:hover {
  text-decoration: none;
}

.product-link:hover h3 {
  color: #4c6a65;
}

.image-container {
  position: relative;
  width: 100%;
  height: 200px;
  background-color: #f5f5f5;
  border-radius: 6px;
  margin-bottom: 12px;
  overflow: hidden;
}

.image-loader {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  z-index: 1;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e0e0e0;
  border-top-color: #4c6a65;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.product-link:hover .product-image {
  transform: scale(1.02);
}

.product-card h3 {
  color: #333;
  margin: 10px 0;
  font-size: 1.1rem;
  text-align: left;
  transition: color 0.3s ease;
}

.description {

  color: #666;
  font-size: 0.95rem;
  margin: 8px 0;
  text-align: left;
  line-height: 1.4;
}
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 10px 0;
  justify-content: flex-start;
}

.tag {
  display: inline-block;
  background-color: #f0f0f0;
  color: #4c6a65;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.price {
  font-size: 1.4rem;
  font-weight: bold;
  color: #4c6a65;
  margin: 0px 0;
  text-align: right;
}

/* Button styling matching the design system */
.add-btn {
  padding: 12px 20px;
  background-color: #deb887;
  color: #000000;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  margin-top: auto;
  width: 100%;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.add-btn:hover:not(.disabled):not(.in-cart) {
  background-color: #816b4f;
  color: #ffffff;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.add-btn:active:not(.disabled):not(.in-cart) {
  transform: translateY(0);
}

.add-btn.disabled {
  background-color: #ccc;
  color: #666;
  cursor: not-allowed;
  opacity: 0.6;
}

.add-btn.in-cart {
  background-color: #4c6a65;
  color: #deb887;
  cursor: default;
}

/* Pagination styles */
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 40px;
  padding: 20px;
}

.pagination-btn {
  padding: 10px 20px;
  background-color: #deb887;
  color: #000000;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #816b4f;
  color: #ffffff;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.pagination-btn:disabled {
  background-color: #ccc;
  color: #666;
  cursor: not-allowed;
  opacity: 0.6;
}

.pagination-info {
  font-size: 1rem;
  color: #4c6a65;
  font-weight: 600;
  min-width: 150px;
  text-align: center;
}

/* Responsive button and pagination fix for mobile */
@media (max-width: 640px) {
  .add-btn {
    padding: 10px 16px;
    font-size: 0.95rem;
  }
  .products-grid {
    grid-template-columns: repeat(1, 1fr);
    gap: 40px 20px;
  }
  .product-card {
    padding: 12px;
    width: 90%;
  }
  .image-container {
    height: 180px;
  }
  .pagination-container {
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 20px;
    padding: 10px;
  }
  .pagination-btn {
    min-width: 48px;
    font-size: 1.2rem;
    padding: 10px 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .pagination-btn .pagination-text {
    display: none;
  }
  .pagination-info {
    min-width: 100px;
    font-size: 0.95rem;
    margin: 0 4px;
  }
}
</style>