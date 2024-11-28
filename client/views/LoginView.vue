<script setup lang="ts">
import LoginForm from "@/components/Login/LoginForm.vue";
import RegisterForm from "@/components/Login/RegisterForm.vue";
import { useUserStore } from "@/stores/user";
import { ref } from "vue";

const { isLoggedIn, currentUsername } = useUserStore();
const showRegisterForm = ref(false);

const toggleForm = () => {
  showRegisterForm.value = !showRegisterForm.value;
};
</script>

<template>
  <main>
    <div class="animation">
      <span></span>
      <span></span>
      <span></span>
    </div>

    <section v-if="!isLoggedIn" class="login-container">
      <h1>Welcome to Enlighten</h1>
      <LoginForm v-if="!showRegisterForm" class="login-form" />
      <RegisterForm v-else />

      <button @click="toggleForm" class="toggle-form-button">
        {{ showRegisterForm ? "Back to Login" : "Create New User" }}
      </button>
    </section>

    <section v-else class="logged-in">
      <h1>Welcome, {{ currentUsername }}!</h1>
    </section>
  </main>
</template>

<style scoped>
.animation {
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

/* Shooting stars */
.animation span {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 7px;
  height: 7px;
  background: #fff;
  border-radius: 50%;
  box-shadow:
    0 0 0 4px rgba(255, 255, 255, 0.1),
    0 0 0 8px rgba(255, 255, 255, 0.1),
    0 0 20px rgba(255, 255, 255, 1);
  animation: animate 3s linear infinite;
}

.animation span::before {
  content: "";
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 300px;
  height: 1px;
  background: linear-gradient(90deg, #fff, transparent);
}

/* Shooting stars animation */
@keyframes animate {
  0% {
    transform: rotate(315deg) translateX(0);
    opacity: 1;
  }
  70% {
    opacity: 1;
  }
  100% {
    transform: rotate(315deg) translateX(-1000px);
    opacity: 0;
  }
}

.animation span:nth-child(1) {
  top: 0%;
  left: 50%;
  animation-delay: 0.3s;
  animation-duration: 1s;
}

.animation span:nth-child(2) {
  top: 50%;
  left: 70%;
  animation-delay: -0.5s;
  animation-duration: 3s;
}

.animation span:nth-child(3) {
  top: 80%;
  left: 40%;
  animation-delay: -1s;
  animation-duration: 1.5s;
}

.animation span:nth-child(4) {
  top: 20%;
  left: 10%;
  animation-delay: 3s;
  animation-duration: 2s;
}

.login-container {
  position: absolute;
  top: 50%;
  left: 50%;

  transform: translate(-50%, -50%);
  text-align: center;
  background: rgba(0, 0, 0, 0.5);
  padding: 2rem;
  width: 300px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  color: white;
  z-index: 1;
}
h1 {
  margin-bottom: 1.5rem;
  font-size: 2rem;
}

.logged-in {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
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
