<script setup lang="ts">
import { PlanetInfo } from '@/stores/spaceView';

// Define the props to accept a PlanetInfo object
const props = defineProps<{
  planetData: PlanetInfo; // The planet data is now passed in as a prop
}>();
</script>
<template>
  <div class="base">
    <img :src="props.planetData.imageUrl" :alt="`${props.planetData.name} Image`" />
    <article>
      <h2>{{ props.planetData.name }}</h2>
      <p><strong>Constellation:</strong> {{ props.planetData.constellation }}</p>
      <p><strong>Right Ascension:</strong> {{ props.planetData.rightAscension }}</p>
      <p><strong>Declination:</strong> {{ props.planetData.declination }}</p>
      <p><strong>Altitude:</strong> {{ props.planetData.altitude }}°</p>
      <p><strong>Azimuth:</strong> {{ props.planetData.azimuth }}°</p>
      <p><strong>Magnitude:</strong> {{ props.planetData.magnitude }}</p>
      <p><strong>Visible by Naked Eye:</strong> {{ props.planetData.nakedEyeObject ? "Yes" : "No" }}</p>
    </article>
  </div>
</template>

<style scoped>
.base {
  display: flex;
  gap: 1em; /* Adds space between the image and text */
  align-items: center; /* Aligns the image and text vertically */
}

img {
  width: 240px; /* Sets the image width */
  height: 240px; /* Sets the image height */
  object-fit: cover; /* Ensures the image maintains aspect ratio within the dimensions */
  border-radius: 8px;
  flex-shrink: 0; /* Prevents the image from shrinking in a smaller container */
}

article {
  flex: 1; /* Allows the text content to take the remaining space */
}

p {
  margin: 0.5em 0;
}
</style>
