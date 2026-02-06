<template>
  <div class="boxes">
    <div class="box">
      <div class="payment-header">
        <RouterLink to="/cart" class="back-link">← {{ $t('payment.backToCart') || 'Retour au panier' }}</RouterLink>
        <h1>{{ $t('payment.reservationTitle') || 'Finaliser votre réservation' }}</h1>
      </div>
      
     <div class="introduction payment-container">
        <div class="payment-wrapper">
          
        <div class="steps-container">
            
            <!-- <div class="step-section" :class="{ 
              active: currentStep === 1, 
              completed: currentStep > 1,
              collapsed: currentStep > 1 
            }">
              <div class="step-header" @click="currentStep > 1 && editStep(1)">
                <div class="step-number">1</div>
                <h3 class="step-title">{{ $t('payment.emailLabel') || 'Informations de contact' }}</h3>
                <span v-if="currentStep > 1" class="step-check">✓</span>
              </div>
              <div class="step-content" v-show="currentStep === 1">
                <div class="form-group">
                  <label for="email">{{ $t('payment.emailLabel') || 'Email' }} *</label>
                  <input 
                    id="email"
                    v-model="reservationData.email"
                    type="email"
                    :placeholder="$t('payment.emailPlaceholder') || 'votre@email.com'"
                    class="form-input"
                    required
                    @input="validateStep1"
                  >
                </div>
                
                <div class="form-group">
                  <label for="reservationName">{{ $t('payment.reservationNameLabel') || 'Nom complet' }} *</label>
                  <input 
                    id="reservationName"
                    v-model="reservationData.reservationName"
                    type="text"
                    :placeholder="$t('payment.reservationNamePlaceholder') || 'Jean Dupont'"
                    class="form-input"
                    required
                    @input="validateStep1"
                  >
                </div>
                
                <button 
                  type="button" 
                  class="step-continue-btn"
                  :disabled="!step1Valid"
                  @click="nextStep"
                >
                  Continuer
                </button>
              </div>
              <div class="step-summary" v-if="currentStep > 1">
                <p>{{ reservationData.email }}</p>
                <p>{{ reservationData.reservationName }}</p>
              </div>
            </div>

            <div class="step-section" :class="{ 
              active: currentStep === 2, 
              completed: currentStep > 2,
              collapsed: currentStep > 2,
              disabled: currentStep < 2
            }">
              <div class="step-header" @click="currentStep > 2 && editStep(2)">
                <div class="step-number">2</div>
                <h3 class="step-title">{{ $t('payment.deliveryTypeLabel') || 'Type de livraison' }}</h3>
                <span v-if="currentStep > 2" class="step-check">✓</span>
              </div>
              <div class="step-content" v-show="currentStep === 2">
                <div class="delivery-options">
                  <label class="delivery-option" :class="{ active: reservationData.deliveryType === 'pickup' }">
                    <input 
                      type="radio" 
                      v-model="reservationData.deliveryType" 
                      value="pickup"
                      @change="validateStep2"
                    >
                    <div class="option-content">
                      <div class="option-icon">🏪</div>
                      <div class="option-text">
                        <strong>{{ $t('payment.pickup.title') || 'Retrait en magasin' }}</strong>
                        <span>{{ $t('payment.pickup.description') || 'Paiement cash sur place' }}</span>
                      </div>
                    </div>
                  </label>
                  
                  <label class="delivery-option" :class="{ active: reservationData.deliveryType === 'delivery' }">
                    <input 
                      type="radio" 
                      v-model="reservationData.deliveryType" 
                      value="delivery"
                      @change="validateStep2"
                    >
                    <div class="option-content">
                      <div class="option-icon">📦</div>
                      <div class="option-text">
                        <strong>{{ $t('payment.delivery.title') || 'Livraison en Suisse' }}</strong>
                        <span>{{ $t('payment.delivery.description') || 'Paiement par virement ou Twint + frais de livraison' }}</span>
                      </div>
                    </div>
                  </label>
                </div>
                
                <button 
                  type="button" 
                  class="step-continue-btn"
                  :disabled="!step2Valid"
                  @click="nextStep"
                >
                  Continuer
                </button>
              </div>
              <div class="step-summary" v-if="currentStep > 2">
                <p>{{ reservationData.deliveryType === 'pickup' ? '🏪 Retrait en magasin' : '📦 Livraison en Suisse' }}</p>
              </div>
            </div>

            <div v-if="reservationData.deliveryType === 'delivery'" class="step-section" :class="{ 
              active: currentStep === 3, 
              completed: currentStep > 3,
              collapsed: currentStep > 3,
              disabled: currentStep < 3
            }">
              <div class="step-header" @click="currentStep > 3 && editStep(3)">
                <div class="step-number">3</div>
                <h3 class="step-title">{{ $t('shipping.addressTitle') || 'Adresse de livraison' }}</h3>
                <span v-if="currentStep > 3" class="step-check">✓</span>
              </div>
              <div class="step-content" v-show="currentStep === 3">
                <ShippingAddressForm 
                  v-model="reservationData.shippingAddress"
                  @update:modelValue="validateStep3"
                />

                <div v-if="step3Valid" class="shipping-price-display">
                  <div class="shipping-price-section">
                    <span>{{ $t('payment.shipping') || 'Frais de livraison' }}:</span>
                    <span class="shipping-price-amount">{{ formatCurrency(shippingCost) }} CHF</span>
                  </div>
                </div>
                
                <button 
                  type="button" 
                  class="step-continue-btn"
                  :disabled="!step3Valid"
                  @click="nextStep"
                >
                  Continuer
                </button>
              </div>
              <div class="step-summary" v-if="currentStep > 3">
                <p>{{ reservationData.shippingAddress.firstName }} {{ reservationData.shippingAddress.lastName }}</p>
                <p>{{ reservationData.shippingAddress.street }} {{ reservationData.shippingAddress.streetNumber }}</p>
                <p>{{ reservationData.shippingAddress.postalCode }} {{ reservationData.shippingAddress.city }}</p>
              </div>
            </div>

            <div v-if="reservationData.deliveryType === 'delivery'" class="step-section" :class="{ 
              active: currentStep === 4, 
              completed: currentStep > 4,
              collapsed: currentStep > 4,
              disabled: currentStep < 4
            }">
              <div class="step-header" @click="currentStep > 4 && editStep(4)">
                <div class="step-number">{{ reservationData.deliveryType === 'delivery' ? '4' : '3' }}</div>
                <h3 class="step-title">{{ $t('payment.paymentMethodLabel') || 'Méthode de paiement' }}</h3>
                <span v-if="currentStep > 4" class="step-check">✓</span>
              </div>
              <div class="step-content" v-show="currentStep === 4">
                <div class="payment-method-options">
                  <label class="payment-option" :class="{ active: reservationData.paymentMethod === 'bank-transfer' }">
                    <input 
                      type="radio" 
                      v-model="reservationData.paymentMethod" 
                      value="bank-transfer"
                      @change="validateStep4"
                    >
                    <div class="option-content-small">
                      <div class="option-icon-small">💳</div>
                      <strong>{{ $t('payment.bankTransfer.title') || 'Virement bancaire' }}</strong>
                    </div>
                  </label>
                  
                  <label class="payment-option" :class="{ active: reservationData.paymentMethod === 'twint' }">
                    <input 
                      type="radio" 
                      v-model="reservationData.paymentMethod" 
                      value="twint"
                      @change="validateStep4"
                    >
                    <div class="option-content-small">
                      <div class="option-icon-small">📱</div>
                      <strong>{{ $t('payment.twint.title') || 'Twint' }}</strong>
                    </div>
                  </label>
                </div>
                
                <div v-if="reservationData.paymentMethod" class="payment-instructions">
                  <h4>{{ $t('payment.instructionsTitle') || 'Instructions de paiement' }}</h4>
                            <p>{{ $t('payment.instructionPayment1') }}</p>
                  <p>{{ $t('payment.instructionPayment2') }}</p>

                  <div v-if="reservationData.paymentMethod === 'twint'" class="twint-info">
                  </div>
                </div>
                
                <button 
                  type="button" 
                  class="step-continue-btn"
                  :disabled="!step4Valid"
                  @click="nextStep"
                >
                  Continuer
                </button>
              </div>
              <div class="step-summary" v-if="currentStep > 4">
                <p>{{ reservationData.paymentMethod === 'bank-transfer' ? '💳 Virement bancaire' : '📱 Twint' }}</p>
              </div>
            </div>

            <div class="step-section" :class="{ 
              active: currentStep === finalStep, 
              disabled: currentStep < finalStep
            }">
              <div class="step-header">
                <div class="step-number">{{ finalStep }}</div>
                <h3 class="step-title">{{ $t('payment.termsAccept') || 'Confirmation' }}</h3>
              </div>
              <div class="step-content" v-show="currentStep === finalStep">
                <div class="reservation-terms">
                  <label class="terms-checkbox">
                    <input 
                      v-model="reservationData.termsAccepted"
                      type="checkbox"
                      class="checkbox-input"
                      required
                    >
                    <span>{{ $t('payment.termsAccept') || "J'accepte les conditions de réservation" }}</span>
                  </label>
                  <div class="terms-details">
                    <p>{{ $t('payment.termsDescription') || 'Conditions de réservation:' }}</p>
                    <ul>
                      <li v-if="reservationData.deliveryType==='pickup'">{{ $t('payment.terms1') || 'Réservation valable 14 jours' }}</li>
                      <li v-if="reservationData.deliveryType === 'pickup'">{{ $t('payment.terms3pickup') || 'Paiement cash lors du retrait en magasin' }}</li>
                      <li v-if="reservationData.deliveryType === 'delivery'">{{ $t('payment.terms3delivery') || 'Paiement à effectuer dans les 48h pour valider la commande' }}</li>
                      <li>{{ $t('payment.terms4') || 'Vous recevrez un email de confirmation avec toutes les informations' }}</li>
                    </ul>
                  </div>
                </div>
                
                <button 
                  type="button" 
                  class="reserve-btn"
                  :disabled="!reservationData.termsAccepted || isSubmitting"
                  @click="submitReservation"
                >
                  <span v-if="isSubmitting">{{ $t('payment.reserving') || 'Réservation en cours...' }}</span>
                  <span v-else>{{ $t('payment.reserveNow') || 'Confirmer la réservation' }}</span>
                </button>

                <div v-if="successMessage" class="success-message">
                  {{ successMessage }}
                </div>

                <div v-if="errorMessage" class="error-message">
                  {{ errorMessage }}
                </div>
              </div>
            </div>

          </div> -->
          

          <aside class="order-summary-sidebar">
            <div class="order-summary-card">
              <h3>{{ $t('payment.orderSummary') || 'Résumé de la commande' }}</h3>
              
              <div class="reserved-items">
                <div v-for="item in cart" :key="item.id" class="reserved-item">
                  <img :src="getProductImage(item)" :alt="item.name" class="item-thumbnail">
                  <div class="item-info">
                    <span class="item-name">{{ item.title || item.name }}</span>
                    <span class="item-price">{{ formatCurrency(item.price) }} CHF</span>
                  </div>
                </div>
              </div>

              <div class="summary-divider"></div>

              <div class="form-subtotal">
                <span>{{ $t('payment.subtotal') || 'Sous-total' }}:</span>
                <span class="subtotal-value">{{ formatCurrency(cartTotal) }} CHF</span>
              </div>

              <div v-if="reservationData.deliveryType === 'delivery'" class="form-shipping">
                <div class="shipping-row">
                  <span>{{ $t('payment.shipping') || 'Frais de livraison' }}:</span>
                  <span class="shipping-value">{{ formatCurrency(shippingCost) }} CHF</span>
                </div>
                <div v-if="shippingInfo.error" class="shipping-error">
                  {{ shippingInfo.error }}
                </div>
              </div>

              <div class="summary-divider"></div>

              <div class="form-total">
                <strong>{{ $t('payment.total') || 'Total' }}:</strong>
                <strong class="total-value">{{ formatCurrency(finalTotal) }} CHF</strong>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  </div>
  </div>

  
