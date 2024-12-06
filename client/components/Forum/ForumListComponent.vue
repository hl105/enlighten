<script setup lang="ts">
import CreateForumForm from "@/components/Forum/CreateForumForm.vue";
import EditForumForm from "@/components/Forum/EditForumForm.vue";
import ForumComponent from "@/components/Forum/ForumComponent.vue";
import { useForumStore } from "@/stores/forums";
import { onBeforeMount, ref } from "vue";
import SearchForumForm from "./SearchForumForm.vue";

const forumStore = useForumStore();

const editing = ref("");
const createForum = ref(false);

function setCreateForum() {
  createForum.value = !createForum.value;
}
function updateEditing(id: string) {
  editing.value = id;
}

function updateSearchParams(params: { author?: string; title?: string }) {
  forumStore.filterForums(params);
}

onBeforeMount(async () => {
  await forumStore.fetchForums();
});
</script>

<template>
  <div class="forum-option-container">
    <h1>Forums</h1>
    <SearchForumForm @updateSearch="updateSearchParams" />
    <button @click="setCreateForum" class="create-forum-button">Create Forum</button>
  </div>
  <section v-if="createForum" class="forum-create">
    <CreateForumForm @refreshForums="forumStore.fetchForums" />
  </section>
  <section class="forums" v-if="forumStore.filteredForums.length !== 0">
    <div class="forums-grid">
      <article v-for="forum in forumStore.filteredForums" :key="forum._id">
        <ForumComponent v-if="editing !== forum._id" :forum="forum" @refreshForums="forumStore.fetchForums" @editForum="updateEditing" />
        <EditForumForm v-else :forum="forum" @refreshForums="forumStore.fetchForums" @editForum="updateEditing" />
      </article>
    </div>
  </section>
  <p v-else>No forums found</p>
</template>

<style scoped>
h1 {
  margin-top: 2em;
  color: white;
}

section {
  margin: 0 auto;
  max-width: 60em;
}

.forum-create {
  display: flex;
  flex-direction: row;
  gap: 2rem;
  align-items: center;
  justify-content: center;
}

.create-forum-button {
  background-color: #063970;
  color: #fff;
  border: none;
  padding: 0.5em 0.8em;
  font-size: 0.9em;
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-bottom: 2em;
}

.create-forum-button:hover {
  background-color: #052b5c;
}

/* article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
} */

.forums-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5em;
  margin: 2em auto;
  padding: 1em;
  max-width: 1200px;
}

.forums {
  padding: 1em;
}

.forum-option-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  max-width: 60em;
}
</style>
