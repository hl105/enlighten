<script setup lang="ts">
import SpaceObjectComponent from "@/components/Viewing/SpaceObjectComponent.vue";
import { PlanetInfo, PlanetVisibilityService } from "@/stores/spaceView";
import { onBeforeMount, ref } from "vue";

const planetVisibilityService = new PlanetVisibilityService();
const spaceObjects = ref<PlanetInfo[]>([]); // Store fetched planets here
const error = ref(""); // Handle errors

/**
 * Fetch the user's current location using the Geolocation API.
 */
async function getUserLocation(): Promise<{ latitude: number; longitude: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Geolocation is not supported by your browser.");
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        reject("Unable to retrieve your location.");
      },
    );
  });
}

/**
 * Fetch visible planets based on user's location.
 */
async function fetchSpaceObjects() {
  try {
    const location = await getUserLocation();
    spaceObjects.value = await planetVisibilityService.getVisiblePlanets(location.latitude, location.longitude);
    console.log(spaceObjects.value);
  } catch (err: any) {
    error.value = err.message || "An error occurred while fetching space objects.";
  }
}

onBeforeMount(fetchSpaceObjects);
</script>

<template>
  <div class="row">
    <h1>Space Objects Visible Now</h1>
  </div>
  <section class="space-objects" v-if="spaceObjects.length !== 0">
    <article v-for="object in spaceObjects" :key="object.name">
      <SpaceObjectComponent :planetData="object" />
    </article>
  </section>
  <div v-else>
    <p>Space objects loading... (takes ~10 seconds)</p>
    <p>If it is the first time try refreshing.</p>
  </div>
</template>

<style scoped>
h1,
p {
  color: white;
}
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section,
p,
.row {
  margin: 0 auto;
  max-width: 60em;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

.space-objects {
  padding: 1em;
}

.row {
  display: flex;
  justify-content: center;
  margin: 0 auto;
  max-width: 60em;
}

.error {
  color: red;
  font-weight: bold;
}
</style>
