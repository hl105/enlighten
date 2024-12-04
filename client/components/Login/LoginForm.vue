<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { ref } from "vue";

const username = ref("");
const password = ref("");
const { loginUser, updateSession } = useUserStore();

async function login() {
  await loginUser(username.value, password.value);
  void updateSession();
  void router.push({ name: "Home" });
}
</script>

<template>
  <form class="pure-form pure-form-aligned" @submit.prevent="login">
    <fieldset>
      <div>
        <label for="aligned-name">Username</label>
        <input v-model.trim="username" type="text" id="aligned-name" placeholder="Username" autocomplete="current-password" required />
      </div>
      <div>
        <label for="aligned-password">Password</label>
        <input type="password" v-model.trim="password" id="aligned-password" placeholder="Password" autocomplete="username" required />
      </div>
      <div>
        <button type="submit" class="pure-button pure-button-primary">Submit</button>
      </div>
    </fieldset>
  </form>
</template>

<style scoped>
h3 {
  display: flex;
  justify-content: center;
}

button {
  margin-top: 1.5rem;
  padding: 0.5rem 1.5rem;
  background-color: transparent;
  border: 1px solid #fff;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: underline;
}

button:hover {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
}
</style>
