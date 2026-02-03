<template>
  <div class="shipping-address-form">
    <h3 class="form-title">{{ $t('shipping.addressTitle') || 'Adresse de livraison' }}</h3>
    
    <div class="form-row">
      <div class="form-group">
        <label for="firstName">{{ $t('shipping.firstName') || 'Prénom' }} *</label>
        <input
          id="firstName"
          v-model="localAddress.firstName"
          type="text"
          required
          @input="emitUpdate"
        />
      </div>
      
      <div class="form-group">
        <label for="lastName">{{ $t('shipping.lastName') || 'Nom' }} *</label>
        <input
          id="lastName"
          v-model="localAddress.lastName"
          type="text"
          required
          @input="emitUpdate"
        />
      </div>
    </div>

    <div class="form-row">
      <div class="form-group flex-grow">
        <label for="street">{{ $t('shipping.street') || 'Rue' }} *</label>
        <input
          id="street"
          v-model="localAddress.street"
          type="text"
          required
          @input="emitUpdate"
        />
      </div>
      
      <div class="form-group street-number">
        <label for="streetNumber">{{ $t('shipping.number') || 'N°' }} *</label>
        <input
          id="streetNumber"
          v-model="localAddress.streetNumber"
          type="text"
          required
          @input="emitUpdate"
        />
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="postalCode">{{ $t('shipping.postalCode') || 'NPA' }} *</label>
        <input
          id="postalCode"
          v-model="localAddress.postalCode"
          type="text"
          pattern="[1-9][0-9]{3}"
          required
          maxlength="4"
          @input="validatePostalCode"
        />
        <span v-if="postalCodeError" class="error-message">{{ postalCodeError }}</span>
      </div>
      
      <div class="form-group">
        <label for="city">{{ $t('shipping.city') || 'Ville' }} *</label>
        <input
          id="city"
          v-model="localAddress.city"
          type="text"
          required
          @input="emitUpdate"
        />
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="canton">{{ $t('shipping.canton') || 'Canton' }} *</label>
        <select
          id="canton"
          v-model="localAddress.canton"
          required
          @change="emitUpdate"
        >
          <option value="">{{ $t('shipping.selectCanton') || 'Sélectionner...' }}</option>
          <option v-for="canton in swissCantons" :key="canton.code" :value="canton.code">
            {{ canton.name }}
          </option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="phone">{{ $t('shipping.phone') || 'Téléphone' }} *</label>
        <input
          id="phone"
          v-model="localAddress.phone"
          type="tel"
          required
          placeholder="+41 XX XXX XX XX"
          @input="emitUpdate"
        />
      </div>
    </div>

    <p class="info-text">
      <strong>{{ $t('shipping.swissOnly') || 'Livraison uniquement en Suisse' }}</strong>
    </p>
  </div>
</template>

<script>
export default {
  name: 'ShippingAddressForm',
  props: {
    modelValue: {
      type: Object,
      default: () => ({
        firstName: '',
        lastName: '',
        street: '',
        streetNumber: '',
        postalCode: '',
        city: '',
        canton: '',
        phone: ''
      })
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      localAddress: { ...this.modelValue },
      postalCodeError: '',
      swissCantons: [
        { code: 'AG', name: 'Argovie (AG)' },
        { code: 'AI', name: 'Appenzell Rhodes-Intérieures (AI)' },
        { code: 'AR', name: 'Appenzell Rhodes-Extérieures (AR)' },
        { code: 'BE', name: 'Berne (BE)' },
        { code: 'BL', name: 'Bâle-Campagne (BL)' },
        { code: 'BS', name: 'Bâle-Ville (BS)' },
        { code: 'FR', name: 'Fribourg (FR)' },
        { code: 'GE', name: 'Genève (GE)' },
        { code: 'GL', name: 'Glaris (GL)' },
        { code: 'GR', name: 'Grisons (GR)' },
        { code: 'JU', name: 'Jura (JU)' },
        { code: 'LU', name: 'Lucerne (LU)' },
        { code: 'NE', name: 'Neuchâtel (NE)' },
        { code: 'NW', name: 'Nidwald (NW)' },
        { code: 'OW', name: 'Obwald (OW)' },
        { code: 'SG', name: 'Saint-Gall (SG)' },
        { code: 'SH', name: 'Schaffhouse (SH)' },
        { code: 'SO', name: 'Soleure (SO)' },
        { code: 'SZ', name: 'Schwytz (SZ)' },
        { code: 'TG', name: 'Thurgovie (TG)' },
        { code: 'TI', name: 'Tessin (TI)' },
        { code: 'UR', name: 'Uri (UR)' },
        { code: 'VD', name: 'Vaud (VD)' },
        { code: 'VS', name: 'Valais (VS)' },
        { code: 'ZG', name: 'Zoug (ZG)' },
        { code: 'ZH', name: 'Zurich (ZH)' }
      ]
    }
  },
  watch: {
    modelValue: {
      handler(newVal) {
        this.localAddress = { ...newVal }
      },
      deep: true
    }
  },
  methods: {
    validatePostalCode() {
      const postalCode = this.localAddress.postalCode
      if (postalCode && !/^[1-9][0-9]{3}$/.test(postalCode)) {
        this.postalCodeError = 'NPA suisse invalide (1000-9999)'
      } else {
        this.postalCodeError = ''
      }
      this.emitUpdate()
    },
    emitUpdate() {
      this.$emit('update:modelValue', this.localAddress)
    }
  }
}
</script>

<style scoped>
.shipping-address-form {
  background: #f8f9fa;
  padding: 25px;
  border-radius: 8px;
  margin: 20px 0;
}

.form-title {
  color: #4c6a65;
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.2em;
}

.form-row {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.form-group.flex-grow {
  flex: 2;
}

.form-group.street-number {
  flex: 0 0 100px;
}

.form-group label {
  margin-bottom: 5px;
  font-weight: 600;
  color: #333;
  font-size: 0.9em;
}

.form-group input,
.form-group select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1em;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #4c6a65;
}

.error-message {
  color: #dc3545;
  font-size: 0.85em;
  margin-top: 5px;
}

.info-text {
  background: #fff3cd;
  padding: 10px;
  border-radius: 4px;
  border-left: 4px solid #ffc107;
  margin-top: 15px;
  font-size: 0.9em;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 15px;
  }
  
  .form-group.street-number {
    flex: 1;
  }
}
</style>
