<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["post"]);
const emit = defineEmits(["editPost", "refreshPosts"]);
const { currentUsername } = storeToRefs(useUserStore());

const deletePost = async () => {
  try {
    await fetchy(`/api/posts/${props.post._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshPosts");
};

const boostPost = async () => {
  try {
    await fetchy(`/api/posts/${props.post._id}/boost`, "POST");
  } catch {
    return;
  }
  emit("refreshPosts");
};

const locationString = props.post.location ? `Location: (${props.post.location.coordinates[0]}, ${props.post.location.coordinates[1]})` : "Location: Not specified";
</script>

<template>
  <p class="author">{{ props.post.author }}</p>
  <p>{{ props.post.description }}</p>
  <p v-if="props.post.image">Image: <img :src="props.post.image" alt="Post image" /></p>
  <p>{{ locationString }}</p>
  <p v-if="props.post.hashtag.length">Hashtags: {{ props.post.hashtag.join(", ") }}</p>
  <p>Likes: {{ props.post.likes }}</p>
  <div class="base">
    <menu>
      <li><button class="btn-small pure-button" @click="boostPost">Boost</button></li>
      <li v-if="props.post.author == currentUsername">
        <button class="btn-small pure-button" @click="emit('editPost', props.post._id)">Edit</button>
      </li>
      <li v-if="props.post.author == currentUsername">
        <button class="button-error btn-small pure-button" @click="deletePost">Delete</button>
      </li>
    </menu>
    <article class="timestamp">
      <p v-if="props.post.dateCreated !== props.post.dateUpdated">Edited on: {{ formatDate(props.post.dateUpdated) }}</p>
      <p v-else>Created on: {{ formatDate(props.post.dateCreated) }}</p>
    </article>
  </div>
</template>

<style scoped>
/* Same styles as before, with added styles for the image if needed */
img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}

p {
  margin: 0em;
}

.author {
  font-weight: bold;
  font-size: 1.2em;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.base article:only-child {
  margin-left: auto;
}
</style>
