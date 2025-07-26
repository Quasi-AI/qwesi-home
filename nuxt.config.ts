// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-17",
  devtools: { enabled: true },
  srcDir: "src/",
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt"],
  css: ["~/assets/css/main.css"],
  app: {
    head: {
      title: `Qwesi AI`,
      meta: [
        {
          name: "description",
          content:
            "A modern queue management system for seamless flow and efficiency.",
        },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
    },
  },
  runtimeConfig: {
    apiBase: process.env.API_URL,
  },
});
