<script setup lang="ts">
import CreateForumForm from "@/components/Forum/CreateForumForm.vue";
import EditForumForm from "@/components/Forum/EditForumForm.vue";
import ForumComponent from "@/components/Forum/ForumComponent.vue";
import { useForumStore } from "@/stores/forums";
import { onBeforeMount, ref } from "vue";
import SearchForumForm from "./SearchForumForm.vue";

const forumStore = useForumStore();

const editing = ref("");

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
  <section>
    <h2>Create a forum:</h2>
    <CreateForumForm @refreshForums="forumStore.fetchForums" />
  </section>
  <div class="row">
    <h2>Forums:</h2>
    <SearchForumForm @updateSearch="updateSearchParams" />
  </div>
  <section class="forums" v-if="forumStore.filteredForums.length !== 0">
    <article v-for="forum in forumStore.filteredForums" :key="forum._id">
      <ForumComponent v-if="editing !== forum._id" :forum="forum" @refreshForums="forumStore.fetchForums" @editForum="updateEditing" />
      <EditForumForm v-else :forum="forum" @refreshForums="forumStore.fetchForums" @editForum="updateEditing" />
    </article>
  </section>
  <p v-else>No forums found</p>
</template>

<style scoped>
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

.forums {
  padding: 1em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}
</style>
