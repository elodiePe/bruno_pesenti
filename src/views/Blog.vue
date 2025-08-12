<template>
    <div class="boxes">
        <div class="box">
            <nav v-if="selectedArticle" class="breadcrumb">
                <RouterLink to="/blog" style="color: #c86412">Blog</RouterLink>
                <span> &gt; </span>
                <span>{{ selectedArticle.title }}</span>
            </nav>
            <h1 v-if="!selectedArticle" class="blog-title">Blog</h1>
            <div v-if="!selectedArticle">
                <div class="blog-grid">
                    <div v-for="article in paginatedArticles" :key="article.id" class="blog-card"
                        @click="goToArticle(article.id)">
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
                <h2>{{ selectedArticle.title }}</h2>
                <p class="blog-date">
                    <em>{{ selectedArticle.date }}</em>
                </p>
                <div v-html="selectedArticle.content"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRoute, useRouter, RouterLink } from "vue-router";

const articles = [
    {
        id: 1,
        title: "Lancement du site",
        summary:
            "Découvrez le nouveau site de Bruno Pesenti et ses fonctionnalités.",
        date: "2025-08-11",
        content: `<p>Bienvenue sur le nouveau site ! Ici vous trouverez toutes les actualités, événements et conseils autour de l’horlogerie et de la restauration.</p>`,
    },
    {
        id: 2,
        title: "Conseils d’entretien pour vos montres anciennes",
        summary: "Quelques astuces pour préserver vos montres anciennes.",
        date: "2025-08-01",
        content: `<p>Pour garder vos montres en bon état, évitez l’humidité, faites-les réviser régulièrement et manipulez-les avec soin.</p>`,
    },
    // Ajoute ici d'autres articles pour tester la pagination
    {
        id: 3,
        title: "Le plus petit musée d'horlogerie",
        summary:
            "Devant mon atelier à Genève, j'ai récément mis en place un petit musée sur l'horlogerie.",
        date: "2025-07-20",
        content:
            "<p>Afin de partager des petits éléments sur l'horlogerie, j'ai mis en place une vitrine remplie de plein d'éléments horloger avec des explications. Elle est tout le temps ouverte, et est même visitable avec une lampe de poche :). Le but de cette vitrine c'est de partager ma connaissance et mon amour de l'horlogerie. Venez découvrir le magnifique monde de l'horlogerie.</p>",
    },
    {
        id: 4,
        title: "Article 4",
        summary: "Résumé 4",
        date: "2025-07-10",
        content: "<p>Contenu 4</p>",
    },
    {
        id: 5,
        title: "Article 5",
        summary: "Résumé 5",
        date: "2025-07-01",
        content: "<p>Contenu 5</p>",
    },
    {
        id: 6,
        title: "Article 6",
        summary: "Résumé 6",
        date: "2025-06-20",
        content: "<p>Contenu 6</p>",
    },
    {
        id: 7,
        title: "Article 7",
        summary: "Résumé 7",
        date: "2025-06-10",
        content: "<p>Contenu 7</p>",
    },
    {
        id: 8,
        title: "Article 8",
        summary: "Résumé 8",
        date: "2025-06-01",
        content: "<p>Contenu 8</p>",
    },
];

const route = useRoute();
const router = useRouter();

const selectedArticle = ref(null);
const currentPage = ref(1);
const articlesPerPage = 6;

const totalPages = computed(() => Math.ceil(articles.length / articlesPerPage));
const paginatedArticles = computed(() => {
    const start = (currentPage.value - 1) * articlesPerPage;
    return articles.slice(start, start + articlesPerPage);
});

function goToArticle(id) {
    router.push({ name: "BlogArticle", params: { id } });
}

function loadArticleFromRoute() {
    const id = parseInt(route.params.id);
    if (id) {
        const found = articles.find((a) => a.id === id);
        selectedArticle.value = found || null;
    } else {
        selectedArticle.value = null;
    }
}

// Charge l'article si l'URL contient un id
watch(
    () => route.params.id,
    () => loadArticleFromRoute(),
    { immediate: true }
);
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
</style>
