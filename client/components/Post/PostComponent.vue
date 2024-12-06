<script setup lang="ts">
import LikeComponent from "@/components/Post/LikeComponent.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";

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

const locationString = props.post.location ? `Location: (${props.post.location.coordinates[0]}, ${props.post.location.coordinates[1]})` : "Location: Not specified";

// Function to construct image URL
const getImageUrl = (imageId: string) => {
  return `/api/images/${imageId}`;
};
</script>

<template>
  <div class="post-container">
    <p class="author">{{ props.post.author }}</p>
    <p class="post-content">{{ props.post.description }}</p>
    <p v-if="props.post.image">
      <img :src="getImageUrl(props.post.image)" alt="Post image" />
    </p>
    <p>{{ locationString }}</p>
    <p v-if="props.post.hashtag.length">Hashtags: {{ props.post.hashtag.join(", ") }}</p>
    <LikeComponent :postId="props.post._id" />
    <div class="base">
      <menu>
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
  </div>
</template>

<style scoped>
.post-container {
  background: #063970;
  border-radius: 12px;
  padding: 1.5em;
  display: flex;
  flex-direction: column;
  gap: 1em;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  color: white;
}

img {
  max-height: 300px;
  max-width: 100%;
  width: auto;
  object-fit: cover;
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
  gap: 2em;
}

.base article:only-child {
  margin-left: auto;
}
</style>