</template>

<script>
import { RouterLink } from 'vue-router'
import { api } from '../services/api.js'
import ShippingAddressForm from '../components/ShippingAddressForm.vue'
import emailjs from 'emailjs-com'
import { loadCart, saveCart, clearCart } from '../utils/localStorage.js'

export default {
  name: 'PaymentOptions',
  components: {
    RouterLink,
    ShippingAddressForm
  },
  data() {
    return {
      cart: [],
      currentStep: 1,
      FIXED_SHIPPING_COST: 12.00, // Prix fixe de livraison en CHF
      reservationData: {
        email: '',
        reservationName: '',
        termsAccepted: false,
        deliveryType: 'pickup', // 'pickup' or 'delivery'
        paymentMethod: 'cash', // 'cash', 'bank-transfer', 'twint'
        shippingAddress: {
          firstName: '',
          lastName: '',
          street: '',
          streetNumber: '',
          postalCode: '',
          city: '',
          canton: '',
          phone: ''
        }
      },
      isSubmitting: false,
      successMessage: '',
      errorMessage: '',
      shippingCost: 0,
      shippingInfo: {
        label: '',
        isCalculating: false,
        error: null
      },
      step1Valid: false,
      step2Valid: false,
      step3Valid: false,
      step4Valid: false
    }
  },
  computed: {
    cartTotal() {
      return this.cart.reduce((sum, item) => sum + Number(item?.price || 0), 0)
    },
    totalWeight() {
      // Calculate total weight in grams
      return this.cart.reduce((sum, item) => sum + Number(item?.weight || 500), 0)
    },
    finalTotal() {
      return this.cartTotal + this.shippingCost
    },
    finalStep() {
      return this.reservationData.deliveryType === 'delivery' ? 5 : 3
    },
    isFormValid() {
      const basicValid = (
        this.reservationData.email &&
        this.reservationData.reservationName &&
        this.reservationData.termsAccepted &&
        this.cart.length > 0
      )

      // Additional validation for delivery
      if (this.reservationData.deliveryType === 'delivery') {
        const addr = this.reservationData.shippingAddress
        const addressValid = (
          addr.firstName &&
          addr.lastName &&
          addr.street &&
          addr.streetNumber &&
          addr.postalCode &&
          /^[1-9][0-9]{3}$/.test(addr.postalCode) &&
          addr.city &&
          addr.canton &&
          addr.phone
        )
        const paymentValid = ['bank-transfer', 'twint'].includes(this.reservationData.paymentMethod)
        return basicValid && addressValid && paymentValid
      }

      return basicValid
    }
  },
  watch: {
    'reservationData.deliveryType': function(newType) {
      if (newType === 'delivery') {
        // Appliquer le prix fixe de livraison
        this.shippingCost = this.FIXED_SHIPPING_COST
        this.shippingInfo.label = `Livraison en Suisse: ${this.FIXED_SHIPPING_COST.toFixed(2)} CHF`
        this.shippingInfo.error = null
      } else if (newType === 'pickup') {
        this.shippingCost = 0
        this.reservationData.paymentMethod = 'cash'
        this.shippingInfo.label = ''
      }
    }
  },
  methods: {
    formatCurrency(value) {
      const numberValue = Number(value)
      return Number.isFinite(numberValue) ? numberValue.toFixed(2) : '0.00'
    },
    loadCart() {
      try {
        const rawCart = localStorage.getItem('cart')
        
        // If nothing in storage, start fresh
        if (!rawCart) {
          this.cart = []
          return
        }
        
        // Parse it
        this.cart = loadCart()
      } catch (error) {
        console.error('[PaymentOptions] Fatal error loading cart:', error)
        // Clear and reset
        localStorage.removeItem('cart')
        this.cart = []
      }
    },
    getProductImage(product) {
      return product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/80'
    },
    validateStep1() {
      this.step1Valid = !!(this.reservationData.email && 
                           this.reservationData.reservationName &&
                           /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.reservationData.email))
    },
    validateStep2() {
      this.step2Valid = !!this.reservationData.deliveryType
      if (this.reservationData.deliveryType === 'pickup') {
        this.reservationData.paymentMethod = 'cash'
      }
    },
    validateStep3() {
      const addr = this.reservationData.shippingAddress
      this.step3Valid = !!(
        addr.firstName &&
        addr.lastName &&
        addr.street &&
        addr.streetNumber &&
        addr.postalCode &&
        /^[1-9][0-9]{3}$/.test(addr.postalCode) &&
        addr.city &&
        addr.canton &&
        addr.phone
      )
    },
    validateStep4() {
      this.step4Valid = !!(this.reservationData.paymentMethod && 
                           ['bank-transfer', 'twint'].includes(this.reservationData.paymentMethod))
    },
    nextStep() {
      if (this.reservationData.deliveryType === 'pickup') {
        // Skip steps 3 and 4 for pickup
        if (this.currentStep === 1) this.currentStep = 2
        else if (this.currentStep === 2) this.currentStep = 3
      } else {
        // Delivery flow with all steps
        this.currentStep++
      }
    },
    editStep(step) {
      this.currentStep = step
    },

    async submitReservation() {
      if (!this.isFormValid) return

      try {
        this.isSubmitting = true
        this.errorMessage = ''
        this.successMessage = ''

        // Prepare reservation data for API
        const apiPayload = {
          products: this.cart.map(item => ({
            _id: item._id,
            title: item.title,
            price: item.price
          })),
          totalAmount: this.finalTotal,
          reservedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          deliveryType: this.reservationData.deliveryType,
          paymentMethod: this.reservationData.paymentMethod,
          shippingCost: this.shippingCost,
          customerEmail: this.reservationData.email,
          customerName: this.reservationData.reservationName
        }

        // Add shipping address only if delivery
        if (this.reservationData.deliveryType === 'delivery') {
          apiPayload.shippingAddress = this.reservationData.shippingAddress
        }

        // Prepare email payload (avec email et reservationName pour Google Script)
        const emailPayload = {
          email: this.reservationData.email,
          reservationName: this.reservationData.reservationName,
          deliveryType: this.reservationData.deliveryType,
          paymentMethod: this.reservationData.paymentMethod,
          shippingCost: this.shippingCost,
          shippingAddress: this.reservationData.deliveryType === 'delivery' 
            ? this.reservationData.shippingAddress 
            : null,
          products: this.cart.map(item => {
            // Convert relative image URL to absolute URL for email
            let imageUrl = item.images && item.images.length > 0 ? item.images[0] : ''
            if (imageUrl && !imageUrl.startsWith('http')) {
              // Use your deployed site URL - CHANGE THIS TO YOUR ACTUAL DOMAIN
              imageUrl = `https://www.brunopesenti.ch${imageUrl}`
            }
            return {
              _id: item._id,
              title: item.title,
              description: (item.description || '').substring(0, 25),
              imageUrl: imageUrl,
              price: item.price
            }
          })
        }

        // Call API to create reservation
        const response = await api.createReservation(apiPayload)

        if (response.success) {
          // Add orderNumber to email payload
          console.log('Response from API:', response)
          console.log('Response data:', response.data)
          console.log('Order number from response:', response.data?.orderNumber)
          
          const orderNumber = response.data?.orderNumber || 'N/A'
          emailPayload.orderNumber = orderNumber
          
          console.log('Email payload with orderNumber:', emailPayload)
          
          await this.sendReservationEmail(emailPayload)
          this.successMessage = this.$t('payment.reservationSuccess') + 
            (orderNumber !== 'N/A' ? ` (${orderNumber})` : '')
          
          // Clear cart after successful reservation
          clearCart()
          this.cart = []
          
          // Reset form
          this.reservationData = {
            email: '',
            reservationName: '',
            termsAccepted: false,
            deliveryType: 'pickup',
            paymentMethod: 'cash',
            shippingAddress: {
              firstName: '',
              lastName: '',
              street: '',
              streetNumber: '',
              postalCode: '',
              city: '',
              canton: '',
              phone: ''
            }
          }

          // Redirect after 3 seconds
          setTimeout(() => {
            this.$router.push('/produits')
          }, 3000)
        } else {
          this.errorMessage = response.message || this.$t('payment.reservationError')
        }
      } catch (error) {
        this.errorMessage = this.$t('payment.reservationError') + ': ' + error.message
        console.error('Reservation error:', error)
      } finally {
        this.isSubmitting = false
      }
    },
    async sendReservationEmail(reservationPayload) {
      try {
        const url = 'https://script.google.com/macros/s/AKfycbzoBbBSTbb3ZvqdyjJV9hOuSnD8nMg2LZCDH9Wy1qtzJ392m-hKb7kmyLtb8io_AKxtbg/exec'

        const productsJson = JSON.stringify(
          reservationPayload.products.map((p) => ({
            title: p.title,
            description: p.description,
            imageUrl: p.imageUrl,
            price: Number(p.price || 0)
          }))
        )

        // Build body with all new fields
        let body = `action=demandeReservation&Name=${encodeURIComponent(
          reservationPayload.reservationName
        )}&Email=${encodeURIComponent(
          reservationPayload.email
        )}&Produits=${encodeURIComponent(productsJson)}&OrderNumber=${encodeURIComponent(
          reservationPayload.orderNumber
        )}&DeliveryType=${encodeURIComponent(
          reservationPayload.deliveryType
        )}&PaymentMethod=${encodeURIComponent(
          reservationPayload.paymentMethod
        )}&ShippingCost=${encodeURIComponent(
          reservationPayload.shippingCost
        )}`

        // Add shipping address if delivery
        if (reservationPayload.shippingAddress) {
          body += `&ShippingAddress=${encodeURIComponent(JSON.stringify(reservationPayload.shippingAddress))}`
        }
        
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body
        })

        if (!res.ok) {
          throw new Error('Email script failed')
        }

        const data = await res.json()
        if (!data.successSecondemail) {
          throw new Error('Email script returned error')
        }
      } catch (error) {
        console.warn('Reservation email failed:', error)
      }
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
  margin-bottom: 25px;
  font-weight: 600;
  transition: transform 0.2s;
}

