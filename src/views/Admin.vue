<template>
  <div class="boxes">
    <div class="box">
      <!-- 1. SECTION CONNEXION -->
      <div v-if="!isLoggedIn" class="login-card">
        <div class="login-header">
          <h1>Accès Admin</h1>
          <p>Connectez-vous pour gérer vos produits</p>
        </div>

        <div class="login-form">
          <div class="input-group">
            <label>Nom d'utilisateur</label>
            <input
              v-model="adminUsername"
              type="text"
              placeholder="Admin"
              @keyup.enter="login"
            />
          </div>

          <div class="input-group">
            <label>Mot de passe</label>
            <input
              v-model="adminPassword"
              type="password"
              placeholder="••••••••"
              @keyup.enter="login"
            />
          </div>

          <button @click="login" :disabled="loading" class="login-btn">
            <span v-if="loading">Authentification...</span>
            <span v-else>Se connecter</span>
          </button>

          <p v-if="loginError" class="error-banner">{{ loginError }}</p>
        </div>
      </div>

      <!-- 2. PANNEAU PRINCIPAL -->
      <div v-else class="admin-main">
        <header class="admin-header">
          <div class="header-top">
            <div class="tab-switch">
              <button
                class="tab-btn"
                :class="{ active: activeTab === 'products' }"
                @click="setActiveTab('products')"
              >
                Produits
              </button>
              <button
                class="tab-btn"
                :class="{ active: activeTab === 'reservations' }"
                @click="setActiveTab('reservations')"
              >
                Réservations
              </button>
              <button
                class="tab-btn"
                :class="{ active: activeTab === 'blog' }"
                @click="setActiveTab('blog')"
              >
                Blog
              </button>
            </div>

            <div class="user-profile desktop-only">
              <span class="avatar">
                B.P</span>
              <button @click="logout" class="logout-btn">Déconnexion</button>
            </div>
          </div>

          <div class="header-bottom">
            <div class="header-left">
              <h1 v-if="activeTab === 'products'">Gestion des Produits</h1>
              <h1 v-else-if="activeTab === 'reservations'">Gestion des Réservations</h1>
              <h1 v-else>Gestion du Blog</h1>
              <p v-if="activeTab === 'products'" class="stats">
                {{ products.length }} produits enregistrés
              </p>
              <p v-else-if="activeTab === 'reservations'" class="stats">{{ reservations.length }} réservations</p>
              <p v-else class="stats">{{ blogArticles.length }} articles</p>
            </div>

            <button
              v-if="activeTab === 'products'"
              @click="toggleCreateForm"
              class="btn-create"
            >
              {{ showCreateForm ? "Annuler" : "+ Nouveau Produit" }}
            </button>
            <button
              v-if="activeTab === 'blog'"
              @click="toggleBlogForm"
              class="btn-create"
            >
              {{ showBlogForm ? "Annuler" : "+ Nouvel Article" }}
            </button>
          </div>
        </header>

        <div v-if="activeTab === 'products'">
        <!-- FORMULAIRE DE CRÉATION -->
        <div v-if="showCreateForm" class="product-card create-mode animate-in">
          <div class="form-grid">
            <div class="image-management">
              <label>
                Images ({{ createForm.images.length }}/6)
                <small v-if="createForm.images.length" class="weight-label">
                  ~{{ calculateWeight(createForm.images) }}MB
                </small>
              </label>

              <div class="image-previews">
                <div
                  v-for="(img, idx) in createForm.images"
                  :key="idx"
                  class="preview-item"
                >
                  <img :src="img" alt="Aperçu" />
                  <button
                    @click="removeImage(createForm, idx)"
                    class="remove-img-btn"
                  >
                    ×
                  </button>
                </div>

                <label
                  v-if="createForm.images.length < 6"
                  class="upload-trigger"
                  :class="{ loading: compressing }"
                >
                  <input
                    type="file"
                    @change="handleFileUpload($event, createForm)"
                    accept="image/*"
                    multiple
                    hidden
                  />
                  <div class="trigger-content">
                    <span v-if="compressing" class="loader-spinner"></span>
                    <span v-else class="plus">+</span>
                    <span>{{ compressing ? "Traitement..." : "Ajouter" }}</span>
                  </div>
                </label>
              </div>
              <p v-if="createForm.images.length >= 6" class="info-msg">
                Limite de 6 images atteinte.
              </p>
            </div>

            <div class="edit-inputs">
              <input
                v-model="createForm.title"
                class="input-edit title"
                placeholder="Nom du produit"
              />
              <div class="input-field">
                <label>Prix (CHF)</label>
                <input
                  v-model.number="createForm.price"
                  type="number"
                  class="input-edit"
                />
              </div>
              
              <div class="input-field">
                <label>Poids (g) - Pour calcul livraison</label>
                <input
                  v-model.number="createForm.weight"
                  type="number"
                  class="input-edit"
                  placeholder="ex: 500 (500 grammes)"
                  min="1"
                />
                <small style="color: #666; font-size: 0.8rem;">Poids en grammes pour le calcul des frais de livraison Poste Suisse</small>
              </div>
              
              <div class="input-field">
                <label>Tags (séparés par des virgules)</label>
                <input
                  v-model="createForm.tagsString"
                  class="input-edit"
                  placeholder="ex: Vintage, Collection, Rare"
                />
              </div>

              <label>Description</label>
              <textarea
                v-model="createForm.description"
                class="input-edit"
                rows="3"
              ></textarea>

              <div class="input-field">
                <label>URL vidéo YouTube (optionnel)</label>
                <input
                  v-model="createForm.youtubeUrl"
                  class="input-edit"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>

              <div class="form-actions">
                <button
                  @click="handleCreate"
                  class="btn btn-save"
                  :disabled="actionLoading || createForm.images.length === 0"
                >
                  {{
                    actionLoading
                      ? "Création en cours..."
                      : "Enregistrer le produit"
                  }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- LISTE DES PRODUITS -->
        <div class="product-list">
          <div
            v-for="product in products"
            :key="product._id"
            class="product-card"
            :class="{ 'is-editing': editingId === product._id }"
          >
            <!-- MODE ÉDITION -->
            <div v-if="editingId === product._id" class="form-grid edit-row">
              <div class="image-management">
                <label>Images ({{ editForm.images.length }}/6)</label>
                <div class="image-previews small">
                  <div
                    v-for="(img, idx) in editForm.images"
                    :key="idx"
                    class="preview-item"
                  >
                    <img :src="img" alt="Aperçu" />
                    <button
                      @click="removeImage(editForm, idx)"
                      class="remove-img-btn"
                    >
                      ×
                    </button>
                  </div>
                  <label
                    v-if="editForm.images.length < 6"
                    class="upload-trigger mini"
                    :class="{ loading: compressing }"
                  >
                    <input
                      type="file"
                      @change="handleFileUpload($event, editForm)"
                      accept="image/*"
                      multiple
                      hidden
                    />
                    <span>+</span>
                  </label>
                </div>
              </div>

              <div class="edit-inputs">
                <input v-model="editForm.title" class="input-edit title" />
                <input
                  v-model.number="editForm.price"
                  type="number"
                  class="input-edit"
                  placeholder="Prix (CHF)"
                />
                
                <input
                  v-model.number="editForm.weight"
                  type="number"
                  class="input-edit"
                  placeholder="Poids (g)"
                  min="1"
                  title="Poids en grammes pour le calcul des frais de livraison"
                />
                
                <input
                  v-model="editForm.tagsString"
                  class="input-edit"
                  placeholder="Tags séparés par des virgules"
                />
                
                <textarea
                  v-model="editForm.description"
                  class="input-edit"
                  rows="3"
                ></textarea>
                <div class="input-field">
                  <label>URL vidéo YouTube (optionnel)</label>
                  <input
                    v-model="editForm.youtubeUrl"
                    class="input-edit"
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>
              </div>

              <div class="product-controls vertical-btns">
                <button
                  @click="saveEdit(product._id)"
                  class="btn btn-save"
                  :disabled="actionLoading"
                >
                  Sauvegarder
                </button>
                <button @click="cancelEdit" class="btn btn-cancel">
                  Annuler
                </button>
              </div>
            </div>

            <!-- MODE VUE -->
            <template v-else>
              <div class="product-info">
                <div class="img-wrapper">
                  <img :src="getProductImage(product)" :alt="product.title" />
                  <span v-if="product.images?.length > 1" class="img-count"
                    >+{{ product.images.length - 1 }}</span
                  >
                </div>
                <div class="details">
                  <div class="title-row">
                    <h3>{{ product.title }}</h3>
                    <span class="price-tag">{{ product.price }} CHF</span>
                  </div>
                  <p class="desc-text">
                    {{ truncateDescription(product.description) }}
                  </p>
                  <div class="meta-row">
                    <div class="tags-container">
                      <span 
                        v-for="(tag, idx) in product.tags" 
                        :key="idx" 
                        class="cat-tag"
                      >
                        {{ tag }}
                      </span>
                      <span v-if="!product.tags || product.tags.length === 0" class="cat-tag">Sans tag</span>
                    </div>
                    <span
                      class="status-badge"
                      :class="{ active: product.disponible }"
                    >
                      {{ product.disponible ? "En ligne" : "Masqué" }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="product-actions-grid">
                <button @click="startEdit(product)" class="btn btn-edit">
                  Modifier
                </button>
                <button
                  @click="toggleAvailability(product._id)"
                  class="btn btn-toggle"
                  :class="{ 'btn-hide': product.disponible }"
                >
                  {{ product.disponible ? "Masquer" : "Afficher" }}
                </button>
                <button
                  @click="deleteProduct(product._id)"
                  class="btn btn-delete"
                >
                  Supprimer
                </button>
              </div>
            </template>
          </div>
        </div>
        </div>

        <div v-else-if="activeTab === 'reservations'" class="reservations-panel">
          <div class="reservation-toolbar">
            <button @click="loadReservations" class="btn btn-refresh" :disabled="reservationsLoading">
              {{ reservationsLoading ? 'Chargement...' : 'Rafraîchir' }}
            </button>
            <span v-if="reservationsLoading" class="loading-text">Chargement des réservations...</span>
          </div>

          <p v-if="reservationsError" class="error-banner">{{ reservationsError }}</p>
          <p v-if="!reservationsLoading && reservations.length === 0" class="empty-state">
            Aucune réservation pour le moment.
          </p>

          <div v-else class="reservations-sections">
            <!-- Section En Cours -->
            <div v-if="activeReservations.length > 0" class="reservation-section">
              <div class="section-header active-section">
                <h2>🟢 En Cours</h2>
                <span class="count-badge">{{ activeReservations.length }}</span>
              </div>
              <div class="reservations-list">
                <div v-for="reservation in activeReservations" :key="reservation._id" class="reservation-card">
                  <div class="reservation-header-clickable" @click="toggleReservation(reservation._id)">
                    <div class="header-left-content">
                      <h3>{{ reservation.orderNumber }}</h3>
                      <span class="reservation-date">{{ formatDate(reservation.reservedAt) }}</span>
                    </div>
                    <div class="header-right-content">
                      <span class="reservation-total-mini">CHF {{ Number(reservation.totalAmount || 0).toFixed(2) }}</span>
                      <span class="collapse-icon" :class="{ collapsed: isCollapsed(reservation._id) }">▼</span>
                    </div>
                  </div>

                  <div v-show="!isCollapsed(reservation._id)" class="reservation-details">
                    <div class="reservation-meta">
                      <div>Expire le : {{ formatDate(reservation.expiresAt) }}</div>
                    </div>

                    <div class="reservation-products">
                      <div
                        v-for="item in reservation.products"
                        :key="item.productId || item._id || item.title"
                        class="reservation-product"
                      >
                        <router-link 
                          :to="`/produits/${item.productId}`" 
                          class="product-link"
                          @click.stop
                        >
                          {{ item.title }}
                        </router-link>
                        <span class="item-price">CHF {{ item.price }}</span>
                      </div>
                    </div>

                    <div class="reservation-actions">
                      <button
                        class="btn btn-cancel"
                        @click="cancelReservation(reservation)"
                        :disabled="reservationActionLoading"
                      >
                        Annuler
                      </button>
                      <button
                        class="btn btn-save"
                        @click="completeReservation(reservation)"
                        :disabled="reservationActionLoading"
                      >
                        Terminer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Section Terminée -->
            <div v-if="completedReservations.length > 0" class="reservation-section">
              <div class="section-header completed-section">
                <h2>✅ Terminées</h2>
                <span class="count-badge">{{ completedReservations.length }}</span>
              </div>
              <div class="reservations-list">
                <div v-for="reservation in completedReservations" :key="reservation._id" class="reservation-card completed">
                  <div class="reservation-header-clickable" @click="toggleReservation(reservation._id)">
                    <div class="header-left-content">
                      <h3>{{ reservation.orderNumber }}</h3>
                      <span class="reservation-date">{{ formatDate(reservation.reservedAt) }}</span>
                    </div>
                    <div class="header-right-content">
                      <span class="reservation-total-mini">CHF {{ Number(reservation.totalAmount || 0).toFixed(2) }}</span>
                      <span class="collapse-icon" :class="{ collapsed: isCollapsed(reservation._id) }">▼</span>
                    </div>
                  </div>

                  <div v-show="!isCollapsed(reservation._id)" class="reservation-details">
                    <div class="reservation-meta">
                      <div>Terminée le : {{ formatDate(reservation.completedAt) }}</div>
                    </div>

                    <div class="reservation-products">
                      <div
                        v-for="item in reservation.products"
                        :key="item.productId || item._id || item.title"
                        class="reservation-product"
                      >
                        <router-link 
                          :to="`/produits/${item.productId}`" 
                          class="product-link"
                          @click.stop
                        >
                          {{ item.title }}
                        </router-link>
                        <span class="item-price">CHF {{ item.price }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Section Annulée -->
            <div v-if="canceledReservations.length > 0" class="reservation-section">
              <div class="section-header canceled-section">
                <h2>❌ Annulées</h2>
                <span class="count-badge">{{ canceledReservations.length }}</span>
              </div>
              <div class="reservations-list">
                <div v-for="reservation in canceledReservations" :key="reservation._id" class="reservation-card canceled">
                  <div class="reservation-header-clickable" @click="toggleReservation(reservation._id)">
                    <div class="header-left-content">
                      <h3>{{ reservation.orderNumber }}</h3>
                      <span class="reservation-date">{{ formatDate(reservation.reservedAt) }}</span>
                    </div>
                    <div class="header-right-content">
                      <span class="reservation-total-mini">CHF {{ Number(reservation.totalAmount || 0).toFixed(2) }}</span>
                      <span class="collapse-icon" :class="{ collapsed: isCollapsed(reservation._id) }">▼</span>
                    </div>
                  </div>

                  <div v-show="!isCollapsed(reservation._id)" class="reservation-details">
                    <div class="reservation-meta">
                      <div>Annulée le : {{ formatDate(reservation.canceledAt) }}</div>
                    </div>

                    <div class="reservation-products">
                      <div
                        v-for="item in reservation.products"
                        :key="item.productId || item._id || item.title"
                        class="reservation-product"
                      >
                        <router-link 
                          :to="`/produits/${item.productId}`" 
                          class="product-link"
                          @click.stop
                        >
                          {{ item.title }}
                        </router-link>
                        <span class="item-price">CHF {{ item.price }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- BLOG TAB -->
        <div v-else class="blog-panel">
          <!-- ToolbarA -->


          <!-- Blog Form -->
          <div v-if="showBlogForm" class="blog-form-card">
            <div class="blog-form-header">
              <h3>{{ editingBlogId ? "✏️ Modifier l'article" : "✍️ Nouvel article" }}</h3>
              <button @click="cancelBlogForm" class="btn-close">×</button>
            </div>
            <div class="blog-form-body">
              <div class="blog-form-row">
                <div class="blog-form-group flex-1">
                  <label>Titre <span class="required">*</span></label>
                  <input v-model="blogForm.title" type="text" class="input-edit" placeholder="Titre de l'article" />
                </div>
                <div class="blog-form-group date-group">
                  <label>Date</label>
                  <input v-model="blogForm.date" type="date" class="input-edit" />
                </div>
              </div>
              <div class="blog-form-group">
                <label>Résumé <span class="required">*</span></label>
                <textarea v-model="blogForm.summary" class="input-edit" rows="2" placeholder="Court résumé qui apparaîtra sur la carte du blog"></textarea>
              </div>
              <div class="blog-form-group">
                <label>Contenu (HTML) <span class="required">*</span></label>
                <div class="content-hint">Vous pouvez utiliser du HTML : &lt;p&gt;, &lt;h3&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;a&gt;...</div>
                <textarea v-model="blogForm.content" class="input-edit editor-textarea" rows="12" placeholder="<p>Contenu de l'article...</p>"></textarea>
              </div>
              <div class="blog-form-actions">
                <button @click="cancelBlogForm" class="btn btn-cancel">Annuler</button>
                <button
                  @click="saveBlogArticle"
                  class="btn btn-save"
                  :disabled="actionLoading || !blogForm.title || !blogForm.content"
                >
                  {{ actionLoading ? "Enregistrement..." : (editingBlogId ? "Mettre à jour" : "Publier l'article") }}
                </button>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="blogArticles.length === 0 && !showBlogForm" class="empty-state">
            <div class="empty-icon">📝</div>
            <p>Aucun article pour le moment.</p>
            <p class="empty-hint">Créez votre premier article de blog !</p>
          </div>

          <!-- Blog List -->
          <div v-else-if="!showBlogForm" class="blog-list">
            <div v-for="article in blogArticles" :key="article._id" class="blog-card-admin">
              <div class="blog-card-top">
                <span class="blog-card-date">{{ article.date }}</span>
                <div class="blog-card-actions">
                  <button @click="editBlogArticle(article)" class="btn-icon btn-icon-edit" title="Modifier">✏️</button>
                  <button @click="deleteBlogArticle(article._id)" class="btn-icon btn-icon-delete" title="Supprimer">🗑️</button>
                </div>
              </div>
              <h4 class="blog-card-title">{{ article.title }}</h4>
              <p class="blog-card-summary">{{ article.summary }}</p>
              <div class="blog-card-footer">
                <span class="blog-card-length">{{ (article.content || '').length }} caractères</span>
                <a :href="'/fr/blog/' + article._id" target="_blank" class="blog-card-preview">Aperçu →</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { api } from "../services/api.js";

export default {
  name: "AdminPanel",
  data() {
    return {
      isLoggedIn: false,
      adminUsername: "",
      adminPassword: "",
      loginError: "",
      products: [],
      token: "",
      loading: false,
      actionLoading: false,
      reservationActionLoading: false,
      reservationsLoading: false,
      reservationsError: "",
      compressing: false,
      editingId: null,
      showCreateForm: false,
      activeTab: "products",
      reservations: [],
      collapsedReservations: {}, // Pour tracker l'état collapsed de chaque réservation
      createForm: {
        title: "",
        price: 0,
        weight: 500,
        tagsString: "",
        description: "",
        images: [],
        disponible: true,
        youtubeUrl: "",
      },
      editForm: {
        title: "",
        price: 0,
        weight: 500,
        tagsString: "",
        description: "",
        images: [],
        disponible: true,
        youtubeUrl: "",
      },
      // Blog
      blogArticles: [],
      showBlogForm: false,
      editingBlogId: null,
      blogForm: {
        title: "",
        summary: "",
        content: "",
        date: new Date().toISOString().split('T')[0],
      },
    };
  },
  computed: {
    activeReservations() {
      return this.reservations.filter(r => r.status === 'active')
    },
    completedReservations() {
      return this.reservations.filter(r => r.status === 'completed')
    },
    canceledReservations() {
      return this.reservations.filter(r => r.status === 'canceled')
    }
  },
  methods: {
    async login() {
      if (!this.adminUsername || !this.adminPassword)
        return (this.loginError = "Champs requis");
      try {
        this.loading = true;
        const res = await api.login(this.adminUsername, this.adminPassword);
        if (res.success) {
          this.token = res.token;
          this.isLoggedIn = true;
          sessionStorage.setItem("adminToken", this.token);
          await this.loadProducts();
          await this.loadBlogArticles();
          if (this.activeTab === "reservations") {
            await this.loadReservations();
          }
        }
      } catch (e) {
        this.loginError = "Erreur de connexion";
      } finally {
        this.loading = false;
      }
    },

    setActiveTab(tab) {
      this.activeTab = tab;
      if (tab === "reservations") {
        this.loadReservations();
      }
    },

    async loadProducts() {
      try {
        this.loading = true;
        const res = await api.getProducts();
        if (res.success) this.products = res.data;
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },

    async loadReservations() {
      if (!this.token) return;
      try {
        this.reservationsLoading = true;
        this.reservationsError = "";
        const res = await api.getReservations(this.token);
        if (res.success) this.reservations = res.data;
      } catch (e) {
        this.reservationsError = "Impossible de charger les réservations.";
        console.error(e);
      } finally {
        this.reservationsLoading = false;
      }
    },

    async cancelReservation(reservation) {
      if (!confirm("Annuler cette réservation ?")) return;
      try {
        this.reservationActionLoading = true;
        const res = await api.updateReservationStatus(
          reservation._id,
          "canceled",
          this.token
        );
        if (res.success) {
          const idx = this.reservations.findIndex((r) => r._id === reservation._id);
          if (idx !== -1) {
            if (res.deleted) {
              this.reservations.splice(idx, 1);
            } else {
              this.reservations.splice(idx, 1, res.data);
            }
          }
          
          // Remettre les produits en disponible
          if (reservation.products && reservation.products.length > 0) {
            for (const product of reservation.products) {
              try {
                await api.updateProduct(
                  product.productId || product._id, 
                  { disponible: true }, 
                  this.token
                );
              } catch (updateError) {
                console.warn(`Erreur lors de la mise à jour du produit ${product.productId}:`, updateError);
              }
            }
            // Recharger la liste des produits
            await this.loadProducts();
          }
        }
      } catch (e) {
        alert("Échec de l'annulation.");
        console.error(e);
      } finally {
        this.reservationActionLoading = false;
      }
    },

    async completeReservation(reservation) {
      if (!confirm("Marquer cette réservation comme terminée ?\n\nCette action supprimera les produits réservés de la base de données.")) return;
      try {
        this.reservationActionLoading = true;
        const res = await api.updateReservationStatus(
          reservation._id,
          "completed",
          this.token
        );
        if (res.success) {
          const idx = this.reservations.findIndex((r) => r._id === reservation._id);
          if (idx !== -1) this.reservations.splice(idx, 1, res.data);
          
          // Supprimer les produits de la réservation de la base de données
          if (reservation.products && reservation.products.length > 0) {
            for (const product of reservation.products) {
              try {
                await api.deleteProduct(product.productId || product._id, this.token);
              } catch (deleteError) {
                console.warn(`Erreur lors de la suppression du produit ${product.productId}:`, deleteError);
              }
            }
          }
        }
      } catch (e) {
        alert("Échec de la finalisation.");
        console.error(e);
      } finally {
        this.reservationActionLoading = false;
      }
    },

    statusLabel(status) {
      switch (status) {
        case "active":
          return "Active";
        case "canceled":
          return "Annulée";
        case "completed":
          return "Terminée";
        default:
          return "Inconnue";
      }
    },

    formatDate(dateValue) {
      if (!dateValue) return "-";
      const d = new Date(dateValue);
      return isNaN(d.getTime()) ? "-" : d.toLocaleDateString("fr-FR");
    },

    toggleReservation(id) {
      this.collapsedReservations[id] = !this.collapsedReservations[id]
    },

    isCollapsed(id) {
      return this.collapsedReservations[id] === true
    },
    async handleFileUpload(event, form) {
      const files = Array.from(event.target.files);
      if (!files.length) return;

      this.compressing = true;

      const CLOUDINARY_UPLOAD_PRESET = 'brunopese';
      const CLOUDINARY_CLOUD_NAME = 'duzb4ed4h';

      for (let file of files) {
        if (form.images.length >= 6) break;
        try {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
          // Direct upload to Cloudinary unsigned endpoint
          const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: formData
          });
          const result = await response.json();
          if (result.secure_url) {
            form.images.push(result.secure_url);
          } else {
            console.error('Cloudinary upload failed', result.error?.message || result);
          }
        } catch (e) {
          console.error('Upload échouée', e);
        }
      }
      this.compressing = false;
      event.target.value = "";
    },

    compressImage(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onerror = (e) => reject(e);
        reader.onload = (event) => {
          const img = new Image();
          img.src = event.target.result;
          img.onload = () => {
            const canvas = document.createElement("canvas");

            // INCREASED QUALITY & RESOLUTION
            const MAX_WIDTH = 1200;
            let width = img.width;
            let height = img.height;

            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";
            ctx.drawImage(img, 0, 0, width, height);

            // 0.82 is a great balance for high quality product shots
            resolve(canvas.toDataURL("image/jpeg", 0.82));
          };
        };
      });
    },

    calculateWeight(images) {
      const totalStr = images.join("");
      const bytes = totalStr.length * (3 / 4);
      return (bytes / (1024 * 1024)).toFixed(2);
    },

    async handleCreate() {
      try {
        this.actionLoading = true;
        // Parse tags from string
        const productData = {
          ...this.createForm,
          tags: this.createForm.tagsString
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0)
        };
        delete productData.tagsString;
        
        const res = await api.createProduct(productData, this.token);
        if (res.success) {
          this.products.unshift(res.data);
          this.showCreateForm = false;
          this.createForm = {
            title: "",
            price: 0,
            weight: 500,
            tagsString: "",
            description: "",
            images: [],
            disponible: true,
          };
        }
      } catch (e) {
        alert("Erreur lors de la sauvegarde. Trop d'images ou trop lourdes ?");
      } finally {
        this.actionLoading = false;
      }
    },

    async saveEdit(id) {
      try {
        this.actionLoading = true;
        // Parse tags from string
        const productData = {
          ...this.editForm,
          tags: this.editForm.tagsString
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0)
        };
        delete productData.tagsString;
        
        const res = await api.updateProduct(id, productData, this.token);
        if (res.success) {
          const idx = this.products.findIndex((p) => p._id === id);
          this.products.splice(idx, 1, res.data);
          this.editingId = null;
        }
      } catch (e) {
        alert("Échec de la mise à jour.");
      } finally {
        this.actionLoading = false;
      }
    },

    toggleAvailability(id) {
      const p = this.products.find((x) => x._id === id);
      api
        .updateProduct(id, { disponible: !p.disponible }, this.token)
        .then((res) => {
          if (res.success) p.disponible = res.data.disponible;
        });
    },

    deleteProduct(id) {
      if (!confirm("Supprimer définitivement ?")) return;
      api.deleteProduct(id, this.token).then((res) => {
        if (res.success)
          this.products = this.products.filter((p) => p._id !== id);
      });
    },

    startEdit(p) {
      this.editingId = p._id;
      this.editForm = JSON.parse(JSON.stringify(p));
      // Convert tags array to comma-separated string
      this.editForm.tagsString = (this.editForm.tags || []).join(', ');
    },
    cancelEdit() {
      this.editingId = null;
    },
    toggleCreateForm() {
      this.showCreateForm = !this.showCreateForm;
    },
    getProductImage(p) {
      return p.images?.[0] || "https://placehold.co/200";
    },
    truncateDescription(t) {
      return t?.length > 60 ? t.substring(0, 60) + "..." : t;
    },
    removeImage(form, i) {
      form.images.splice(i, 1);
    },
    logout() {
      this.isLoggedIn = false;
      sessionStorage.clear();
    },

    // ===== BLOG METHODS =====
    toggleBlogForm() {
      this.showBlogForm = !this.showBlogForm;
      if (!this.showBlogForm) this.cancelBlogForm();
    },
    cancelBlogForm() {
      this.showBlogForm = false;
      this.editingBlogId = null;
      this.blogForm = {
        title: "",
        summary: "",
        content: "",
        date: new Date().toISOString().split('T')[0],
      };
    },
    async loadBlogArticles() {
      try {
        const res = await api.getBlogArticles();
        if (res.success) this.blogArticles = res.data;
      } catch (e) {
        console.error('Failed to load blog articles:', e);
      }
    },
    async saveBlogArticle() {
      if (!this.blogForm.title || !this.blogForm.content) {
        alert('Le titre et le contenu sont requis.');
        return;
      }
      try {
        this.actionLoading = true;
        if (this.editingBlogId) {
          const res = await api.updateBlogArticle(this.editingBlogId, this.blogForm, this.token);
          if (res.success) {
            const idx = this.blogArticles.findIndex(a => a._id === this.editingBlogId);
            if (idx !== -1) this.blogArticles[idx] = res.data;
          }
        } else {
          const res = await api.createBlogArticle(this.blogForm, this.token);
          if (res.success) this.blogArticles.unshift(res.data);
        }
        this.cancelBlogForm();
      } catch (e) {
        alert("Erreur lors de l'enregistrement.");
        console.error(e);
      } finally {
        this.actionLoading = false;
      }
    },
    editBlogArticle(article) {
      this.editingBlogId = article._id;
      this.blogForm = {
        title: article.title,
        summary: article.summary,
        content: article.content,
        date: article.date,
      };
      this.showBlogForm = true;
    },
    deleteBlogArticle(id) {
      if (!confirm("Supprimer définitivement cet article ?")) return;
      api.deleteBlogArticle(id, this.token).then((res) => {
        if (res.success)
          this.blogArticles = this.blogArticles.filter((a) => a._id !== id);
      });
    },
  },
  mounted() {
    const t = sessionStorage.getItem("adminToken");
    if (t) {
      this.token = t;
      this.isLoggedIn = true;
      this.loadProducts();
      this.loadBlogArticles();
    }
  },
};
</script>

