<script setup>
import { computed, onBeforeUnmount, ref } from "vue";
import vitrineImage from "../assets/img/vitrine.jpeg";
import miniMuseeImage from "../assets/img/mini-musee2.jpg";

const objects = [
	{
		id: 1,
		name: "Montre de poche en vitrine",
		type: "Montre ancienne",
		date: "Fin XIXe siècle",
		position: { top: "26%", left: "56%" },
		highlight: "Boîtier doré et cadran clair",
		narration:
			"Cette montre de poche raconte le goût des objets de précision qui peuplent la vitrine. Elle illustre le travail des horlogers genevois et l'attention portée aux détails, du boîtier jusqu'au cadran.",
	},
	{
		id: 2,
		name: "Réveil mécanique",
		type: "Réveil",
		date: "Début XXe siècle",
		position: { top: "62%", left: "70%" },
		highlight: "Un réveil posé parmi les petits instruments",
		narration:
			"Ici, vous voyez un réveil mécanique, un objet qui relie l'usage quotidien à la finesse du mécanisme. Dans le mini-musée, il dialogue avec les montres de collection et rappelle la diversité des objets horlogers.",
	},
	{
		id: 3,
		name: "Horloge de table",
		type: "Pendule",
		date: "Première moitié du XXe siècle",
		position: { top: "42%", left: "42%" },
		highlight: "Pièce centrale de la scénographie",
		narration:
			"Cette horloge de table sert presque de repère au milieu de la vitrine. Sa présence montre que le mini-musée ne parle pas seulement de montres, mais aussi de pendules et d'objets décoratifs liés au temps.",
	},
	{
		id: 4,
		name: "Loupes, outils et pièces d'atelier",
		type: "Objets d'atelier",
		date: "Usage contemporain",
		position: { top: "77%", left: "24%" },
		highlight: "Des outils qui relient la collection à l'atelier",
		narration:
			"La vitrine rassemble aussi des loupes, des outils et de petites pièces de travail. Ces éléments montrent le lien direct entre le mini-musée et l'atelier situé juste devant : ici, la collection et la pratique se répondent.",
	},
	{
		id: 5,
		name: "Montres de gousset alignées",
		type: "Série de montres",
		date: "XIXe - XXe siècles",
		position: { top: "84%", left: "58%" },
		highlight: "Un ensemble parfait pour comparer les styles",
		narration:
			"L'alignement de plusieurs montres permet de comparer les boîtiers, les cadrans et les signatures. C'est l'une des idées du mini-musée : observer, écouter, puis reconnaître les différences entre les objets.",
	},
];

const selectedObject = ref(objects[0]);
const isSpeaking = ref(false);
const activeSentenceIndex = ref(0);
const narrationQueue = ref([]);
const narrationRunId = ref(0);
const supportMessage = ref("");

const speechSupported = computed(() => {
	if (typeof window === "undefined") {
		return false;
	}

	return "speechSynthesis" in window;
});

const introText =
	"Bienvenue dans le mini-musée. Cliquez sur un objet dans la vitrine pour afficher son explication, puis lancez la narration pour l'écouter comme si vous visitiez l'atelier en vrai.";

function getNarrationSegments(object) {
	return `${object.name}. ${object.type}. ${object.date}. ${object.narration}`
		.split(/(?<=[.!?])\s+/)
		.map((segment) => segment.trim())
		.filter(Boolean);
}

function buildNarrationQueue(object) {
	return getNarrationSegments(object);
}

function stopNarration() {
	if (!speechSupported.value) {
		return;
	}

	narrationRunId.value += 1;
	window.speechSynthesis.cancel();
	isSpeaking.value = false;
}

function speakSentenceQueue(object, startIndex = 0) {
	if (!speechSupported.value) {
		supportMessage.value =
			"La narration audio n'est pas disponible dans ce navigateur. Vous pouvez tout de même lire les explications ci-dessous.";
		return;
	}

	supportMessage.value = "";
	stopNarration();

	const queue = buildNarrationQueue(object);
	narrationQueue.value = queue;
	activeSentenceIndex.value = Math.min(startIndex, Math.max(queue.length - 1, 0));
	const runId = narrationRunId.value;
	let index = activeSentenceIndex.value;

	if (!queue.length) {
		return;
	}

	isSpeaking.value = true;

	const speakNext = () => {
		if (runId !== narrationRunId.value) {
			return;
		}

		if (index >= queue.length) {
			isSpeaking.value = false;
			return;
		}

		activeSentenceIndex.value = index;
		const utterance = new SpeechSynthesisUtterance(queue[index]);
		utterance.lang = "fr-FR";
		utterance.rate = 0.95;
		utterance.pitch = 1;
		utterance.volume = 1;
		utterance.onend = () => {
			index += 1;
			speakNext();
		};
		utterance.onerror = () => {
			isSpeaking.value = false;
		};

		window.speechSynthesis.speak(utterance);
	};

	speakNext();
}

