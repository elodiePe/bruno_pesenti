<template>
    <div class="boxes">
        <div class="box">
            <!-- <nav v-if="selectedArticle" class="breadcrumb">
                <RouterLink to="/blog" style="color: #c86412">Blog</RouterLink>
                <span> &gt; </span>
                <span>{{ selectedArticle.title }}</span>
            </nav> -->
            <h1 v-if="!selectedArticle" class="blog-title">Blog</h1>
            <div v-if="!selectedArticle">
                <div class="blog-grid">
                    <div v-for="article in paginatedArticles" :key="article._id || article.id" class="blog-card"
                        @click="goToArticle(article._id || article.id)">
                        <h2>{{ article.title }}</h2>
                        <p class="blog-date">{{ article.date }}</p>
                        <p class="blog-summary">{{ article.summary }}</p>
                        <button class="read-btn">Lire l'article</button>
                    </div>
                </div>
                <div class="pagination" v-if="totalPages > 1">
                    <button :disabled="currentPage === 1" @click="currentPage--" class="page-btn">
                        ‹
                    </button>
                    <span>Page {{ currentPage }} / {{ totalPages }}</span>
                    <button :disabled="currentPage === totalPages" @click="currentPage++" class="page-btn">
                        ›
                    </button>
                </div>
            </div>
            <div v-if="selectedArticle" class="blog-article">
                <button class="back-btn" @click="router.push({ name: 'blog' })">← Retour au blog</button>
                <h2>{{ selectedArticle.title }}</h2>
                <p class="blog-date">
                    <em>{{ selectedArticle.date }}</em>
                </p>
                <div class="article-content" v-html="selectedArticle.content"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRoute, useRouter, RouterLink } from "vue-router";
import { api } from "../services/api.js";

const fallbackArticles = [
    {
        id: 1,
        title: "Lancement du site",
        summary: "Découvrez le nouveau site de Bruno Pesenti et ses fonctionnalités.",
        date: "2024-08-11",
        content: `<p>Bienvenue sur le nouveau site ! Ici vous trouverez toutes les actualités, événements et conseils autour de l'horlogerie et de la restauration.</p>`,
    },
    {
        id: 3,
        title: "Le plus petit musée d'horlogerie",
        summary: "Devant mon atelier à Genève, j'ai récemment mis en place un petit musée sur l'horlogerie.",
        date: "2025-07-20",
        content: "<p>Afin de partager des petits éléments sur l'horlogerie, j'ai mis en place une vitrine remplie de plein d'éléments horloger avec des explications. Elle est tout le temps ouverte, et est même visitable avec une lampe de poche :). Le but de cette vitrine c'est de partager ma connaissance et mon amour de l'horlogerie. Venez découvrir le magnifique monde de l'horlogerie.</p>",
    },
    {
        id: 4,
        title: "Boutique en ligne et blog — Les nouveautés du site !",
        summary: "Découvrez les deux nouvelles rubriques du site : une boutique en ligne pour réserver des pièces, et un blog pour suivre l'actualité.",
        date: "2026-06-24",
        content: `<p>Le site de Bruno Pesenti s'agrandit avec deux nouvelles sections :</p>
<h3>🛍️ Une boutique en ligne</h3>
<p>Vous pouvez désormais consulter les produits disponibles directement sur le site, voir les photos et réserver les pièces qui vous intéressent. Rendez-vous dans la rubrique <a href='/produits'>Produits</a>.</p>
<h3>📝 Un blog</h3>
<p>Cette nouvelle rubrique regroupe des articles sur l'horlogerie, les coulisses de l'atelier et les articles de presse.</p>
<p>Bonne visite !</p>`,
    },
    {
        id: 5,
        title: "The Last Cabinotier of Saint Gervais",
        summary: "Un portrait fascinant de Bruno Pesenti par SJX Watches.",
        date: "2020-11-09",
        content: `<p>Bruno Pesenti is one of the few watchmakers who can still fix anything pre-quartz.</p>
<p><em>Original article by Alan Downing on <a href='https://watchesbysjx.com/2020/11/bruno-pesenti-geneva-watchmaker.html' target='_blank' rel='noopener'>SJX Watches</a> (09.11.2020)</em></p>`,
    },
    {
        id: 6,
        title: "Un horloger encore accroché au quartier historique de Saint-Gervais",
        summary: "Article de Watchonista sur Bruno Pesenti.",
        date: "2013-12-12",
        content: `<p>Article original par Michele Caracciolo sur <a href='https://www.watchonista.com/fr/articles/un-horloger-encore-accroche-au-quartier-historique-de-saint-gervais' target='_blank' rel='noopener'>Watchonista</a> (12.12.2013)</p>`,
    },
];