<style scoped>
/* Keeping your existing styles and adding new utilities */
.weight-label {
  font-size: 0.7rem;
  color: #94a3b8;
  margin-left: 8px;
}

.info-msg {
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 8px;
}

.loader-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Rest of your styles... */
.admin-wrapper {
  min-height: 100vh;
  background: #f8fafc;
  padding: clamp(10px, 3vw, 30px);
  font-family: "Inter", sans-serif;
}
.admin-container {
  max-width: 1100px;
  margin: 0 auto;
}
.admin-header {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin-bottom: 25px;
  gap: 12px;
}

.header-top,
.header-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.header-top {
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 12px;
}
.header-left {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.header-bottom .btn-create {
  margin-left: auto;
}
.tab-switch {
  display: inline-flex;
  background: #e2e8f0;
  border-radius: 12px;
  padding: 4px;
  gap: 4px;
}
.tab-btn {
  border: none;
  background: transparent;
  color: #1e293b;
  font-weight: 700;
  font-size: 0.85rem;
  padding: 8px 14px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}
.tab-btn.active {
  background: white;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.1);
}
.header-left h1 {
  font-size: clamp(1.2rem, 4vw, 1.8rem);
  font-weight: 800;
  color: #1e293b;
  margin: 0;
}
.stats {
  font-size: 0.9rem;
  color: #64748b;
}
.btn-create {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: white;
  padding: 12px 24px;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);
  position: relative;
  overflow: hidden;
}

