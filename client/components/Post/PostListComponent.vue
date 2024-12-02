<script setup lang="ts">
import { usePostStore } from "@/stores/posts";
import { onBeforeMount, ref } from "vue";
import CreatePostForm from "@/components/Post/CreatePostForm.vue";
import EditPostForm from "@/components/Post/EditPostForm.vue";
import PostComponent from "@/components/Post/PostComponent.vue";
import SearchPostForm from "./SearchPostForm.vue";

const postStore = usePostStore();

const editing = ref("");

function updateEditing(id: string) {
  editing.value = id;
}

function updateSearchParams(params: { author?: string; location?: string; hashtags?: string }) {
  postStore.filterPosts(params);
}

onBeforeMount(async () => {
  await postStore.fetchPosts();
});
</script>

<template>
  <section>
    <h2>Create a post:</h2>
    <CreatePostForm @refreshPosts="postStore.fetchPosts" />
  </section>
  <div class="row">
    <h2>Posts:</h2>
    <SearchPostForm @updateSearch="updateSearchParams" />
  </div>
  <section class="posts" v-if="postStore.filteredPosts.length !== 0">
    <article v-for="post in postStore.filteredPosts" :key="post._id">
      <PostComponent v-if="editing !== post._id" :post="post" @refreshPosts="postStore.fetchPosts" @editPost="updateEditing" />
      <EditPostForm v-else :post="post" @refreshPosts="postStore.fetchPosts" @editPost="updateEditing" />
    </article>
  </section>
  <p v-else>No posts found</p>
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

.posts {
  padding: 1em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}
</style>