function selectObject(object) {
	selectedObject.value = object;
	narrationQueue.value = buildNarrationQueue(object);
	activeSentenceIndex.value = 0;
}

function narrateObject(object = selectedObject.value) {
	selectObject(object);
	speakSentenceQueue(object, 0);
}

function restartNarration() {
	narrateObject(selectedObject.value);
}

function jumpToSentence(nextIndex) {
	const targetIndex = Number(nextIndex);
	if (!Number.isFinite(targetIndex)) {
		return;
	}

	if (targetIndex < 0) {
		return;
	}

	selectObject(selectedObject.value);
	speakSentenceQueue(selectedObject.value, targetIndex);
}

function advanceNarration() {
	const nextIndex = Math.min(activeSentenceIndex.value + 1, Math.max(narrationQueue.value.length - 1, 0));
	jumpToSentence(nextIndex);
}

onBeforeUnmount(() => {
	stopNarration();
});
</script>

<template>
     <div class="boxes">
        <div class="box">
	<main class="museum-page">
		<section class="hero-card">
			<div class="hero-copy">
	
				<h1>Une vitrine à explorer, écouter et comparer</h1>
				<p class="lead">
					{{ introText }}
				</p>

			</div>

		
		</section>

		<section class="experience-grid">
			<article class="museum-scene">
				<div class="scene-header">
					<div>
						<p class="section-label">Carte interactive</p>
						<h2>Cliquez sur les pièces dans la vitrine</h2>
                        	<p>
						Chaque point ouvre une fiche avec une narration audio.
					</p>
					</div>
				
				</div>

				<div class="vitrine-frame">
					<img :src="vitrineImage" alt="Vitrine du mini-musée avec montres et objets" />

					<button
						v-for="object in objects"
						:key="object.id"
						class="hotspot"
						type="button"
						:class="{ active: selectedObject.id === object.id }"
						:style="{ top: object.position.top, left: object.position.left }"
						:aria-label="`Afficher ${object.name}`"
						@click="selectObject(object)"
					>
						<span></span>
					</button>
				</div>
			</article>

			<aside class="details-panel">
				<p class="section-label">Pièce sélectionnée</p>
				<h2>{{ selectedObject.name }}</h2>
				<p class="object-meta">
					{{ selectedObject.type }} · {{ selectedObject.date }}
				</p>
				<p class="object-narration">{{ selectedObject.narration }}</p>

				<div class="panel-actions">
					<button
						class="icon-button"
						type="button"
						aria-label="Écouter la pièce"
						title="Écouter la pièce"
						@click="narrateObject(selectedObject)"
					>
						<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
					</button>
					<button
						v-if="isSpeaking"
						class="icon-button"
						type="button"
						aria-label="Recommencer la narration"
						title="Recommencer"
						@click="restartNarration"
					>
						<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5V2L7 7l5 5V9c3.31 0 6 2.69 6 6a6 6 0 1 1-6-6v-4a10 10 0 1 0 10 10c0-5.52-4.48-10-10-10z" /></svg>
					</button>
					<button
						class="icon-button"
						type="button"
						aria-label="Avancer dans la narration"
						title="Avancer"
						@click="advanceNarration"
					>
						<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l8.5 6L6 18V6zm8 0l8.5 6-8.5 6V6z" /></svg>
					</button>
					<button
						class="icon-button"
						type="button"
						aria-label="Arrêter la narration"
						title="Arrêter"
						@click="stopNarration"
					>
						<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6h12v12H6z" /></svg>
					</button>
				</div>

				<div class="timeline">
					<div class="timeline-header">
						<span>Timeline</span>
						<span>{{ activeSentenceIndex + 1 }} / {{ narrationQueue.length || 1 }}</span>
					</div>
					<input
						type="range"
						:min="0"
						:max="Math.max(narrationQueue.length - 1, 0)"
						:step="1"
						:value="activeSentenceIndex"
						@input="jumpToSentence($event.target.value)"
					/>
				</div>

				<!-- <div class="selected-card">
					<p>Dans cette vitrine, vous pouvez observer les montres, les pendules, les réveils et les petits objets d'atelier qui racontent le quotidien de l'horlogerie.</p>
				</div> -->
			</aside>
		</section>

		<section class="object-strip">
			<div class="strip-head">
				<div>
					<p class="section-label">Explorer la collection</p>
					<h2>Choisissez une pièce pour écouter son histoire</h2>
				</div>
	
			</div>

			<div class="cards">
				<button
					v-for="object in objects"
					:key="object.id"
					type="button"
					class="object-card"
					:class="{ selected: selectedObject.id === object.id }"
					@click="selectObject(object)"
				>
					<span class="card-index">0{{ object.id }}</span>
					<strong>{{ object.name }}</strong>
					<span>{{ object.type }}</span>
					<small>{{ object.date }}</small>
					<em>{{ object.highlight }}</em>
				</button>
			</div>


		</section>
	</main>
    </div>
    </div>
