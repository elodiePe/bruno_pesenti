<template>
  <div class="boxes">
    <div class="box">
      <h1>{{ $t("contact.title") }}</h1>
      <p v-html="$t('contact.description')"> </p>
    </div>
  </div>
</template>



import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import fs from "fs";
import path from "path";

import projects from "./src/assets/data/projects.json";

function generateDuplicateIndexHtmlPlugin() {
	return {
		name: "duplicate-index-html",
		apply: "build",
		writeBundle() {
			const indexPath = path.resolve(__dirname, "dist/index.html");
			const routes = ["/", "/projects"];
			

			routes.forEach((route) => {
				const routePath = path.resolve(__dirname, dist${route === "/" ? "/index" : route}.html);
				fs.copyFileSync(indexPath, routePath);
			});
		},
		generateBundle() {
			const distPath = path.resolve(__dirname, "dist/projects");
			if (!fs.existsSync(distPath)) {
				fs.mkdirSync(distPath, { recursive: true });
			}
		},
	};
}

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue(), generateDuplicateIndexHtmlPlugin()],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
	publicPath: process.env.NODE_ENV === "production" ? "/" : "/",
	base: process.env.NODE_ENV === "production" ? "/" : "/",
});