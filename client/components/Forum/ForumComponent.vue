<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";

const props = defineProps(["forum"]);
const emit = defineEmits(["editForum", "refreshForums"]);
const { currentUsername } = storeToRefs(useUserStore());

const deleteForum = async () => {
  try {
    await fetchy(`/api/forums/${props.forum._id}/${props.forum.title}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshForums");
};

const goToComments = async (forumId: string, forumTitle: string) => {
  await router.push({ name: "Comments", params: { forumId, forumTitle } });
};
</script>

<template>
  <div class="forum-container">
    <p class="forum-title">{{ props.forum.title }}</p>
    <p class="author">{{ "Creator: " + props.forum.author }}</p>
    <p class="forum-description">{{ "Description: " + props.forum.description }}</p>
    <div class="base">
      <menu>
        <button class="btn-small pure-button" @click="goToComments(props.forum._id, props.forum.title)">Enter</button>
        <li v-if="props.forum.author == currentUsername">
          <button class="btn-small pure-button" @click="emit('editForum', props.forum._id)">Edit Forum</button>
        </li>
        <li v-if="props.forum.author == currentUsername">
          <button class="button-error btn-small pure-button" @click="deleteForum">Delete</button>
        </li>
      </menu>
      <article class="timestamp">
        <p v-if="props.forum.dateCreated !== props.forum.dateUpdated">Edited on: {{ formatDate(props.forum.dateUpdated) }}</p>
        <p v-else>Created on: {{ formatDate(props.forum.dateCreated) }}</p>
      </article>
    </div>
  </div>
</template>

<style scoped>
.forum-container {
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
  margin: 0.3em;
}

.forum-title {
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