</template>

<style scoped>
.museum-page {
	display: grid;
	gap: 1.5rem;
	padding: 1.5rem;
	color: #1f1a17;
}

h2{
    text-align: left;
}

.experience-grid,
.object-strip {
	border: 1px solid rgba(76, 106, 101, 0.16);
	background: linear-gradient(180deg, rgba(255, 250, 244, 0.96), rgba(249, 243, 235, 0.92));
	box-shadow: 0 24px 60px rgba(26, 20, 15, 0.16);
	backdrop-filter: blur(10px);
}

.hero-card {
	display: grid;
	gap: 1.5rem;
	grid-template-columns: minmax(0, 1.15fr) minmax(280px, 0.85fr);
	padding: 1.5rem;
	/* border-radius: 28px; */
}





.eyebrow,
.section-label {
	margin: 0 0 0.55rem;
	text-transform: uppercase;
	letter-spacing: 0.16em;
	font-size: 0.72rem;
	color: #4c6a65;
	font-weight: 700;
}

.lead,
.scene-instruction,
.object-meta,
.object-highlight,
.object-narration,
.support-note,
.strip-head p,
.tour-note p {
	color: #4f463f;
	line-height: 1.65;
}

.hero-actions,
.panel-actions {
	display: flex;
	flex-wrap: wrap;
	gap: 0.75rem;
	margin-top: 1.25rem;
}

.primary,
.secondary,
.ghost {
	border: 0;
	border-radius: 999px;
	padding: 0.85rem 1.1rem;
	font: inherit;
	font-weight: 700;
	text-decoration: none;
	transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.primary {
	background: #4c6a65;
	color: #fff;
	box-shadow: 0 14px 25px rgba(76, 106, 101, 0.24);
}

.secondary {
	background: #deb887;
	color: #1f1a17;
}

.ghost {
	background: rgba(255, 255, 255, 0.65);
	color: #1f1a17;
	border: 1px solid rgba(76, 106, 101, 0.16);
}

.primary:hover,
.secondary:hover,
.ghost:hover,
.object-card:hover {
	transform: translateY(-1px);
}

.hotspot:hover {
	transform: translate(-50%, -50%);
}

.support-note {
	margin-top: 1rem;
	padding: 0.9rem 1rem;
	border-radius: 18px;
	background: rgba(76, 106, 101, 0.1);
}

.hero-visual {
	position: relative;
	min-height: 320px;
	border-radius: 24px;
	overflow: hidden;
	background: #1c1a18;
}

.hero-visual img,
.vitrine-frame img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	display: block;
}

.visual-overlay {
	position: absolute;
	inset: auto 0 0;
	display: flex;
	justify-content: space-between;
	gap: 0.5rem;
	padding: 0.95rem;
	background: linear-gradient(180deg, rgba(18, 14, 11, 0), rgba(18, 14, 11, 0.76));
	color: #fff;
	font-size: 0.82rem;
	font-weight: 700;
}

.experience-grid {
	display: grid;
	gap: 1.2rem;
	grid-template-columns: minmax(0, 1.45fr) minmax(280px, 0.8fr);
	padding: 1.2rem;
	border-radius: 28px;
}

.museum-scene,
.details-panel,
.object-strip {
	border-radius: 22px;
}

.museum-scene {
	padding: 0.25rem;
}

.scene-header,
.strip-head {
	display: flex;
	justify-content: space-between;
	gap: 1rem;
	align-items: end;
	margin-bottom: 1rem;
}
.scene-header{
    display: flex;
    flex-direction: column;
}
.scene-header h2,
.strip-head h2,
.details-panel h2 {
	font-size: clamp(1.35rem, 2vw, 2rem);
}

.vitrine-frame {
	position: relative;
	min-height: 500px;
    width: 100%;
	border-radius: 24px;
	overflow: hidden;
	border: 1px solid rgba(76, 106, 101, 0.14);
	background: #151311;
}

.vitrine-frame::after {
	content: "";
	position: absolute;
	inset: 0;
	background: linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(0, 0, 0, 0.08));
	pointer-events: none;
}

