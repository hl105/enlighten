<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import { formatDate } from "../../utils/formatDate";

const props = defineProps(["post"]);
const description = ref(props.post.description);
const hashtags = ref(props.post.hashtag.join(", "));

const emit = defineEmits(["editPost", "refreshPosts"]);

const editPost = async () => {
  try {
    await fetchy(`/api/posts/${props.post._id}`, "PATCH", {
      body: {
        description: description.value,
        hashtags: hashtags.value,
      },
    });
  } catch (e) {
    return;
  }
  emit("editPost");
  emit("refreshPosts");
};
</script>

<template>
  <form @submit.prevent="editPost">
    <p class="author">{{ props.post.author }}</p>
    <textarea id="description" v-model="description" placeholder="Edit your description..." required></textarea>

    <label for="hashtags">Hashtags (comma-separated):</label>
    <input id="hashtags" type="text" v-model="hashtags" placeholder="#sky,#observation" />
    <div class="edit-buttons">
      <li>
        <button type="submit">Save</button>
      </li>
      <li>
        <button @click="emit('editPost')">Cancel</button>
      </li>
    </div>
    <p v-if="props.post.dateCreated !== props.post.dateUpdated" class="timestamp">Edited on: {{ formatDate(props.post.dateUpdated) }}</p>
    <p v-else class="timestamp">Created on: {{ formatDate(props.post.dateCreated) }}</p>
  </form>
</template>

<style scoped>
.edit-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
form {
  background: rgba(0, 0, 0, 0.5);
  /* background-color: var(--base-bg); */
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
  width: 30em;
  color: white;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  border-radius: 4px;
  resize: none;
}

p {
  margin: 0em;
}

button:hover {
  background-color: #052b5c;
}

button {
  background-color: #063970;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5em 1em;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 13em;
  margin-left: 25%;
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

/* .base {
  display: flex;
  justify-content: space-between;
  align-items: center;
} */

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}
</style>
