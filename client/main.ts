import "@/assets/main.css";
import "purecss";

import { definePreset } from "@primevue/themes";
import Aura from "@primevue/themes/aura";
import { createPinia } from "pinia";
import piniaPluginPersistedState from "pinia-plugin-persistedstate";
import "primeicons/primeicons.css";
import Card from "primevue/card";
import PrimeVue from "primevue/config";
import Galleria from "primevue/galleria";
import Panel from "primevue/panel";
import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: "{#CEEAFF}",
      100: "#B4DEFF",
      200: "#8DC1E8",
      300: "#68ABDF",
      400: "#4997D3",
      500: "#3087C9",
      600: "#1773B9",
      700: "#0A61A3", //main color
      800: "#0B5892",
      900: "#0B4D7F",
      950: "#093B61",
    },
  },
});
const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedState);

app.use(pinia);
app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: MyPreset,
    options: {
      darkModeSelector: "never", // system / manual /always
    },
  },
});

app.component("PrimePanel", Panel);
app.component("PrimeCard", Card);
app.component("PrimeGalleria", Galleria);
app.mount("#app");
