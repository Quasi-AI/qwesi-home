// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-17",
  devtools: { enabled: true },
  srcDir: "src/",
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt"],
  css: ["~/assets/css/main.css"],
  plugins: ["~/shared/plugins/pinia-persistedstate.client.ts", "~/shared/plugins/firebase.client.ts"],
  app: {
    head: {
      title: `QWESI AI - Your 24/7 Career & Recruitment Assistant`,
      link: [
        {
          rel: "icon",
          type: "image/png",
          href: "https://raw.githubusercontent.com/Quasi-AI/qwesi-home/refs/heads/main/public/favicon.png",
        },
        {
          rel: "shortcut icon",
          href: "https://raw.githubusercontent.com/Quasi-AI/qwesi-home/refs/heads/main/public/favicon.png",
        },
        {
          rel: "apple-touch-icon",
          href: "https://raw.githubusercontent.com/Quasi-AI/qwesi-home/refs/heads/main/public/favicon.png",
        },
      ],
      meta: [
        {
          name: "description",
          content:
            "QWESI AI - Your 24/7 Career & Recruitment Assistant. Get job alerts, homework help, and connect with investors through voice, WhatsApp, and smart conversations.",
        },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
    },
  },
  runtimeConfig: {
    public: {
      firebaseApiKey: "AIzaSyAH_3l6IEAldLkXyB0CXqYpHRwWDvqZjhU",
      firebaseAuthDomain: "park4me-b2127.firebaseapp.com",
      firebaseProjectId: "park4me-b2127",
      firebaseStorageBucket: "park4me-b2127.appspot.com",
      firebaseMessagingSenderId: "372838267059",
      firebaseAppId: "1:372838267059:web:20430ac4e8fe7f2f4cd8c6",
    },
  },
});