.btn-create:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.45);
  filter: brightness(1.1);
}

.user-profile {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
  color: #1e3a8a;
  background: #dbeafe;
}

.logout-btn {
  border: 1px solid #bfdbfe;
  background: #eff6ff;
  color: #1d4ed8;
  padding: 9px 14px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.86rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  background: #dbeafe;
  border-color: #93c5fd;
  transform: translateY(-1px);
}

.logout-btn:focus-visible {
  outline: 3px solid rgba(59, 130, 246, 0.35);
  outline-offset: 2px;
}
.product-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 25px;
}
@media (min-width: 768px) {
  .form-grid {
    grid-template-columns: 280px 1fr;
  }
  .edit-row {
    grid-template-columns: 200px 1fr 150px;
  }
}
.image-previews {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  background: #f1f5f9;
  padding: 10px;
  border-radius: 12px;
}
.upload-trigger {
  aspect-ratio: 1;
  border: 2px dashed #cbd5e1;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: white;
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
}
.upload-trigger.loading {
  opacity: 0.5;
  cursor: wait;
}
.preview-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
}
.preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.remove-img-btn {
  position: absolute;
  top: 2px;
  right: 2px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 14px;
}
.input-edit {
  width: 100%;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  margin-bottom: 10px;
}
.input-edit.title {
  font-weight: 700;
  font-size: 1.1rem;
  border-color: #3b82f6;
}
.row-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.input-field label {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  color: #94a3b8;
  margin-bottom: 4px;
  text-transform: uppercase;
}
.product-info {
  display: flex;
  gap: 15px;
}
.img-wrapper {
  width: clamp(60px, 15vw, 90px);
  height: clamp(60px, 15vw, 90px);
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
  position: relative;
}
.img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.img-count {
  position: absolute;
  bottom: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 0.7rem;
  padding: 2px 5px;
  border-radius: 4px;
  font-weight: bold;
}
.details {
  flex: 1;
  min-width: 0;
}
.title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
}
.details h3 {
  margin: 0;
  font-size: 1rem;
  color: #1e293b;
}
.price-tag {
  font-weight: 800;
  color: #10b981;
}
.desc-text {
  font-size: 0.85rem;
  color: #64748b;
  margin: 5px 0;
}
.meta-row {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-top: 8px;
  flex-wrap: wrap;
}
.tags-container {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.cat-tag {
  font-size: 0.7rem;
  background: #f1f5f9;
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 700;
  color: #475569;
  white-space: nowrap;
}
.tags-input-wrapper {
  margin-bottom: 10px;
}
.tags-display {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  min-height: 45px;
  align-items: center;
}
.tag-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  padding: 6px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}
.tag-remove {
  background: rgba(255, 255, 255, 0.3);
  border: none;
  color: white;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}