.hotspot {
	position: absolute;
	transform: translate(-50%, -50%);
	width: 1.9rem;
	height: 1.9rem;
	border: 0;
	border-radius: 50%;
	background: rgba(219, 93, 84, 0.88);
	box-shadow: 0 0 0 0.45rem rgba(222, 184, 135, 0.18);
	display: grid;
	place-items: center;
	cursor: pointer;
	z-index: 2;
}

.hotspot span {
	width: 0.7rem;
	height: 0.7rem;
	border-radius: 50%;
	background: #fff;
}

.hotspot.active {
	background: #eb2102;
	box-shadow: 0 0 0 0.55rem rgba(76, 106, 101, 0.2);
}

.details-panel {
	display: flex;
	flex-direction: column;
	gap: 0.9rem;
	padding: 1.2rem;
	background: rgba(255, 255, 255, 0.46);
	border: 1px solid rgba(76, 106, 101, 0.16);
}

.icon-button {
	display: inline-grid;
	place-items: center;
	width: 3rem;
	height: 3rem;
	padding: 0;
	border: 1px solid rgba(76, 106, 101, 0.16);
	border-radius: 999px;
	background: rgba(255, 255, 255, 0.9);
	color: #4c6a65;
	cursor: pointer;
	transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.icon-button:hover {
	transform: translateY(-1px);
	box-shadow: 0 10px 20px rgba(76, 106, 101, 0.12);
	background: #fff;
}

.icon-button svg {
	width: 1.25rem;
	height: 1.25rem;
	fill: currentColor;
}

.timeline {
	display: grid;
	gap: 0.5rem;
	padding: 0.85rem 1rem;
	border-radius: 18px;
	background: rgba(76, 106, 101, 0.08);
}

.timeline-header {
	display: flex;
	justify-content: space-between;
	gap: 1rem;
	font-size: 0.85rem;
	font-weight: 700;
	color: #4c6a65;
}

.timeline input[type="range"] {
	width: 100%;
	accent-color: #4c6a65;
}

.object-meta {
	margin: 0;
	font-weight: 700;
}

.object-highlight {
	margin: 0;
	padding: 0.9rem 1rem;
	border-radius: 18px;
	background: rgba(76, 106, 101, 0.1);
}

.object-narration {
	margin: 0;
}

.selected-card {
	margin-top: auto;
	padding: 1rem;
	border-radius: 18px;
	background: linear-gradient(180deg, rgba(76, 106, 101, 0.14), rgba(222, 184, 135, 0.18));
}

.selected-card p {
	margin: 0;
	line-height: 1.65;
}

.object-strip {
	padding: 1.2rem;
	border-radius: 28px;
}

.cards {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
	gap: 0.85rem;
}

.object-card {
	display: flex;
	flex-direction: column;
	gap: 0.45rem;
	align-items: flex-start;
	text-align: left;
	min-height: 190px;
	padding: 1rem;
	border: 1px solid rgba(76, 106, 101, 0.14);
	border-radius: 20px;
	background: rgba(255, 255, 255, 0.82);
	color: inherit;
	cursor: pointer;
}

.object-card.selected {
	border-color: rgba(76, 106, 101, 0.42);
	box-shadow: 0 16px 32px rgba(76, 106, 101, 0.12);
	background: linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(240, 245, 242, 0.98));
}

.card-index {
	font-size: 0.76rem;
	letter-spacing: 0.14em;
	color: #4c6a65;
}

.object-card strong {
	font-size: 1.02rem;
}

.object-card span,
.object-card small,
.object-card em {
	font-style: normal;
	color: #5b524b;
}

.tour-note {
	margin-top: 1rem;
	padding: 0.95rem 1rem;
	border-radius: 18px;
	background: rgba(222, 184, 135, 0.16);
}

@media (max-width: 980px) {
	.hero-card,
	.experience-grid,
	.scene-header,
	.strip-head {
		grid-template-columns: 1fr;
		flex-direction: column;
		align-items: flex-start;
	}

	.vitrine-frame {
		min-height: 520px;
	}
}

@media (max-width: 720px) {
	.museum-page {
		padding: 0.8rem;
	}

	.hero-card,
	.experience-grid,
	.object-strip {
		padding: 1rem;
		border-radius: 20px;
	}

	.hero-actions,
	.panel-actions {
		flex-direction: row;
		flex-wrap: wrap;
		align-items: center;
		justify-content: flex-start;
	}

	.primary,
	.secondary,
	.ghost {
		width: auto;
		text-align: left;
	}

	.panel-actions .icon-button {
		width: 2.7rem;
		height: 2.7rem;
	}

	.vitrine-frame {
		min-height: 420px;
	}
}
</style>