.back-link:hover {
  transform: translateX(-5px);
  color: #deb887;
}

.payment-header {
  margin-bottom: 30px;
}

.payment-header h1 {
  color: #333;
  font-size: 2rem;
  margin-top: 10px;
}

.payment-container {
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

.payment-wrapper {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 30px;
  margin-top: 30px;
}

/* PROGRESSIVE STEPS STYLING */
.steps-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.step-section {
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.step-section.active {
  border-color: #4c6a65;
  box-shadow: 0 4px 16px rgba(76, 106, 101, 0.15);
}

.step-section.completed {
  border-color: #10b981;
}

.step-section.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.step-section.collapsed .step-header {
  cursor: pointer;
}

.step-header {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: #f9fafb;
  transition: background 0.3s;
}

.step-section.active .step-header {
  background: #f0f7f6;
}

.step-section.completed .step-header {
  background: #ecfdf5;
}

.step-section.collapsed .step-header:hover {
  background: #e5e7eb;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e0e0e0;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.step-section.active .step-number {
  background: #4c6a65;
  color: white;
}

.step-section.completed .step-number {
  background: #10b981;
  color: white;
}

.step-title {
  flex: 1;
  margin: 0;
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
}

.step-check {
  color: #10b981;
  font-size: 1.5rem;
  font-weight: 700;
}

.step-content {
  padding: 20px;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.step-summary {
  padding: 15px 20px;
  background: #f9fafb;
  border-top: 1px solid #e0e0e0;
  font-size: 0.9rem;
  color: #666;
}

.step-summary p {
  margin: 4px 0;
}

.step-continue-btn {
  width: 100%;
  padding: 14px;
  background-color: #4c6a65;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;
}

.step-continue-btn:hover:not(:disabled) {
  background-color: #3a4f4a;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 106, 101, 0.3);
}

.step-continue-btn:disabled {
  background-color: #ccc;
  color: #666;
  cursor: not-allowed;
  opacity: 0.6;
}

/* ORDER SUMMARY SIDEBAR */
.order-summary-sidebar {
  position: sticky;
  top: 20px;
  height: fit-content;
}

.order-summary-card {
  background: #ffffff;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.order-summary-card h3 {
  color: #333;
  font-size: 1.3rem;
  margin: 0 0 20px 0;
}

.reserved-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 15px;
}

.reserved-item {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 10px;
  background: #f9fafb;
  border-radius: 6px;
}

.item-thumbnail {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  flex-shrink: 0;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-name {
  font-size: 0.9rem;
  color: #333;
  font-weight: 500;
}

.item-price {
  font-size: 1rem;
  color: #4c6a65;
  font-weight: 700;
}

.summary-divider {
  height: 1px;
  background: #eee;
  margin: 15px 0;
}

.form-subtotal,
.form-shipping {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 0.95rem;
  color: #666;
}

.form-shipping .shipping-row {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
}

.total-value {
  color: #4c6a65;
}

.shipping-error {
  font-size: 0.85rem;
  color: #d97706;
  margin-top: 8px;
  padding: 10px;
  background: #fef3c7;
  border-radius: 4px;
}

/* Shipping Price Display in Step 3 */
.shipping-price-display {
  margin-top: 20px;
  padding: 15px;
  background: #f0f7f6;
  border-radius: 8px;
  border-left: 4px solid #4c6a65;
}

.shipping-price-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}

.shipping-price-amount {
  color: #4c6a65;
  font-size: 1.2rem;
  font-weight: 700;
}

/* FORM ELEMENTS */
.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  font-size: 0.95rem;
}

.form-input {
  padding: 12px 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #4c6a65;
  box-shadow: 0 0 0 3px rgba(76, 106, 101, 0.1);
}

/* Delivery Options */
.delivery-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.delivery-option {
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s;
  display: block;
}

.delivery-option:hover {
  border-color: #deb887;
}

.delivery-option.active {
  border-color: #4c6a65;
  background-color: #f0f7f6;
}

.delivery-option input[type="radio"] {
  display: none;
}

.option-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.option-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.option-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.option-text strong {
  color: #333;
  font-size: 1.05rem;
}

.option-text span {
  color: #666;
  font-size: 0.9rem;
}

/* Payment Method Options */
.payment-method-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.payment-option {
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s;
  display: block;
  text-align: center;
}

.payment-option:hover {
  border-color: #deb887;
}

.payment-option.active {
  border-color: #4c6a65;
  background-color: #f0f7f6;
}

.payment-option input[type="radio"] {
  display: none;
}

.option-content-small {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.option-icon-small {
  font-size: 1.5rem;
}

/* Order Summary */
.order-summary-in-form {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin: 10px 0;
}

.order-summary-in-form h3 {
  color: #333;
  font-size: 1rem;
  margin-bottom: 12px;
}

.reserved-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
  max-height: 200px;
  overflow-y: auto;
}

.reserved-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background: white;
  border-radius: 4px;
  font-size: 0.9rem;
}

