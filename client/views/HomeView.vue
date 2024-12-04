<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { ref } from "vue";
const userStore = useUserStore();

const images = ref([
  {
    itemImageSrc: "https://i.imgur.com/Y7ZUx2E.jpeg",
    thumbnailImageSrc: "https://i.imgur.com/Y7ZUx2E.jpeg",
    alt: "sea turtle",
    title: "Source: Sea Turtle Conservatory",
  },
  {
    itemImageSrc: "https://i.imgur.com/JCchgC1.png",
    thumbnailImageSrc: "https://i.imgur.com/JCchgC1.png",
    alt: "dark sky",
    title: "International Dark Sky Association",
  },
  {
    itemImageSrc: "https://i.imgur.com/EBgb2d4.jpeg",
    thumbnailImageSrc: "https://i.imgur.com/EBgb2d4.jpeg",
    alt: "dark sky",
    title: "WVU Planetarium - West Virginia University",
  },
]);
</script>

<template>
  <main>
    <div class="animation">
      <span></span>
      <span></span>
      <span></span>
    </div>
    <section>
      <div class="logged-in">
        <h1>Welcome, <br />{{ userStore.currentUsername }}</h1>
      </div>
    </section>
    <section v-animateonscroll class="section">
      <PrimePanel header="Why Enlighten?" class="custom-panel" toggleable :collapsed="true">
        <p>Enlighten aims to provide users with a comprehensive experience for understanding and appreciating the night sky, while fostering awareness about light pollution.</p>
        <ul>
          <li>Discover constellations and celestial events.</li>
          <li>Connect with a community passionate about astronomy.</li>
          <li>Learn how to reduce light pollution and protect our skies.</li>
        </ul>
      </PrimePanel>
    </section>

    <!-- Features Section -->
    <section v-animateonscroll class="section">
      <PrimePanel header="App Features" class="custom-panel" toggleable :collapsed="true">
        <p>Explore the app's unique features by clicking the hamburger icon on the top left</p>
        <div class="card-container">
          <div class="cards">
            <PrimeCard class="PrimeCard">
              <template #header>
                <img alt="user header" src="/client/assets/images/map.png" class="card-header-img" />
              </template>
              <template #title>Map</template>
              <template #subtitle>find posts around you</template>
              <template #content>
                <p class="m-0">Explore the map to <br />find what other stargazers have posted around you!</p>
              </template>
            </PrimeCard>
            <PrimeCard class="PrimeCard">
              <template #header>
                <img alt="user header" src="/client/assets/images/default_profile.png" class="card-header-img" />
              </template>
              <template #title>Post</template>
              <template #subtitle>Share what you saw in the night sky today</template>
              <template #content>
                <p class="m-0">
                  You can get badges by: <br />
                  <li>
                    adding hashtags like "moon", "constellation",<br />
                    "northern lights"
                  </li>
                  <li>or if you post frequently!</li>
                </p>
              </template>
            </PrimeCard>
          </div>
          <div class="cards">
            <PrimeCard class="PrimeCard" toggleable :collapsed="true">
              <template #header>
                <img alt="user header" src="/client/assets/images/default_profile.png" class="card-header-img" />
              </template>
              <template #title>Forums</template>
              <template #subtitle>Find your people</template>
              <template #content>
                <p class="m-0">Jump right into a community and share your experiences!</p>
              </template>
            </PrimeCard>
            <PrimeCard class="PrimeCard">
              <template #header>
                <img alt="user header" src="/client/assets/images/default_profile.png" class="card-header-img" />
              </template>
              <template #title>Find</template>
              <template #subtitle>Locate Space Objects</template>
              <template #content>
                <p class="m-0">Find space objects observable near you, like constellations!</p>
              </template>
            </PrimeCard>
          </div>
        </div>
      </PrimePanel>
    </section>

    <!-- Light Pollution Awareness Section -->
    <section v-animateonscroll class="section">
      <PrimePanel header="Light Pollution Awareness" class="custom-panel" toggleable :collapsed="true">
        <p>
          Light pollution is a growing issue that dims our view of the stars and disrupts ecosystems. <br />
          Together, we can take steps to reduce its impact.
        </p>
        <a href="https://www.nps.gov/subjects/nightskies/lightpollution.htm" style="color: white; font-size: 1.5rem">Excerpt from Globe at Night:</a>
        <p>Below is an excerpt from one of the Globe at Night articles:</p>
        <p>
          In disrupting ecosystems, light pollution poses a serious threat in particular to nocturnal wildlife, having negative impacts on plant and animal physiology. It can confuse the migratory
          patterns of animals, alter competitive interactions of animals, change predator-prey relations, and cause physiological harm. The rhythm of life is orchestrated by the natural diurnal
          patterns of light and dark; so disruption to these patterns impacts the ecological dynamics. <br />
        </p>
        <PrimeGalleria :value="images" :numVisible="3" :circular="true" containerStyle="max-width: 640px" :showItemNavigators="true" :showThumbnails="false">
          <template #item="slotProps">
            <img :src="slotProps.item.itemImageSrc" :alt="slotProps.item.alt" style="width: 100%; display: block" />
          </template>
          <template #thumbnail="slotProps">
            <img :src="slotProps.item.thumbnailImageSrc" :alt="slotProps.item.alt" style="display: block" />
          </template>
        </PrimeGalleria>
        <p>
          With respect to adverse health effects, many species, especially humans, are dependent on natural body cycles called circadian rhythms and the production of melatonin, which are regulated by
          light and dark (e.g., day and night). If humans are exposed to light while sleeping, melatonin production can be suppressed. This can lead to sleep disorders and other health problems such
          as increased headaches, worker fatigue, medically defined stress, some forms of obesity due to lack of sleep and increased anxiety. And ties are being found to a couple of types of cancer.
          There are also effects of glare on aging eyes. Health effects are not only due to over-illumination or excessive exposure of light over time, but also improper spectral composition of light
          (e.g., certain colors of light).
        </p>
      </PrimePanel>
    </section>
  </main>
