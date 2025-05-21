import tailwindcss from "@tailwindcss/vite";

import "./lib/env";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",

  modules: ["@nuxt/eslint", "@nuxt/icon", "@nuxtjs/color-mode", "@pinia/nuxt"],
  eslint: {
    config: {
      standalone: false, // <---
    },
  },
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  colorMode: {
    dataValue: "theme",
  },
});