.item-price {
  font-weight: 600;
  color: #4c6a65;
}

.form-subtotal,
.form-shipping {
  display: flex;
  justify-content: space-between;
  padding: 6px 8px;
  font-size: 0.95rem;
  color: #666;
}

.shipping-amount {
  font-weight: 600;
  color: #4c6a65;
}

.shipping-label {
  font-size: 0.8rem;
  color: #666;
  font-style: italic;
  margin-top: 4px;
  padding: 8px;
  background: #f0f7f6;
  border-radius: 4px;
  border-left: 3px solid #4c6a65;
}

.shipping-error {
  font-size: 0.85rem;
  color: #d97706;
  margin-top: 8px;
  padding: 10px;
  background: #fef3c7;
  border-radius: 4px;
}

.form-total {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-weight: 700;
  font-size: 1.1rem;
  color: #333;
  border-top: 2px solid #e0e0e0;
  margin-top: 8px;
  padding-top: 8px;
}

.total-amount {
  color: #4c6a65;
  font-size: 1.2rem;
}

/* Payment Instructions */
.payment-instructions {
  background: #fff9f0;
  border: 2px solid #ffc107;
  border-radius: 8px;
  padding: 15px;
}

.payment-instructions h4 {
  color: #333;
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 1rem;
}

.bank-info,
.twint-info {
  font-size: 0.9rem;
  color: #555;
  line-height: 1.6;
}

