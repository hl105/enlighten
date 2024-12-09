<script setup lang="ts">
import { PlanetInfo } from '@/stores/spaceView';
import { ref } from 'vue';

// Define the props to accept a PlanetInfo object
const props = defineProps<{
  planetData: PlanetInfo; // The planet data is now passed in as a prop
}>();

// Reactive variable to control the visibility of the guide
const showGuide = ref(false);

// Function to toggle the visibility
const toggleGuide = () => {
  showGuide.value = !showGuide.value;
};

</script>
<template>
  <div class="base">
    <img :src="props.planetData.imageUrl" :alt="`${props.planetData.name} Image`" />
    <div class="info-container">
      <article>
        <h2>{{ props.planetData.name }}</h2>
        <p><strong>Constellation:</strong> {{ props.planetData.constellation }}</p>
        <p><strong>Right Ascension:</strong> {{ props.planetData.rightAscension }}</p>
        <p><strong>Declination:</strong> {{ props.planetData.declination }}</p>
        <p><strong>Altitude:</strong> {{ props.planetData.altitude }}</p>
        <p><strong>Azimuth:</strong> {{ props.planetData.azimuth }}</p>
        <p><strong>Magnitude:</strong> {{ props.planetData.magnitude }}</p>
        <p><strong>Visible by Naked Eye:</strong> {{ props.planetData.nakedEyeObject }}</p>
      </article>
      <div>
        <div v-if="showGuide" class="guide">
          <h2>How to view:</h2>
          <p>Use a compass and aim at <strong>{{ props.planetData.altitude }}</strong>.</p>
          <p v-if="props.planetData.nakedEyeObject == 'Yes'">
            Then look <strong>{{ props.planetData.altitude }}</strong> above the horizon.
          </p>
          <p v-else>
            Then look <strong>{{ props.planetData.altitude }}</strong> above the horizon using a telescope.
          </p>
      </div>
      <button @click="toggleGuide">{{ showGuide ? 'Hide' : 'Show' }} Guide</button>
    </div>
    </div>
  </div>
</template>

<style scoped>
.base {
  position: relative; /* Enables absolute positioning for child elements */
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

.info-container {
  display: flex;
  gap: 1em; /* Adds space between the text content */
}

.guide {
  padding-left: 32px;
}

button {
  position: absolute; /* Positions the button relative to .base */
  top: 10px; /* Positions the button 10px from the top of .base */
  right: 10px; /* Positions the button 10px from the right of .base */
  padding: 8px 12px; /* Adds some padding for better usability */
  background-color: #063970; /* Example background color */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 14%;
}

button:hover {
  background-color: #05294f; /* Slightly darker blue on hover */
}
</style>
