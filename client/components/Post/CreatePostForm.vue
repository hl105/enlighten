<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import UnlockedComponent from "../Reward/UnlockedComponent.vue";

const description = ref("");
const imageFile = ref<File | null>(null);
const locationX = ref("");
const locationY = ref("");
const hashtags = ref("");
const earned = ref<string | null>(null);
const started = ref<string | null>(null);

const emit = defineEmits(["refreshPosts"]);

const createPost = async () => {
  let imageUrl = "";
  if (imageFile.value) {
    // Create FormData to upload the image
    const formData = new FormData();
    formData.append("image", imageFile.value);

    // Upload the image to the server
    let response;
    try {
      response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
    } catch (error) {
      alert("Failed to upload image.");
      return;
    }

    const data = await response.json();
    if (!response.ok) {
      alert(data.error || "Failed to upload image.");
      return;
    }
    imageUrl = data.imageUrl;
  }

  // Now create the post with the imageUrl
  try {
    const response = await fetchy("/api/posts", "POST", {
      body: {
        description: description.value,
        image: imageUrl,
        location: { x: locationX.value, y: locationY.value },
        hashtags: hashtags.value,
      },
    });
    // for rewarding badges
    earned.value = response.earned; // user earned a badge
    started.value = response.started; // user started a new badge
  } catch (error) {
    console.error("Something went wrong when posting", error);
  }
  emit("refreshPosts");
  emptyForm();
};

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    imageFile.value = target.files[0];
  } else {
    imageFile.value = null;
  }
};

const emptyForm = () => {
  description.value = "";
  imageFile.value = null;
  locationX.value = "";
  locationY.value = "";
  hashtags.value = "";
};
</script>

<template>
  <form @submit.prevent="createPost" enctype="multipart/form-data">
    <label for="description">Description:</label>
    <textarea id="description" v-model="description" placeholder="Describe your post..." required></textarea>

    <label for="image">Upload Image:</label>
    <input id="image" type="file" @change="handleFileChange" accept="image/*" />

    <label for="locationX">Location X:</label>
    <input id="locationX" type="number" v-model="locationX" placeholder="Longitude" />

    <label for="locationY">Location Y:</label>
    <input id="locationY" type="number" v-model="locationY" placeholder="Latitude" />

    <label for="hashtags">Hashtags (comma-separated):</label>
    <input id="hashtags" type="text" v-model="hashtags" placeholder="#sky,#observation" />

    <button type="submit" class="pure-button-primary pure-button">Create Post</button>
  </form>
  <!-- Display the UnlockedComponent if earned or started conditions are met -->
  <UnlockedComponent v-if="earned === 'updated' || started === 'start new badge'" :earned="earned" :started="started" />
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

textarea,
input {
  font-family: inherit;
  font-size: inherit;
  padding: 0.5em;
  border-radius: 4px;
}

textarea {
  height: 6em;
  resize: none;
}
</style>