const articles = ref([]);
const route = useRoute();
const router = useRouter();

const selectedArticle = ref(null);
const currentPage = ref(1);
const articlesPerPage = 6;

const totalPages = computed(() => Math.ceil(articles.value.length / articlesPerPage));
const paginatedArticles = computed(() => {
    const start = (currentPage.value - 1) * articlesPerPage;
    return articles.value.slice(start, start + articlesPerPage);
});

function goToArticle(id) {
    router.push({ name: "blogArticle", params: { id } });
}

function loadArticleFromRoute() {
    const id = route.params.id;
    if (id) {
        const found = articles.value.find((a) => String(a._id || a.id) === id);
        selectedArticle.value = found || null;
    } else {
        selectedArticle.value = null;
    }
}

watch(
    () => route.params.id,
    () => loadArticleFromRoute(),
    { immediate: true }
);

onMounted(async () => {
    try {
        const res = await api.getBlogArticles();
        if (res.success && res.data.length > 0) {
            articles.value = res.data;
            loadArticleFromRoute();
            return;
        }
    } catch (e) {
        console.warn('API indisponible, utilisation des articles de secours');
    }
    articles.value = fallbackArticles;
    loadArticleFromRoute();
});
</script>
<style scoped>
.blog-title {
    font-size: 2.2rem;
    margin-bottom: 2rem;
    color: #4c6a65;
    text-align: center;
    letter-spacing: 1px;
}

.blog-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 2rem;
}

.blog-card {
    background: #f8f8f8;
    border-radius: 12px;
    box-shadow: 0 2px 8px #0001;
    padding: 1.5rem 1.2rem;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    border: 1px solid #e0e0e0;
}

.blog-card:hover {
    transform: translateY(-4px) scale(1.03);
    box-shadow: 0 4px 16px #0002;
    border-color: #c86412;
}

.blog-card h2 {
    margin: 0 0 0.5rem 0;
    font-size: 1.3rem;
    color: #4c6a65;
}

.blog-date {
    font-size: 0.95rem;
    color: #888;
    margin-bottom: 0.7rem;
}

.blog-summary {
    flex: 1;
    color: #444;
    margin-bottom: 1.2rem;
}

.read-btn {
    background: #c86412;
    color: #fff;
    border: none;
    border-radius: 6px;
    padding: 0.5rem 1.2rem;
    font-weight: 600;
    cursor: pointer;
    align-self: flex-end;
    transition: background 0.2s;
}

.read-btn:hover {
    background: #a04e0a;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 2rem 0 1rem 0;
    gap: 1.5rem;
}

.page-btn {
    background: #4c6a65;
    color: #fff;
    border: none;
    border-radius: 50%;
    width: 2.2rem;
    height: 2.2rem;
    font-size: 1.3rem;
    cursor: pointer;
    transition: background 0.2s;
}

.page-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
}

.blog-article {
    margin-top: 2rem;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 8px #0001;
    padding: 2rem 1.5rem;
    color: #222;
}

.breadcrumb {
    margin-bottom: 1rem;
    font-size: 1rem;
}

.breadcrumb span {
    font-weight: 500;
}

.back-btn {
    background: transparent;
    color: #4c6a65;
    border: 1px solid #4c6a65;
    border-radius: 6px;
    padding: 0.4rem 1rem;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
    margin-bottom: 1rem;
}

.back-btn:hover {
    background: #4c6a65;
    color: #fff;
}

.article-content p {
    margin-bottom: 1rem;
    line-height: 1.7;
}

.article-content a {
    color: #c86412;
    text-decoration: underline;
    font-weight: 500;
}

.article-content a:hover {
    color: #a04e0a;
}

.article-content h3 {
    color: #4c6a65;
    margin: 1.2rem 0 0.5rem;
}
</style>