.tag-remove:hover {
  background: rgba(255, 255, 255, 0.5);
}
.tag-input {
  border: none;
  outline: none;
  flex: 1;
  min-width: 150px;
  font-size: 0.9rem;
  padding: 4px;
}
.tag-input::placeholder {
  color: #94a3b8;
}
.status-badge {
  font-size: 0.7rem;
  font-weight: 700;
}
.status-badge.active {
  color: #10b981;
}
.product-actions-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 15px;
}
@media (min-width: 1024px) {
  .product-actions-grid {
    grid-template-columns: repeat(3, auto);
    margin-top: 0;
    justify-content: flex-end;
  }
}
.btn {
  padding: 10px 15px;
  border-radius: 8px;
  border: none;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}
.btn-save {
  background: #1e293b;
  color: white;
  width: 100%;
}
.btn-edit {
  background: #f1f5f9;
  color: #1e293b;
}
.btn-delete {
  background: #fee2e2;
  color: #ef4444;
}
.btn-toggle {
  background: #ecfdf5;
  color: #059669;
}
.btn-toggle.btn-hide {
  background: #fff7ed;
  color: #c2410c;
}
.vertical-btns {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.animate-in {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.login-card {
  max-width: 400px;
  margin: 10vh auto;
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}
.login-btn {
  width: 100%;
  padding: 15px;
  background: #3b82f6;
  color: white;
  border-radius: 12px;
  font-weight: 800;
  margin-top: 20px;
  border: none;
  cursor: pointer;
}

.reservations-panel {
  background: #f8fafc;
  border-radius: 16px;
  padding: 20px;
  border: 1px solid #e2e8f0;
}

/* ===== BLOG PANEL ===== */
.blog-panel {
  background: #f8fafc;
  border-radius: 16px;
  padding: 20px;
  border: 1px solid #e2e8f0;
}

.blog-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
}

.blog-toolbar-left {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.blog-panel-title {
  font-size: 1.2rem;
  color: #1e293b;
  margin: 0;
}

.blog-count {
  font-size: 0.85rem;
  color: #94a3b8;
}

.blog-form-card {
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  margin-bottom: 20px;
  animation: fadeIn 0.2s ease;
}

.blog-form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #f1f5f9;
  border-bottom: 1px solid #e2e8f0;
}

.blog-form-header h3 {
  margin: 0;
  font-size: 1rem;
  color: #1e293b;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #94a3b8;
  cursor: pointer;
  padding: 0 4px;
  line-height: 1;
}

.btn-close:hover {
  color: #ef4444;
}

.blog-form-body {
  padding: 20px;
}

.blog-form-row {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.blog-form-group {
  margin-bottom: 16px;
}

.blog-form-group label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #475569;
  margin-bottom: 6px;
}

.blog-form-group .required {
  color: #ef4444;
}

.date-group {
  max-width: 200px;
  flex-shrink: 0;
}

.flex-1 {
  flex: 1;
}

.content-hint {
  font-size: 0.78rem;
  color: #94a3b8;
  margin-bottom: 8px;
  background: #f8fafc;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.blog-form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.blog-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.blog-card-admin {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px 18px;
  transition: box-shadow 0.15s;
}

.blog-card-admin:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.blog-card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.blog-card-date {
  font-size: 0.8rem;
  color: #94a3b8;
  font-weight: 500;
}

.blog-card-actions {
  display: flex;
  gap: 4px;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 6px;
  font-size: 1rem;
  transition: background 0.15s;
}

.btn-icon:hover {
  background: #f1f5f9;
}

.blog-card-title {
  margin: 0 0 6px;
  font-size: 1.05rem;
  color: #1e293b;
  font-weight: 700;
}

.blog-card-summary {
  margin: 0 0 10px;
  font-size: 0.88rem;
  color: #64748b;
  line-height: 1.4;
}

.blog-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  border-top: 1px solid #f1f5f9;
}

