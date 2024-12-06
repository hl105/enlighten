<script setup lang="ts">
import { usePostStore } from "@/stores/posts";
import mapboxgl from "mapbox-gl";
import { onMounted, ref, Ref } from "vue";

const postStore = usePostStore();

const mapContainer = ref(null);
const map = ref<mapboxgl.Map | null>(null) as Ref<mapboxgl.Map | null>;

// Set your Mapbox access token
//SHOULD BE SET AS ENVIRONMENT VARIABLE BEFORE PUSH BUT I AM TOO LAZY TO DO IT
//No billing account so should not be an issue for now 
mapboxgl.accessToken = "pk.eyJ1IjoiY2hhcHUxMCIsImEiOiJjbTQzZW9tbGwwYWExMmtwczJ6OHN1cjN3In0.URQ-vjhmVKFHYe0mZkYmsw";

const heatmapLayerId = "heatmap-layer";  // Unique ID for the heatmap layer
const heatmapVisible = ref(false);  // Store heatmap visibility state
// Function to construct image URL
const getImageUrl = (imageId: string) => {
  return `/api/images/${imageId}`;
};

function normalizeLatitude(lat: number): number {
  while (lat > 90 || lat < -90) {
    lat = lat > 90 ? 180 - lat : lat < -90 ? -180 - lat : lat;
  }
  return lat;
}

function normalizeLongitude(lon: number): number {
  return ((lon + 180) % 360 + 360) % 360 - 180;
}


onMounted(async () => {
  // Fetch posts if not already loaded
  if (postStore.posts.length === 0) {
    await postStore.fetchPosts();
    console.log(postStore.posts);
  }

  // Initialize the map
  map.value = new mapboxgl.Map({
    container: mapContainer.value!,
    style: "mapbox://styles/mapbox/dark-v11",
    center: [-71.0921, 42.3601], //MIT coordinates
    zoom: 12, 
  });

  // Add markers for each post
  postStore.posts.forEach((post) => {
    const { coordinates } = post.location;
    if (coordinates?.[0] && coordinates?.[1]) {
      const marker = new mapboxgl.Marker()
        .setLngLat([normalizeLongitude(coordinates[0]), normalizeLatitude(coordinates[1])]) // [longitude, latitude]
        .addTo(map.value!);

      // Add a popup with details
      const popupHTML = `
        <div style="max-width: 200px;">
          <h3>${post.author}</h3>
          <p><strong>Description:</strong> ${post.description}</p>
          ${
            post.image
              ? `<img src="${getImageUrl(post.image)}" alt="Post image" style="width:100%;border-radius:8px;"/>`
              : ""
          }
          <p><strong>Hashtags:</strong> ${post.hashtag.join(", ")}</p>
          <p><strong>Likes:</strong> ${post.likes}</p>
        </div>
      `;

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupHTML);
      marker.setPopup(popup);
    }
  });

  // Add the heatmap layer
  map.value.on('load', () => {
    map.value!.addSource(heatmapLayerId, {
      type: 'raster', //using a GeoTiff file
      url: 'mapbox://chapu10.221irbdj',  //uploaded heatmap data tileset on mapbox
      tileSize: 256,
    });

    map.value!.addLayer({
      id: heatmapLayerId,
      type: 'raster',
      source: heatmapLayerId,
      paint: {
        'raster-opacity': 0.3,
      },
      layout: {
        visibility: 'none',  // Hide heatmap by default
      },
    });
  });
});

// Toggle heatmap visibility
const toggleHeatmap = () => {
  if (map.value) {
    const visibility = heatmapVisible.value ? 'none' : 'visible';
    map.value.setLayoutProperty(heatmapLayerId, 'visibility', visibility);
    heatmapVisible.value = !heatmapVisible.value;
  }
};
</script>

<template>
  <link href="https://api.mapbox.com/mapbox-gl-js/v2.8.1/mapbox-gl.css" rel="stylesheet" />
  <div ref="mapContainer" class="map-container"></div>

  <!-- Button to toggle heatmap visibility -->
  <button @click="toggleHeatmap" class="heatmap-button">
    Toggle Heatmap
  </button>
</template>

<style scoped>
.map-container {
  width: 100%;
  height: 100vh; /* Full screen height */
}

.heatmap-button {
  cursor: pointer;
  font-size: 1em;
  padding: 0.5em 1em;
  background-color: white;
  color: #063970;
  border-radius: 5px;
  font-weight: bold;
  position: absolute; 
  top: 80px; 
  right: 10px;
}

.heatmap-button:hover {
  background-color: #e6f7ff;
}
</style>