</template>

<style scoped>
.card-container {
  display: flex;
  flex-direction: column;
  gap: 2em;
}
.cards {
  display: flex;
  flex-direction: row;
  gap: 2em;
}

.card-header-img {
  width: 100%;
  height: auto;
  max-height: 200px;
  object-fit: cover;
}

.PrimeCard {
  overflow: hidden;
  --p-card-background: rgba(0, 0, 0, 0.8);
}

main,
p,
li {
  color: #fff;
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
}

.custom-panel {
  background: rgba(0, 0, 0, 0.4);
  color: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

>>> .p-panel-header {
  color: white;
  font-size: 2rem;
  font-weight: bold;
}

.section {
  margin: 2rem auto;
  max-width: 800px;
  padding: 1rem;
  text-align: center;
  display: flex;
  justify-content: center;
}

.logged-in {
  text-align: center;
  margin-top: 2rem;
}

.animation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* background: linear-gradient(to bottom, #005eff, #003d99); */
  background-image: url(@/assets/images/wallpaper.png);
  overflow: hidden;
  z-index: -1;
}

/* Shooting stars */
.animation span {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 7px;
  height: 7px;
  background: #fff;
  border-radius: 50%;
  box-shadow:
    0 0 0 4px rgba(255, 255, 255, 0.1),
    0 0 0 8px rgba(255, 255, 255, 0.1),
    0 0 20px rgba(255, 255, 255, 1);
  animation: animate 3s linear infinite;
}

.animation span::before {
  content: "";
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 300px;
  height: 1px;
  background: linear-gradient(90deg, #fff, transparent);
}

/* Shooting stars animation */
@keyframes animate {
  0% {
    transform: rotate(315deg) translateX(0);
    opacity: 1;
  }
  70% {
    opacity: 1;
  }
  100% {
    transform: rotate(315deg) translateX(-1000px);
    opacity: 0;
  }
}

.animation span:nth-child(1) {
  top: 0%;
  left: 50%;
  animation-delay: 0.3s;
  animation-duration: 1s;
}

.animation span:nth-child(2) {
  top: 50%;
  left: 70%;
  animation-delay: -0.5s;
  animation-duration: 3s;
}

.animation span:nth-child(3) {
  top: 80%;
  left: 40%;
  animation-delay: -1s;
  animation-duration: 1.5s;
}

.animation span:nth-child(4) {
  top: 20%;
  left: 10%;
  animation-delay: 3s;
  animation-duration: 2s;
}
</style>
