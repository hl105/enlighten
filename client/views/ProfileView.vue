<script setup lang="ts">
import PostComponent from "@/components/Post/PostComponent.vue";
import EditPostForm from "@/components/Post/EditPostForm.vue";
import UserBadges from "@/components/Reward/UserBadges.vue";
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { usePostStore } from "@/stores/posts";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";

interface Post {
  _id: string;
}
const { currentUsername } = storeToRefs(useUserStore());
const { logoutUser, deleteUser } = useUserStore();
const posts = ref<Post[]>([]);
const editing = ref("");
const postStore = usePostStore();

function updateEditing(id: string) {
  editing.value = id;
}

async function logout() {
  await logoutUser();
  void router.push({ name: "Login" });
}

async function delete_() {
  await deleteUser();
  void router.push({ name: "Login" });
}

const fetchUserPosts = async () => {
  try {
    const response = await fetchy(`/api/posts/${currentUsername.value}`, "GET");
    posts.value = response;
  } catch (error) {
    console.error("Error fetching user posts", error);
  }
};

onMounted(async () => {
  await fetchUserPosts();
});
</script>

<template>
  <div class="background"></div>
  <main class="profile">
    <div class="header">
      <img class="profile-image" src="../assets/images/default_profile.png" />
      <h1>{{ currentUsername }}</h1>
      <div class="buttons">
        <button class="button" id="logout" @click="logout">Logout</button>
        <button class="button" id="delete" @click="delete_">Delete User</button>
      </div>
    </div>
    <!--badges will go here-->
    <UserBadges></UserBadges>

    <div class="posts">
      <h2>Posts</h2>
      <div class="post-grid">
        <article v-for="post in posts" :key="post._id">
          <PostComponent v-if="editing !== post._id" :post="post" @refreshPosts="fetchUserPosts" class="post" @editPost="updateEditing" />
          <EditPostForm v-else :post="post" @refreshPosts="fetchUserPosts" @editPost="updateEditing" />
        </article>
        <!-- <PostComponent v-for="post in posts" :key="post._id" :post="post" @refreshPosts="fetchUserPosts" class="post" /> -->
      </div>
    </div>
  </main>
</template>

<style scoped>
h2 {
  color: white;
}
.header {
  display: flex;
  flex-wrap: wrap;
  max-width: 100%;
  gap: 3em;
  align-items: center;
  padding-left: 4em;
  padding-top: 2em;
}

.buttons {
  display: flex;
  padding: 2em;
  gap: 2em;
}

h1 {
  font-size: 4em;
  flex: 1 1 auto;
  color: white;
}

.profile-image {
  width: 8em;
  height: 8em;
  border-radius: 50%;
  border: 0.3em solid black;
  object-fit: cover;
}

.pure-button {
  border: 0.1em solid #000000;
  background-color: white;
}

.posts {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.post-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5em;
  margin: 2em auto;
  padding: 1em;
  max-width: 1200px;
}

.button {
  cursor: pointer;
  font-size: 1em;
  padding: 0.5em 1em;
  background-color: white;
  color: #063970;
  border-radius: 5px;
  font-weight: bold;
}

.button:hover {
  background-color: #e6f7ff;
}

.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* background: linear-gradient(to bottom, #005eff, #003d99); */
  background-image: url(@/assets/images/wallpaper.png);
  overflow: hidden;
  z-index: -1;
}
</style>