.bank-info p,
.twint-info p {
  margin: 6px 0;
}

/* Reservation Terms */
.reservation-terms {
  background: #fff7ed;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #deb887;
}

.terms-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  margin-bottom: 12px;
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

.terms-details {
  margin-top: 12px;
  font-size: 0.85rem;
  color: #666;
  line-height: 1.6;
      text-align: left;

}

.terms-details p {
  margin: 0 0 8px 0;
}

.terms-details ul {
  margin: 8px 0 0 20px;
  padding: 0;
}

.terms-details li {
  margin: 6px 0;
}

/* Submit Button */
.reserve-btn {
  padding: 14px;
  background-color: #4c6a65;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.reserve-btn:hover:not(:disabled) {
  background-color: #3a4f4a;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(76, 106, 101, 0.3);
}

.reserve-btn:disabled {
  background-color: #ccc;
  color: #666;
  cursor: not-allowed;
  opacity: 0.6;
}

.success-message {
  padding: 12px;
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  border-radius: 6px;
  margin-top: 10px;
  font-weight: 500;
}

.error-message {
  padding: 12px;
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 6px;
  margin-top: 10px;
  font-weight: 500;
}

/* Info Panel */
.info-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-section {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.info-section h3 {
  color: #4c6a65;
  font-size: 1.1rem;
  margin-top: 0;
  margin-bottom: 12px;
}

.info-section p {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 12px;
}

.info-section ul {
  margin: 0;
  padding-left: 20px;
  color: #666;
  font-size: 0.9rem;
}

.info-section ul li {
  margin: 6px 0;
}

.store-info,
.shipping-rates {
  background: #f8f9fa;
  padding: 12px;
  border-radius: 6px;
  margin-top: 10px;
}

.store-info p,
.shipping-rates p {
  margin: 6px 0;
  font-size: 0.85rem;
}

/* Responsive */
@media (max-width: 1024px) {
  .payment-container {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .payment-header h1 {
    font-size: 1.5rem;
  }

  .reservation-form-section {
    padding: 20px;
  }
}

@media (max-width: 768px) {
  /* Tablet - Stack sidebar below form */
  .payment-wrapper {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
    margin-top: 20px;
  }

  .order-summary-sidebar {
    position: static;
    top: auto;
    height: auto;
  }

  .order-summary-card {
    padding: 16px;
  }

  .order-summary-card h3 {
    font-size: 1.1rem;
    margin-bottom: 16px;
  }

  .payment-header h1 {
    font-size: 1.4rem;
  }

  .step-content {
    padding: 16px;
  }

  .step-header {
    padding: 16px;
    gap: 12px;
  }

  .step-number {
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }

  .step-title {
    font-size: 1rem;
  }

  .form-group label {
    font-size: 0.9rem;
  }

  .form-input {
    padding: 10px 12px;
    font-size: 16px; /* Prevents zoom on iOS */
  }

  .step-continue-btn {
    padding: 12px;
    font-size: 0.95rem;
  }

  .reserve-btn {
    padding: 12px;
    font-size: 1rem;
  }

  .delivery-option {
    padding: 12px;
  }

  .option-icon {
    font-size: 1.5rem;
  }

  .option-text strong {
    font-size: 1rem;
  }

  .option-text span {
    font-size: 0.85rem;
  }

  .payment-method-options {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .payment-option {
    padding: 10px;
  }

  .option-icon-small {
    font-size: 1.3rem;
  }

  .reserved-item {
    padding: 8px;
  }

  .item-thumbnail {
    width: 50px;
    height: 50px;
  }

  .item-name {
    font-size: 0.85rem;
  }

  .item-price {
    font-size: 0.9rem;
  }

  .form-subtotal,
  .form-shipping,
  .form-total {
    font-size: 0.9rem;
    padding: 6px 0;
  }

  .order-summary-card h3 {
    font-size: 1.1rem;
  }

  .terms-details {
    font-size: 0.8rem;
  }

  .terms-details li {
    margin: 4px 0;
  }

  .payment-instructions {
    padding: 12px;
  }

  .payment-instructions h4 {
    font-size: 0.95rem;
    margin-bottom: 8px;
  }

  .bank-info p,
  .twint-info p {
    margin: 4px 0;
    font-size: 0.85rem;
  }
}

@media (max-width: 640px) {
  /* Mobile - Further optimizations */
  .payment-container {
    gap: 12px;
    max-width: 100%;
  }

  .payment-header {
    margin-bottom: 20px;
  }

  .payment-header h1 {
    font-size: 1.2rem;
    margin-top: 8px;
  }

  .back-link {
    margin-bottom: 16px;
    font-size: 0.9rem;
  }

  .payment-wrapper {
    gap: 15px;
  }

  .steps-container {
    gap: 12px;
  }

  .step-section {
    border-radius: 6px;
  }

  .step-header {
    padding: 14px;
    gap: 10px;
  }

  .step-number {
    width: 32px;
    height: 32px;
    font-size: 0.9rem;
  }

  .step-title {
    font-size: 0.95rem;
  }

  .step-content {
    padding: 14px;
  }

  .step-summary {
    padding: 12px 14px;
    font-size: 0.8rem;
  }

  .step-summary p {
    margin: 3px 0;
  }

  .form-group {
    margin-bottom: 12px;
  }

  .form-group label {
    font-size: 0.85rem;
    margin-bottom: 6px;
  }

  .form-input {
    padding: 10px;
    font-size: 16px;
    border-radius: 6px;
  }

  .delivery-options {
    gap: 10px;
  }

  .delivery-option {
    padding: 12px;
    border-radius: 8px;
  }

  .option-content {
    gap: 12px;
  }

  .option-icon {
    font-size: 1.3rem;
  }

  .option-text strong {
    font-size: 0.95rem;
  }

  .option-text span {
    font-size: 0.8rem;
  }

  .payment-method-options {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .payment-option {
    padding: 12px;
    border-radius: 6px;
  }

  .option-content-small {
    gap: 6px;
  }

  .option-icon-small {
    font-size: 1.2rem;
  }

  .option-content-small strong {
    font-size: 0.9rem;
  }

  /* Order Summary on Mobile */
  .order-summary-card {
    padding: 14px;
    border-radius: 6px;
  }

  .order-summary-card h3 {
    font-size: 1rem;
    margin-bottom: 14px;
  }

  .reserved-items {
    gap: 8px;
    margin-bottom: 12px;
  }

  .reserved-item {
    padding: 8px;
    gap: 10px;
  }

  .item-thumbnail {
    width: 45px;
    height: 45px;
  }

  .item-info {
    gap: 2px;
  }

  .item-name {
    font-size: 0.8rem;
  }

  .item-price {
    font-size: 0.85rem;
  }

  .summary-divider {
    margin: 12px 0;
  }

  .form-subtotal,
  .form-shipping {
    font-size: 0.85rem;
    padding: 5px 0;
  }

  .form-shipping .shipping-row {
    font-size: 0.85rem;
  }

  .form-total {
    font-size: 1rem;
    padding: 6px 0;
    margin-top: 6px;
    padding-top: 6px;
  }

  .total-value {
    font-size: 1.1rem;
  }

  /* Terms and Buttons on Mobile */
  .reservation-terms {
    padding: 12px;
    border-left-width: 3px;
  }

  .terms-checkbox {
    margin-bottom: 10px;
  }

  .checkbox-input {
    width: 18px;
    height: 18px;
    margin-right: 10px;
  }

  .terms-checkbox span {
    font-size: 0.9rem;
  }

  .terms-details {
    font-size: 0.8rem;
    margin-top: 8px;
  }

  .terms-details p {
    margin-bottom: 6px;
  }

  .terms-details ul {
    margin-left: 16px;
    margin-top: 6px;
  }

  .terms-details li {
    margin: 3px 0;
  }

  .step-continue-btn,
  .reserve-btn {
    padding: 12px;
    font-size: 0.95rem;
    margin-top: 14px;
    border-radius: 6px;
  }

  .payment-instructions {
    padding: 12px;
    border-radius: 6px;
    margin-top: 12px;
  }

  .payment-instructions h4 {
    font-size: 0.9rem;
    margin-bottom: 8px;
  }

  .bank-info,
  .twint-info {
    font-size: 0.85rem;
  }

  .bank-info p,
  .twint-info p {
    margin: 4px 0;
  }

  .success-message,
  .error-message {
    padding: 10px;
    font-size: 0.85rem;
    margin-top: 8px;
  }

  /* Ensure sidebar matches width on mobile */
  .order-summary-sidebar {
    width: 100%;
  }
}
</style>