.blog-card-length {
  font-size: 0.78rem;
  color: #94a3b8;
}

.blog-card-preview {
  font-size: 0.82rem;
  color: #3b82f6;
  text-decoration: none;
  font-weight: 600;
}

.blog-card-preview:hover {
  text-decoration: underline;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #94a3b8;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 10px;
}

.empty-hint {
  font-size: 0.88rem;
  margin-top: 4px;
}

@media (max-width: 768px) {
  .blog-form-row {
    flex-direction: column;
  }
  .date-group {
    max-width: 100%;
  }
}

.reservation-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.btn-refresh {
  background: #f1f5f9;
  color: #1e293b;
}

.loading-text {
  font-size: 0.85rem;
  color: #64748b;
}

.empty-state {
  font-size: 0.95rem;
  color: #64748b;
  text-align: center;
  padding: 20px 0;
}

.reservations-sections {
  display: flex;
  flex-direction: column;
  gap: 36px;
}

.reservation-section {
  background: white;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e2e8f0;
}

.section-header h2 {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.active-section h2 {
  color: #16a34a;
}

.completed-section h2 {
  color: #0284c7;
}

.canceled-section h2 {
  color: #ef4444;
}

.count-badge {
  background: #f1f5f9;
  color: #475569;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 700;
}

.reservations-list {
  display: grid;
  gap: 12px;
}

.reservation-card {
  background: #f8fafc;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid #e2e8f0;
  transition: all 0.2s;
}

.reservation-card:hover {
  border-color: #cbd5e1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.reservation-card.completed {
  background: #f0f9ff;
  border-color: #bae6fd;
}

.reservation-card.canceled {
  background: #fef2f2;
  border-color: #fecaca;
  opacity: 0.8;
}

.reservation-header-clickable {
  padding: 16px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  user-select: none;
  transition: background 0.2s;
}

.reservation-header-clickable:hover {
  background: rgba(255, 255, 255, 0.5);
}

.header-left-content {
  flex: 1;
  min-width: 0;
}

.header-left-content h3 {
  margin: 0 0 4px 0;
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
}

.reservation-date {
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 500;
}

.header-right-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.reservation-total-mini {
  font-size: 0.95rem;
  font-weight: 800;
  color: #0f766e;
  white-space: nowrap;
}

.collapse-icon {
  font-size: 0.8rem;
  color: #64748b;
  transition: transform 0.3s;
  display: flex;
  align-items: center;
}

.collapse-icon.collapsed {
  transform: rotate(-90deg);
}

.reservation-details {
  padding: 0 16px 16px 16px;
  animation: slideDown 0.3s ease-out;
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

.reservation-meta {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  font-size: 0.85rem;
  color: #64748b;
  margin-bottom: 12px;
}

.reservation-products {
  display: grid;
  gap: 8px;
  background: white;
  padding: 12px;
  border-radius: 10px;
  margin-bottom: 12px;
  border: 1px solid #e2e8f0;
}

.reservation-product {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #1e293b;
}
.reservation-product .item-price {
  font-weight: 700;
  color: #0f766e;
}
.product-link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}
.product-link:hover {
  color: #2563eb;
  text-decoration: underline;
}

.reservation-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  padding-top: 8px;
  border-top: 1px solid #e2e8f0;
}
</style>
