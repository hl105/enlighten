<script setup lang="ts">
import CreatePostForm from "@/components/Post/CreatePostForm.vue";
import EditPostForm from "@/components/Post/EditPostForm.vue";
import PostComponent from "@/components/Post/PostComponent.vue";
import { usePostStore } from "@/stores/posts";
import { onBeforeMount, ref } from "vue";
import SearchPostForm from "./SearchPostForm.vue";

const postStore = usePostStore();

const editing = ref("");
const createPost = ref(false);

function setCreatePost() {
  createPost.value = !createPost.value;
}
function updateEditing(id: string) {
  editing.value = id;
}

function updateSearchParams(params: { author?: string; location?: string; hashtags?: string }) {
  postStore.filterPosts(params);
}

function sortPostsByLikes() {
  postStore.filteredPosts.sort((a, b) => b.likes - a.likes);
}

function sortPostsByDate() {
  postStore.filteredPosts.sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime());
}

onBeforeMount(async () => {
  await postStore.fetchPosts();
});
</script>

<template>
  <div class="post-option-container">
    <h1>Posts</h1>
    <div class="post-options">
      <SearchPostForm @updateSearch="updateSearchParams" />
      <div class="sort-buttons">
        <button @click="sortPostsByLikes" class="sort-button">Sort by Number of Likes</button>
        <button @click="sortPostsByDate" class="sort-button">Sort by Date Added</button>
      </div>
      <button @click="setCreatePost" class="sort-button create-post-button">Create Post</button>
    </div>
  </div>
  <section v-if="createPost" class="post-create">
    <CreatePostForm @refreshPosts="postStore.fetchPosts" />
  </section>
  <section class="posts" v-if="postStore.filteredPosts.length !== 0">
    <div class="posts-grid">
      <article v-for="post in postStore.filteredPosts" :key="post._id">
        <PostComponent v-if="editing !== post._id" :post="post" @refreshPosts="postStore.fetchPosts" @editPost="updateEditing" />
        <EditPostForm v-else :post="post" @refreshPosts="postStore.fetchPosts" @editPost="updateEditing" />
      </article>
    </div>
  </section>
  <p v-else>No posts found</p>
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

/* article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
} */

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5em;
  margin: 2em auto;
  padding: 1em;
  max-width: 1200px;
}

.post-create {
  display: flex;
  flex-direction: row;
  gap: 2rem;
  align-items: center;
}

.post-option-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  max-width: 60em;
}
.sort-buttons {
  display: flex;
  gap: 0.5em; /* Add spacing between buttons */
  justify-content: right;
}

.sort-button {
  background-color: #063970;
  color: #fff;
  border: none;
  padding: 0.3em 0.6em;
  font-size: 0.9em;
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.sort-button:hover {
  background-color: #052b5c;
}

.post-options {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.7em;
}

.create-post-button {
  padding: 0.5em;
  background-color: white;
  color: black;
  width: 20em;
}

.create-post-button:hover {
  background-color: #e3e4e5;
}

.post-create {
  display: flex;
  justify-content: center;
  margin-top: 2em;
}
</style>
